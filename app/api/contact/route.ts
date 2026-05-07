import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

// Limit to 3 requests per minute per IP
const limiter = rateLimit({
  interval: 60 * 1000, 
  uniqueTokenPerInterval: 500,
});

const contactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(500),
});

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(3, ip); // 3 requests per minute
    } catch {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // 2. Parse and Validate body (Zod provides SQLi & XSS basic safeguard by controlling types)
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    // 3. Mock DB Operation (using prepared statements in real scenario)
    // console.log("Saving securely to DB:", validatedData.email);
    // await prisma.contact.create({ data: validatedData })

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
