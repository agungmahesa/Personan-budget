import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const links = await prisma.link.findMany({
    include: {
      clicks: {
        select: { ip: true }
      },
      _count: {
        select: { clicks: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return <DashboardClient initialLinks={links} />;
}
