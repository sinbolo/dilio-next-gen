import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Sistema de Rate Limiting Básico en Edge (Memoria)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  // 1. Content Security Policy (CSP)
  // Permitimos scripts de SoundCloud y YouTube, así como estilos inline necesarios para React.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://w.soundcloud.com https://www.youtube.com https://s.ytimg.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://img.youtube.com https://i.ytimg.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://w.soundcloud.com https://www.youtube.com;
    connect-src 'self' https://api.soundcloud.com https://w.soundcloud.com;
  `.replace(/\s{2,}/g, ' ').trim();

  const response = NextResponse.next();

  // 2. Cabeceras Profesionales (Anti-XSS, Clickjacking)
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Removed HSTS for localhost compatibility


  // 3. Rate Limiting Interceptor para APIs (/api/*)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Fallback robusto para la IP sin usar request.ip (Next.js 15 Edge constraint)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    const limit = 10; // 10 peticiones máximo
    const windowMs = 10000; // por cada 10 segundos
    const now = Date.now();

    const requestData = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > requestData.resetTime) {
       requestData.count = 1;
       requestData.resetTime = now + windowMs;
    } else {
       requestData.count++;
    }
    rateLimitMap.set(ip, requestData);

    if (requestData.count > limit) {
      // Uso del secret de .env.local para context logging/headers (mock API key protection)
      const enterpriseKey = process.env.MOCK_API_KEY;
      return new NextResponse(
        JSON.stringify({ 
          error: 'Rate Limit Exceeded', 
          message: 'Demasiadas peticiones. Intente de nuevo más tarde.',
          tier: enterpriseKey ? 'Protected_Node' : 'Public_Node'
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Se ejecuta en todas las rutas excepto en los Next assets estáticos
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
