import { COOKIES } from '@/lib/cookies';
import { QUERY_PARAMS, ROUTES } from '@/lib/routes';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const protectedRoutes = [ROUTES.PROTECTED_PAGE];
  const isPathProtected = protectedRoutes.some((route) => route === pathname);
  const res = NextResponse.next();
  if (isPathProtected) {
    const token = req.cookies.get(COOKIES.TOKEN)?.value;
    if (!token) {
      const url = new URL(ROUTES.LOGIN, req.url);
      url.searchParams.set(QUERY_PARAMS.REDIRECT, pathname);
      return NextResponse.redirect(url);
    }
  }

  return res;
}
