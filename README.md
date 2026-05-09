# BudgetFlow

> **The Ultimate Serverless Personal Finance Tracker — Powered by Google Sheets**

BudgetFlow is a premium personal finance web application that stores all your data in your own Google Drive. No subscriptions, no data harvesting, no third-party servers — just beautiful, private budgeting.

---

## ✨ Features

- **📊 Live Dashboard** — Monthly income, expenses, balance & savings rate with real-time charts
- **💸 Transaction Tracking** — Unlimited entries with categories, search & filter
- **🎯 Budget Targets** — Auto-calculates spending from transactions per category/month
- **💍 Savings Goals** — Ring-progress tracker for any financial goal
- **📉 Debt & Loan Manager** — Track balances and log payments
- **📈 Net Worth Calculator** — Assets minus liabilities, updated in real time
- **📋 Financial Reports** — Monthly summaries & yearly trend charts
- **🔒 100% Private** — All data stays in YOUR Google Drive

---

## 🚀 Quick Start

1. Create a new [Google Sheet](https://sheets.new)
2. Go to **Extensions → Apps Script**
3. Paste the code from `assets/Code.gs`
4. Click **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL
6. Open `index.html` in your browser and paste the URL

That's it — you're live in under 5 minutes!

---

## 📁 File Structure

```
BudgetFlow/
├── index.html              ← Main application
├── landing.html            ← Marketing landing page
└── assets/
    ├── app.js              ← Frontend logic
    ├── styles.css          ← UI styles
    ├── Code.gs             ← Google Apps Script backend
    ├── User_Manual.html    ← Step-by-step guide
    └── dashboard-preview.png
```

---

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Database**: Google Sheets (via Apps Script Web App)
- **Charts**: Chart.js
- **Fonts**: Inter (Google Fonts)

---

## 📄 License

MIT License — free to use and modify.
