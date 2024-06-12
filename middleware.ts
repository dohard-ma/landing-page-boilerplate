import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("--------pathname", pathname);

  // 设置 pathname 到请求头
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  return response;
}

export const config = {
  matcher: ["/((?!_next)(?!.*\\.(?:ico|png|svg|jpg|jpeg|xml|txt)$)(?!/api).*)"],
};

