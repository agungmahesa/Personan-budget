import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://personal-finance.mstudio.fun"),
  title: {
    default: "BudgetFlow — Best Privacy-First Personal Finance & Budget Tracker for Google Sheets ($15 One-Time)",
    template: "%s | BudgetFlow Guides"
  },
  description: "BudgetFlow is a privacy-first personal finance tracker and modern web dashboard powered by your own Google Sheets. Track income, expenses, budgets, savings goals, debts, and net worth for a $15 one-time payment. No monthly subscription, no bank login required.",
  keywords: [
    "best Google Sheets budget template",
    "privacy first personal finance tracker",
    "YNAB alternative no subscription",
    "Mint alternative private",
    "one-time payment budget app",
    "Google Drive expense tracker",
    "net worth tracker spreadsheet",
    "Monarch Money alternative"
  ],
  openGraph: {
    type: "website",
    url: "https://personal-finance.mstudio.fun/",
    title: "BudgetFlow — Privacy-First Personal Finance Tracker for Google Sheets",
    description: "Ditch $109/year YNAB subscriptions. BudgetFlow turns your Google Sheets into a modern personal finance app. 100% private in your Google Drive. $15 one-time payment.",
    siteName: "BudgetFlow"
  },
  twitter: {
    card: "summary_large_image",
    title: "BudgetFlow — Privacy-First Personal Finance Tracker for Google Sheets",
    description: "Ditch $109/year subscriptions. BudgetFlow turns your Google Sheets into a modern personal finance app. 100% private in your Google Drive. $15 one-time payment."
  },
  alternates: {
    canonical: "https://personal-finance.mstudio.fun/"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
