import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow all BudgetFlow pages, SEO/GEO guides, static files, and API routes
    if (
        pathname === "/" ||
        pathname.includes(".") ||
        pathname.startsWith("/guides") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/analytics")
    ) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
