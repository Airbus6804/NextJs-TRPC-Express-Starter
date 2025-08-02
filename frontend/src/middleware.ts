import { decodeJwt } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getBaseUrl } from "./app/lib/trpc/shared";
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("bearer_token");

  if (!token) {
    return NextResponse.next();
  }

  const payload = decodeJwt(token.value);


  if (payload.exp && payload.exp > Date.now() / 1000) {
    return NextResponse.next();
  }

  try {
    const stream = await fetch(`${getBaseUrl()}/api/auth/token`, {
      method: "GET",
      headers: {
        cookie: request.cookies.toString()
      },
    });
    const data = await stream.json();

    if (!data.token) {
      return NextResponse.next();
    }

    const cookieStore = await cookies();
    cookieStore.set("bearer_token", data.token);


    return NextResponse.next();
  } catch (error) { 
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
