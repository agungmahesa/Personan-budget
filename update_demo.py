import re

with open("public/index.html", "r", encoding="utf-8") as f:
    content = f.read()

styles = """
<style>
.demo-tab-btn {
  background: transparent;
  color: #94a3b8;
  border: none;
  padding: 6px 14px;
  border-radius: 7px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.demo-tab-btn:hover {
  color: #f1f5f9;
  background: rgba(255,255,255,0.05);
}
.demo-tab-btn.active {
  background: #10b981;
  color: #ffffff;
}
.demo-input-dark {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 8px 10px;
  color: #f1f5f9;
  font-size: 0.85rem;
  font-family: inherit;
}
.demo-input-dark:focus {
  outline: none;
  border-color: #10b981;
}
.demo-input-dark option {
  background: #1a1d2e;
  color: #f1f5f9;
}
</style>
"""

script = """
<script>
let prodState = {
  transactions: [
    { id: 1, date: "2026-03-01", description: "Gaji Bulanan Utama", category: "Salary", amount: 15000000, type: "income" },
    { id: 2, date: "2026-03-02", description: "Belanja Bulanan Supermarket", category: "Shopping", amount: 2500000, type: "expense" },
    { id: 3, date: "2026-03-03", description: "Makan Malam Restoran", category: "Food & Drink", amount: 350000, type: "expense" },
    { id: 4, date: "2026-03-04", description: "Bensin & E-Toll", category: "Transport", amount: 450000, type: "expense" },
    { id: 5, date: "2026-03-05", description: "Tagihan Listrik & Wifi", category: "Bills & Utilities", amount: 870000, type: "expense" },
    { id: 6, date: "2026-03-06", description: "Bonus Project Freelance", category: "Business", amount: 4000000, type: "income" },
    { id: 7, date: "2026-03-07", description: "Langganan Netflix & Spotify", category: "Entertainment", amount: 220000, type: "expense" }
  ],
  budgets: [
    { id: 1, category: "Food & Drink", amount: 3500000, spent: 1850000 },
    { id: 2, category: "Transport", amount: 1500000, spent: 850000 },
    { id: 3, category: "Shopping", amount: 3000000, spent: 2500000 },
    { id: 4, category: "Bills & Utilities", amount: 2000000, spent: 1450000 },
    { id: 5, category: "Entertainment", amount: 1000000, spent: 620000 }
  ],
  savings: [
    { id: 1, name: "Dana Darurat (6 Bulan)", target: 50000000, current: 35000000, deadline: "2026-12-31" },
    { id: 2, name: "Tabungan Umroh", target: 35000000, current: 22500000, deadline: "2027-04-15" },
    { id: 3, name: "DP Rumah Pilihan", target: 120000000, current: 48000000, deadline: "2027-10-01" }
  ],
  debts: [
    { id: 1, name: "KPR Bank Syariah", total: 350000000, remaining: 280000000, rate: 5.5, dueDate: "2035-08-10" },
    { id: 2, name: "Cicilan Mobil", total: 180000000, remaining: 45000000, rate: 4.2, dueDate: "2026-11-20" }
  ],
  assets: [
    { id: 1, name: "Rumah Tinggal (Nilai Pasar)", value: 650000000, type: "Property" },
    { id: 2, name: "Portofolio Saham & Reksadana", value: 85000000, type: "Investment" },
    { id: 3, name: "Tabungan & Kas", value: 45000000, type: "Cash" },
    { id: 4, name: "Emas Logam Mulia (50 gram)", value: 65000000, type: "Investment" }
  ]
};

function fmtRupiah(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

let prodChartInstance = null;

function switchDemoTab(tab) {
  document.querySelectorAll(".demo-tab-content").forEach(el => el.style.display = "none");
  document.querySelectorAll(".demo-tab-btn").forEach(el => el.classList.remove("active"));
  
  const targetContent = document.getElementById("demo-tab-" + tab);
  const targetBtn = document.getElementById("tab-btn-" + tab);
  if (targetContent) targetContent.style.display = "block";
  if (targetBtn) targetBtn.classList.add("active");

  if (tab === "dash") renderProdChart();
}

function renderProdDemo() {
  const income = prodState.transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const expense = prodState.transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const balance = income - expense;
  const totalAssets = prodState.assets.reduce((a, b) => a + b.value, 0);
  const totalDebts = prodState.debts.reduce((a, b) => a + b.remaining, 0);
  const netWorth = totalAssets - totalDebts;
  const rate = income > 0 ? Math.round((balance / income) * 100) : 0;

  document.getElementById("ui-income").textContent = fmtRupiah(income);
  document.getElementById("ui-expense").textContent = fmtRupiah(expense);
  document.getElementById("ui-balance").textContent = fmtRupiah(balance);
  document.getElementById("ui-savings-rate").textContent = rate + "% Savings Rate";
  document.getElementById("ui-networth").textContent = fmtRupiah(netWorth);

  // Recent transactions
  const recent = prodState.transactions.slice(0, 5);
  document.getElementById("ui-recent-tx-rows").innerHTML = recent.map(t => `
    <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
      <td style="padding:8px; color:#94a3b8;">${t.date}</td>
      <td style="padding:8px; font-weight:600;">${t.description}</td>
      <td style="padding:8px;"><span style="background:rgba(255,255,255,0.06); padding:2px 7px; border-radius:4px; font-size:11px;">${t.category}</span></td>
      <td style="padding:8px; text-align:right; font-weight:700; color:${t.type === 'income' ? '#10b981' : '#f43f5e'};">
        ${t.type === 'income' ? '+' : '-'}${fmtRupiah(t.amount)}
      </td>
    </tr>
  `).join("");

  // All transactions
  document.getElementById("ui-tx-count").textContent = prodState.transactions.length + " transaksi";
  document.getElementById("ui-all-tx-rows").innerHTML = prodState.transactions.map(t => `
    <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
      <td style="padding:10px; color:#94a3b8;">${t.date}</td>
      <td style="padding:10px; font-weight:600;">${t.description}</td>
      <td style="padding:10px;">${t.category}</td>
      <td style="padding:10px;"><span style="background:${t.type === 'income' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}; color:${t.type === 'income' ? '#10b981' : '#f43f5e'}; padding:2px 8px; border-radius:99px; font-size:11px; font-weight:700;">${t.type.toUpperCase()}</span></td>
      <td style="padding:10px; text-align:right; font-weight:700; color:${t.type === 'income' ? '#10b981' : '#f43f5e'};">
        ${t.type === 'income' ? '+' : '-'}${fmtRupiah(t.amount)}
      </td>
    </tr>
  `).join("");

  // Budgets
  document.getElementById("ui-budget-grid").innerHTML = prodState.budgets.map(b => {
    const pct = Math.min(100, Math.round((b.spent / b.amount) * 100));
    const col = pct > 90 ? '#f43f5e' : pct > 70 ? '#f59e0b' : '#10b981';
    return `
      <div style="background:#1a1d2e; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:18px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="font-weight:700;">${b.category}</span>
          <span style="font-weight:800; color:${col};">${pct}%</span>
        </div>
        <div style="height:6px; background:rgba(255,255,255,0.08); border-radius:99px; overflow:hidden; margin-bottom:10px;">
          <div style="height:100%; width:${pct}%; background:${col}; border-radius:99px;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:12px; color:#94a3b8;">
          <span>Terpakai: <strong style="color:#f1f5f9;">${fmtRupiah(b.spent)}</strong></span>
          <span>Limit: <strong style="color:#f1f5f9;">${fmtRupiah(b.amount)}</strong></span>
        </div>
      </div>
    `;
  }).join("");

  // Savings
  document.getElementById("ui-savings-grid").innerHTML = prodState.savings.map(s => {
    const pct = Math.min(100, Math.round((s.current / s.target) * 100));
    return `
      <div style="background:#1a1d2e; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:18px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="font-weight:700;">${s.name}</span>
          <span style="font-weight:800; color:#10b981;">${pct}%</span>
        </div>
        <div style="font-size:11px; color:#94a3b8; margin-bottom:10px;">Target: ${s.deadline}</div>
        <div style="height:8px; background:rgba(255,255,255,0.08); border-radius:99px; overflow:hidden; margin-bottom:10px;">
          <div style="height:100%; width:${pct}%; background:linear-gradient(90deg,#10b981,#3b82f6); border-radius:99px;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:12px; color:#94a3b8;">
          <span>Terkumpul: <strong style="color:#6ee7b7;">${fmtRupiah(s.current)}</strong></span>
          <span>Goal: <strong style="color:#f1f5f9;">${fmtRupiah(s.target)}</strong></span>
        </div>
      </div>
    `;
  }).join("");

  // Debts
  document.getElementById("ui-debts-rows").innerHTML = prodState.debts.map(d => {
    const pct = Math.round(((d.total - d.remaining) / d.total) * 100);
    return `
      <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
        <td style="padding:10px; font-weight:600;">${d.name}</td>
        <td style="padding:10px;">${fmtRupiah(d.total)}</td>
        <td style="padding:10px; color:#f43f5e; font-weight:700;">${fmtRupiah(d.remaining)}</td>
        <td style="padding:10px; color:#94a3b8;">${d.rate}%</td>
        <td style="padding:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="flex:1; height:6px; background:rgba(255,255,255,0.08); border-radius:99px; overflow:hidden;">
              <div style="height:100%; width:${pct}%; background:#10b981; border-radius:99px;"></div>
            </div>
            <span style="font-size:11px; color:#94a3b8;">${pct}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // Assets
  const totalAssetsVal = prodState.assets.reduce((a, b) => a + b.value, 0);
  document.getElementById("ui-assets-rows").innerHTML = prodState.assets.map(a => {
    const pct = Math.round((a.value / totalAssetsVal) * 100);
    return `
      <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
        <td style="padding:10px; font-weight:600;">${a.name}</td>
        <td style="padding:10px;"><span style="background:rgba(59,130,246,0.15); color:#3b82f6; padding:2px 8px; border-radius:99px; font-size:11px; font-weight:600;">${a.type}</span></td>
        <td style="padding:10px; text-align:right; font-weight:700; color:#6ee7b7;">${fmtRupiah(a.value)}</td>
        <td style="padding:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="flex:1; height:6px; background:rgba(255,255,255,0.08); border-radius:99px; overflow:hidden;">
              <div style="height:100%; width:${pct}%; background:#3b82f6; border-radius:99px;"></div>
            </div>
            <span style="font-size:11px; color:#94a3b8;">${pct}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  renderProdChart();
}

function renderProdChart() {
  const canvas = document.getElementById("prodDemoChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (prodChartInstance) prodChartInstance.destroy();

  const income = prodState.transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const expense = prodState.transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const balance = income - expense;

  prodChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense", "Balance"],
      datasets: [{
        data: [income, expense, Math.max(0, balance)],
        backgroundColor: ["rgba(16,185,129,0.8)", "rgba(244,63,94,0.8)", "rgba(59,130,246,0.8)"],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8" } },
        y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8", callback: v => "Rp " + (v/1000000) + "jt" } }
      }
    }
  });
}

function handleQuickAdd(e) {
  e.preventDefault();
  const type = document.getElementById("qa-type").value;
  const amount = parseFloat(document.getElementById("qa-amount").value);
  const desc = document.getElementById("qa-desc").value;
  const cat = document.getElementById("qa-cat").value;

  if (!amount || !desc) return;

  const newTx = {
    id: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    description: desc,
    category: cat,
    amount: amount,
    type: type
  };

  prodState.transactions.unshift(newTx);
  
  if (type === "expense") {
    const b = prodState.budgets.find(x => x.category === cat);
    if (b) b.spent += amount;
  }

  document.getElementById("qa-amount").value = "";
  document.getElementById("qa-desc").value = "";

  renderProdDemo();
  alert("✨ Transaksi berhasil ditambahkan! Data diperbarui secara real-time di demo.");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProdDemo();
});
</script>
"""

if "</head>" in content:
    content = content.replace("</head>", styles + "\n</head>")

last_script = content.lastIndexOf("<script>") if hasattr(content, "lastIndexOf") else content.rfind("<script>")
if last_script != -1:
    content = content[:last_script] + script + "\n</body>\n</html>"

with open("public/index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("python script finished successfully")
