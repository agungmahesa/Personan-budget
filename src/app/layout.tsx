import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1806486647139872');
            fbq('track', 'PageView');

            // Auto-track Checkout Clicks & Interactive Demo Engagement
            document.addEventListener('click', function(e) {
              var target = e.target.closest('a, button');
              if (!target) return;
              var href = target.getAttribute('href') || '';
              if (href.indexOf('gumroad.com') !== -1) {
                if (typeof window.fbq === 'function') {
                  window.fbq('track', 'InitiateCheckout', {
                    content_name: 'BudgetFlow Lifetime License',
                    currency: 'USD',
                    value: 15.00
                  });
                }
              } else if (href.indexOf('#interactive-demo') !== -1 || target.classList.contains('demo-tab-btn')) {
                if (typeof window.fbq === 'function') {
                  window.fbq('track', 'ViewContent', {
                    content_name: 'BudgetFlow Live Interactive Demo',
                    currency: 'USD',
                    value: 15.00
                  });
                }
              }
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1806486647139872&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
