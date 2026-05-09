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

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const LOGO_URL = "https://www.dilio.es/assets/logo_bio_off_clean.png";
const NOTIFY_ADMIN_EMAIL = "realdiliomusic@gmail.com";

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

    // Send welcome email to the Fan
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'DILIO <onboarding@resend.dev>',
        to: validatedData.email,
        subject: 'EXCLUSIVE ACCESS: DILIO THE SESSIONS',
        html: getWelcomeEmailHtml(LOGO_URL),
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Resend error:", error);
      throw new Error("Failed to send welcome email");
    }

    // Notify Admin about new subscriber
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'DILIO System <onboarding@resend.dev>',
        to: NOTIFY_ADMIN_EMAIL,
        subject: 'NUEVO SUSCRIPTOR EN DILIO.ES',
        html: `<p>Nuevo fan suscrito: <b>${validatedData.email}</b></p>`,
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
