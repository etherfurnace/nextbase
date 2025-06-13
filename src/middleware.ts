import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // 如果用户已登录但访问登录页面，重定向到首页
    if (token && pathname.startsWith('/api/auth/signin')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // 如果访问受保护路由但未登录，重定向到 NextAuth 登录页
    if (!token && isProtectedRoute(pathname)) {
      const signInUrl = new URL('/api/auth/signin', req.url);
      // 直接使用字符串而不是构建 URL 对象，避免包含额外参数
      signInUrl.searchParams.set('callbackUrl', '/');
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// 定义需要保护的路由
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    '/datasets/manage',
    '/datasets/task'
  ];
  
  const publicRoutes = [
    '/api/auth',
    '/',
    // 添加其他公开路由
  ];

  // 如果是公开路由，不需要保护
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return false;
  }

  // 如果明确是受保护路由
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    return true;
  }

  // 默认情况下，保护所有其他路由
  return true;
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
