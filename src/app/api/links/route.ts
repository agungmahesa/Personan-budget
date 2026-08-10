import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const { title, originalUrl, slug, redirectType } = await request.json();

        if (!originalUrl) {
            return NextResponse.json({ error: "Original URL is required" }, { status: 400 });
        }

        // Generate a slug if not provided
        const finalSlug = slug || Math.random().toString(36).substring(2, 8);

        const link = await prisma.link.create({
            data: {
                title,
                originalUrl,
                slug: finalSlug,
                redirectType: redirectType || 302,
            },
        });

        return NextResponse.json(link);
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    const links = await prisma.link.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(links);
}
