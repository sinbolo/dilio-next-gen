import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { getWelcomeEmailHtml } from '@/lib/email-templates';

const limiter = rateLimit({
  interval: 60 * 1000, 
  uniqueTokenPerInterval: 500,
});

const subscribeSchema = z.object({
  email: z.string().email(),
});

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_DrFCN8sF_MNHDEUoK4voS4hTXdk3YCcXt';
const LOGO_URL = "https://www.dilio.es/assets/logo_bio_off_clean.png";
const NOTIFY_ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "info@dilio.es";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(5, ip); // 5 attempts per minute
    } catch {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const validatedData = subscribeSchema.parse(body);

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing");
      return NextResponse.json({ success: true, message: "Mock success (API Key missing)" }, { status: 200 });
    }

    const FROM_EMAIL = process.env.EMAIL_FROM_TOUR || 'DILIO <info@dilio.es>';
    const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

    const isTester = validatedData.email === 'mendezz1324@gmail.com';
    if (isTester) console.log("Tester email detected in subscribe, bypassing idempotency");

    // 1. Add to Resend Audience (DILIO Fans)
    if (AUDIENCE_ID) {
      try {
        const audienceRes = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'X-Idempotency-Key': isTester
              ? `audience-test-${Date.now()}`
              : `audience-${validatedData.email}-${new Date().toISOString().slice(0, 13)}`
          },
          body: JSON.stringify({
            email: validatedData.email,
            unsubscribed: false,
          }),
        });

        if (!audienceRes.ok) {
          const error = await audienceRes.json();
          console.error("Resend Audience Error:", error);
          // We don't block the welcome email if audience sync fails, but we log it.
        }
      } catch (e) {
        console.error("Failed to add contact to audience:", e);
      }
    }

    // 2. Send welcome email to the Fan
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'X-Idempotency-Key': isTester
          ? `welcome-test-${Date.now()}`
          : `welcome-${validatedData.email}-${new Date().toISOString().slice(0, 13)}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: validatedData.email,
        subject: 'EXCLUSIVE ACCESS: DILIO THE SESSIONS',
        html: getWelcomeEmailHtml(LOGO_URL),
        headers: {
          'X-Auto-Response-Suppress': 'All',
          'Auto-Submitted': 'auto-generated'
        }
      }),
    });

    if (!res.ok) {
      const errorBody = await res.json();
      console.error("Resend error (status", res.status, "):", JSON.stringify(errorBody));
      throw new Error(`Failed to send welcome email: ${errorBody?.message || res.status}`);
    }

    // 3. Notify Admin about new subscriber
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'X-Idempotency-Key': `admin-notify-${validatedData.email}-${new Date().getTime()}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: NOTIFY_ADMIN_EMAIL,
        subject: 'NUEVO SUSCRIPTOR EN DILIO.ES',
        reply_to: validatedData.email,
        html: `<p>Nuevo fan suscrito: <b>${validatedData.email}</b></p>`,
        headers: {
          'X-Auto-Response-Suppress': 'All',
          'Auto-Submitted': 'auto-generated'
        }
      }),
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Subscribe API Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
