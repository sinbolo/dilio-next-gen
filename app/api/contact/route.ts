import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { getBookingEmailHtml, getBookingConfirmationEmailHtml } from '@/lib/email-templates';

const limiter = rateLimit({
  interval: 60 * 1000, 
  uniqueTokenPerInterval: 500,
});

const contactSchema = z.object({
  email: z.string().email().refine((email) => {
    const BLOCKED = ["yopmail.com","yopmail.fr","mailinator.com","mailinator.net",
      "guerrillamail.com","guerrillamail.org","guerrillamail.net","guerrillamail.biz",
      "guerrillamail.de","guerrillamail.info","sharklasers.com","grr.la",
      "temp-mail.org","temp-mail.io","tempmail.com","tempmail.net","10minutemail.com",
      "trashmail.com","trashmail.me","trashmail.net","trashmail.at","trashmail.io",
      "maildrop.cc","mailnesia.com","discard.email","spamgourmet.com","spam4.me",
      "msn.com","mail.ru","inbox.ru","list.ru","bk.ru","qq.com",
      "throwaway.email","fakemailgenerator.com","fakeinbox.com","dispostable.com",
      "getairmail.com","moakt.com","emailondeck.com","mytrashmail.com",
      "live.cn","live.co.uk","spamavert.com","spamex.com","spamgap.com",
    ];
    const domain = email.split("@")[1]?.toLowerCase();
    return domain ? !BLOCKED.includes(domain) : false;
  }, { message: "Email domain not allowed. Please use a professional email." }),
  message: z.string().min(10).max(500),
});

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_DrFCN8sF_MNHDEUoK4voS4hTXdk3YCcXt';
const LOGO_URL = "https://www.dilio.es/assets/logo_bio_off_clean.png";
const DESTINATION_EMAIL = "booking@dilio.es";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(3, ip);
    } catch {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing");
      return NextResponse.json({ success: true, message: "Mock success (API Key missing)" }, { status: 200 });
    }

    const FROM_EMAIL = process.env.EMAIL_FROM_BOOKING || 'DILIO Management <booking@dilio.es>';

    // 1. Send email to DILIO Management (Booking Notification)
    const isTester = validatedData.email === 'mendezz1324@gmail.com';
    if (isTester) console.log("Tester email detected, bypassing idempotency");

    const adminRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'X-Idempotency-Key': isTester 
          ? `admin-test-${Date.now()}`
          : `admin-${validatedData.email}-${new Date().toISOString().slice(0, 13)}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: DESTINATION_EMAIL,
        reply_to: validatedData.email,
        subject: `NEW BOOKING INQUIRY: ${validatedData.email}`,
        html: getBookingEmailHtml(LOGO_URL, validatedData),
        headers: {
          'X-Auto-Response-Suppress': 'All',
          'Auto-Submitted': 'auto-generated'
        }
      }),
    });

    if (!adminRes.ok) {
      const error = await adminRes.json();
      console.error("Resend Admin Error:", error);
      throw new Error("Failed to send admin notification");
    }

    // 2. Send professional confirmation to the Client
    const clientRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'X-Idempotency-Key': isTester 
          ? `client-test-${Date.now()}`
          : `client-${validatedData.email}-${new Date().toISOString().slice(0, 13)}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: validatedData.email,
        subject: 'Booking Inquiry Received - DILIO',
        html: getBookingConfirmationEmailHtml(LOGO_URL, validatedData.message),
        headers: {
          'X-Auto-Response-Suppress': 'All',
          'Auto-Submitted': 'auto-generated'
        }
      }),
    });

    if (!clientRes.ok) {
      const error = await clientRes.json();
      console.error("Resend Client Error:", error);
      // We don't necessarily want to fail the whole request if only the client email fails, 
      // but for "premium" experience, we should log it.
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Contact API Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
