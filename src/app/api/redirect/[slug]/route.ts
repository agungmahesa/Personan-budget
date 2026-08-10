import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    // 1. Find the link
    const link = await prisma.link.findUnique({
        where: { slug },
        include: { rules: true }
    });

    if (!link) {
        return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // 2. Get client info for tracking
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userAgent = headerList.get("user-agent") || "Unknown";
    const referrer = headerList.get("referer") || "Direct";
    const country = headerList.get("x-vercel-ip-country") || "Unknown"; // Vercel provides country header

    // 3. Determine target URL based on rules
    let targetUrl = link.originalUrl;
    let matchedByTargeting = false;

    // A. Priority targeting (Device then Geo)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    const deviceRule = link.rules.find(
        (r) => r.type === "device" && r.value.toLowerCase() === (isMobile ? "mobile" : "desktop")
    );

    if (deviceRule) {
        targetUrl = deviceRule.targetUrl;
        matchedByTargeting = true;
    } else {
        const geoRule = link.rules.find(
            (r) => r.type === "geo" && r.value.toUpperCase() === country.toUpperCase()
        );
        if (geoRule) {
            targetUrl = geoRule.targetUrl;
            matchedByTargeting = true;
        }
    }

    // B. Rotator Logic (If not specifically matched by targeting rules OR if targeting failed)
    const rotatorRules = link.rules.filter((r) => r.type === "rotator");
    if (rotatorRules.length > 0) {
        const totalWeight = rotatorRules.reduce((acc, r) => acc + (parseInt(r.value) || 0), 0);
        const random = Math.random() * 100; // Assume weights are out of 100

        let currentSum = 0;
        let pickedRotator = false;

        for (const rule of rotatorRules) {
            currentSum += parseInt(rule.value) || 0;
            if (random <= currentSum) {
                targetUrl = rule.targetUrl;
                pickedRotator = true;
                break;
            }
        }
        
        // If we didn't pick a rotator (e.g. random > sum of weights), 
        // we keep the targetUrl from the targeting logic or originalUrl.
    }

    // 4. Log the click (Asynchronously for performance)
    // We use await here for reliability in this demo, but could be backgrounded.
    await prisma.click.create({
        data: {
            linkId: link.id,
            ip,
            userAgent,
            referrer,
            country,
            device: isMobile ? "mobile" : "desktop"
        }
    });

    // 5. Redirect (301 or 302 based on link settings)
    const status = link.redirectType === 301 ? 301 : 302;
    return NextResponse.redirect(targetUrl, status);
}
