import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { type, value, targetUrl } = await request.json();

        const rule = await prisma.rule.create({
            data: {
                type,
                value,
                targetUrl,
                linkId: id,
            },
        });

        return NextResponse.json(rule);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const rules = await prisma.rule.findMany({
            where: { linkId: id },
        });

        return NextResponse.json(rules);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const url = new URL(request.url);
        const ruleId = url.searchParams.get("ruleId");

        if (!ruleId) {
            return NextResponse.json({ error: "Missing ruleId" }, { status: 400 });
        }

        await prisma.rule.delete({
            where: { id: ruleId },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
