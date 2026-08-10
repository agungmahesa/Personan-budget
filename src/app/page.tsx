import DashboardClient from "@/components/DashboardClient";

// Static demo data - no database required
const demoLinks = [
  {
    id: '1',
    slug: 'shopee-promo',
    originalUrl: 'https://shopee.co.id/promo/harbolnas',
    title: 'Shopee Harbolnas 12.12',
    createdAt: new Date('2024-12-01'),
    redirectType: 302,
    _count: { clicks: 1284 },
    clicks: Array.from({ length: 89 }, (_, i) => ({ ip: `192.168.1.${i}` })),
  },
  {
    id: '2',
    slug: 'tokopedia-flash',
    originalUrl: 'https://tokopedia.com/flash-sale',
    title: 'Tokopedia Flash Sale',
    createdAt: new Date('2024-12-05'),
    redirectType: 301,
    _count: { clicks: 876 },
    clicks: Array.from({ length: 64 }, (_, i) => ({ ip: `10.0.0.${i}` })),
  },
  {
    id: '3',
    slug: 'lazada-deals',
    originalUrl: 'https://lazada.co.id/campaign/birthday',
    title: 'Lazada Birthday Sale',
    createdAt: new Date('2024-12-10'),
    redirectType: 302,
    _count: { clicks: 542 },
    clicks: Array.from({ length: 41 }, (_, i) => ({ ip: `172.16.0.${i}` })),
  },
];

export default function DashboardPage() {
  return <DashboardClient initialLinks={demoLinks} />;
}
