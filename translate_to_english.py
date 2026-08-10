import os
import re

# Read index.html
with open("public/index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace demo header title & text to English
content = re.sub(
    r'<h2 style="font-size:1\.6rem; font-weight:800; color:var\(--dark\); margin-top:8px;">Coba Aplikasi BudgetFlow Langsung!</h2>',
    '<h2 style="font-size:1.6rem; font-weight:800; color:var(--dark); margin-top:8px;">Try BudgetFlow Live Demo Below!</h2>',
    content
)

content = re.sub(
    r'Simulasi interaktif 100% sama seperti template Google Sheets asli dengan UI App modern & data contoh\.',
    '100% interactive simulation matching the original Google Sheets template with a modern app UI & preloaded demo data.',
    content
)

# Translate labels in demo section
translations = {
  "Arus Kas Bulanan": "Monthly Cash Flow",
  "Maret 2026": "March 2026",
  "+ SIMPAN KE GOOGLE SHEETS (DEMO)": "+ SAVE TO GOOGLE SHEETS (DEMO)",
  "JENIS": "TYPE",
  "JUMLAH (RP)": "AMOUNT ($)",
  "KETERANGAN": "DESCRIPTION",
  "KATEGORI": "CATEGORY",
  "Contoh: Belanja Bulanan / Bonus": "e.g. Monthly Groceries / Project Bonus",
  "Transaksi Terbaru": "Recent Transactions",
  "Lihat Semua →": "View All →",
  "Tanggal": "Date",
  "Keterangan": "Description",
  "Deskripsi": "Description",
  "Kategori": "Category",
  "Jumlah": "Amount",
  "Jenis": "Type",
  "Daftar Transaksi Lengkap": "Complete Transactions List",
  "transaksi": "transactions",
  "Target Budget Bulanan": "Monthly Budget Targets",
  "Terpakai": "Spent",
  "Limit": "Limit",
  "Target Tabungan & Impian": "Savings Goals & Dreams",
  "Terkumpul": "Saved",
  "Goal": "Target",
  "Daftar Hutang & Cicilan": "Debts & Loans Tracker",
  "Nama Pinjaman": "Loan Name",
  "Total Pinjaman": "Total Loan",
  "Sisa Hutang": "Remaining Debt",
  "Bunga p.a": "Interest p.a.",
  "Progress Pelunasan": "Repayment Progress",
  "Daftar Aset & Kekayaan": "Assets & Net Worth Portfolio",
  "Nama Aset": "Asset Name",
  "Nilai Estimasi": "Estimated Value",
  "Porsi Portofolio": "Portfolio Share",
  "Gaji Bulanan Utama": "Primary Monthly Salary",
  "Belanja Bulanan Supermarket": "Supermarket Monthly Groceries",
  "Makan Malam Restoran": "Restaurant Dinner",
  "Bensin & E-Toll": "Gasoline & Toll Pass",
  "Tagihan Listrik & Wifi": "Electricity & WiFi Bill",
  "Bonus Project Freelance": "Freelance Project Bonus",
  "Langganan Netflix & Spotify": "Netflix & Spotify Subscription",
  "Dana Darurat (6 Bulan)": "Emergency Fund (6 Months)",
  "Tabungan Umroh": "Vacation & Travel Goal",
  "DP Rumah Pilihan": "Home Down Payment",
  "KPR Bank Syariah": "Home Mortgage",
  "Cicilan Mobil": "Car Financing Loan",
  "Rumah Tinggal (Nilai Pasar)": "Primary Residence (Market Value)",
  "Portofolio Saham & Reksadana": "Stock & ETF Portfolio",
  "Tabungan & Kas": "Cash & Savings Account",
  "Emas Logam Mulia (50 gram)": "Gold Bullion Reserve (50g)"
}

for original, replacement in translations.items():
    content = content.replace(original, replacement)

# Replace Currency function in JS to use USD $
content = re.sub(
    r'const fmtRupiah = \(n\) => "Rp " \+ Number\(n \|\| 0\)\.toLocaleString\("id-ID"\);',
    'const fmtRupiah = (n) => "$ " + Number(n || 0).toLocaleString("en-US");',
    content
)

# Replace initial demo dataset values to USD friendly numbers
dataset_replacements = [
  ('15000000', '7500'),
  ('2500000', '1200'),
  ('350000', '180'),
  ('450000', '220'),
  ('870000', '340'),
  ('4000000', '2000'),
  ('220000', '90'),
  ('3500000', '1800'),
  ('1850000', '950'),
  ('1500000', '800'),
  ('850000', '420'),
  ('3000000', '1500'),
  ('2000000', '1000'),
  ('1450000', '720'),
  ('1000000', '500'),
  ('620000', '310'),
  ('50000000', '25000'),
  ('35000000', '17500'),
  ('22500000', '11000'),
  ('120000000', '60000'),
  ('48000000', '24000'),
  ('350000000', '180000'),
  ('280000000', '140000'),
  ('180000000', '90000'),
  ('45000000', '22500'),
  ('650000000', '325000'),
  ('85000000', '42500'),
  ('65000000', '32500')
]

for old_val, new_val in dataset_replacements:
    content = content.replace(old_val, new_val)

# Fix chart tick formatting to $
content = re.sub(
    r'callback: v => "Rp " \+ \(v/1000000\) \+ "jt"',
    'callback: v => "$ " + v.toLocaleString()',
    content
)

# Save updated public/index.html
with open("public/index.html", "w", encoding="utf-8") as f:
    f.write(content)

# Now update src/app/page.tsx with the new HTML content
safe_html = content.replace("`", "\\`").replace("${", "\\${")

page_tsx = f"""
export default function HomePage() {{
  return (
    <div dangerouslySetInnerHTML={{{{ __html: `{safe_html}` }}}} />
  );
}}
"""

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(page_tsx)

print("Translation to English completed successfully!")
