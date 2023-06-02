import { COOKIES } from '@/lib/cookies';
import { QUERY_PARAMS, ROUTES } from '@/lib/routes';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const protectedExactRoutes = [ROUTES.PROTECTED_PAGE];
  const protectedFamilyRoutes = [ROUTES.SETTINGS];
  const isPathProtected =
    protectedExactRoutes.some((route) => route === pathname) ||
    protectedFamilyRoutes.some((route) => pathname.startsWith(route));

  const res = NextResponse.next();
  const token = req.cookies.get(COOKIES.TOKEN)?.value;

  if (isPathProtected) {
    if (!token) {
      const url = new URL(ROUTES.LOGIN, req.url);
      url.searchParams.set(QUERY_PARAMS.REDIRECT, pathname);
      url.searchParams.set(QUERY_PARAMS.CANCEL_REDIRECT, 'true');
      return NextResponse.redirect(url);
    }
  } else {
    if (token && pathname.startsWith(ROUTES.LOGIN)) {
      const url = new URL(ROUTES.HOME, req.url);
      return NextResponse.redirect(url);
    }
  }

  return res;
}
