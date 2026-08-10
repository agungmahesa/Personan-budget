import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip if it's not a short link (ignore dashboard, api, static files, etc)
    if (
        pathname.includes(".") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/analytics") ||
        pathname === "/"
    ) {
        return NextResponse.next();
    }

    const slug = pathname.slice(1);

    // We need to fetch the link from the DB. 
    // Since Prisma doesn't run in Edge Runtime (usually), 
    // we can use a simple fetch to an internal API or a direct DB call if using a compatible driver.
    // For simplicity in this demo, I'll redirect to an API route that handles the logic.

    return NextResponse.redirect(new URL(`/api/redirect/${slug}`, request.url));
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
