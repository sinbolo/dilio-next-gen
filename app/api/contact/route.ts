import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { getBookingEmailHtml } from '@/lib/email-templates';

const limiter = rateLimit({
  interval: 60 * 1000, 
  uniqueTokenPerInterval: 500,
});

const contactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(500),
});

const RESEND_API_KEY = process.env.RESEND_API_KEY;
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

    // Send email to Alejandro (Booking Notification)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'DILIO Booking <onboarding@resend.dev>',
        to: DESTINATION_EMAIL,
        subject: `NEW BOOKING INQUIRY: ${validatedData.email}`,
        html: getBookingEmailHtml(LOGO_URL, validatedData),
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Resend error:", error);
      throw new Error("Failed to send booking email");
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
