import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  // 🔓 Rotas públicas permitidas (somente login e register)
  const publicRoutes = ['/login', '/register'];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 🔐 Bloquear todas as outras rotas se não tiver token
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Proteger todas as rotas exceto as públicas
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
};
