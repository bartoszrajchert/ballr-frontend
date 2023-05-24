import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const protectedRoutes = ['/protected-page'];
  const isPathProtected = protectedRoutes.some((route) => route === pathname);
  const res = NextResponse.next();
  if (isPathProtected) {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('redirect', pathname.slice(1));
      return NextResponse.redirect(url);
    }
  }

  return res;
}
