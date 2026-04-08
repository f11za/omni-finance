import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import SpendingPieChart from '@/components/SpendingPieChart';
import SpendingBarChart from '@/components/SpendingBarChart';

export default async function DashboardPage() {
  // =========================
  // DATA FETCHING
  // =========================
const transactions = await prisma.transaction.findMany({
    orderBy: { date: 'desc' },
  });

  const account = await prisma.account.findFirst();

  // =========================
  // DATA CALCULATIONS
  // =========================
  const totalSpend = transactions
    .filter((tx: any) => tx.amount > 0)
    .reduce((sum: number, tx: any) => sum + tx.amount, 0);

  const categories = [...new Set(transactions.map((tx: any) => tx.category))];

  const categoryTotals = transactions.reduce((acc: Record<string, number>, tx: any) => {
    if (tx.amount > 0) {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    }
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: value as number, // Force 'value' to be treated as a number
  }));

  // =========================
  // TOP CATEGORY 
  // =========================
  const topCategory = chartData.sort((a, b) => (b.value as number) - (a.value as number))[0];

  // =========================
  // DAILY SPENDING (BAR CHART)
  // =========================
  const dailySpend = transactions.reduce((acc: Record<string, number>, tx: any) => {
    if (tx.amount > 0) {
      const dateKey = format(new Date(tx.date), 'MMM dd');
      acc[dateKey] = (acc[dateKey] || 0) + tx.amount;
    }
    return acc;
  }, {});

  const barChartData = Object.entries(dailySpend)
    .map(([date, amount]) => ({ 
      date, 
      amount: amount as number // Force 'amount' to be a number
    }))
    .reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* =========================
          HEADER SECTION
      ========================= */}
      <div className="flex flex-col items-center text-center mb-10">

        <h1 className="text-3xl font-extrabold tracking-tight text-white">
    Personal Financial Dashboard
  </h1>
  <p className="text-slate-300 font-medium">
    Welcome Back. Let's monitor your financial health in real-time.
  </p>


        {/*
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm">
          Generate Report
        </button> */}

      </div>

      {/* =========================
          HERO BALANCE CARD
      ========================= */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-8 rounded-3xl mb-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-1">
            Available Funds
          </p>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-medium text-indigo-300">$</span>
            <h2 className="text-6xl font-black">
              {Number(account?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* =========================
          TOP INSIGHT CARD 
      ========================= */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-10 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">
            Top Spending Category
          </p>
          <h3 className="text-xl font-bold text-slate-800">
            {topCategory?.name ?? 'N/A'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
  ${Number(topCategory?.value || 0).toLocaleString(undefined, { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }) ?? '0.00'}
</p>
        </div>

        <div className="text-indigo-600 text-3xl font-black">
        </div>
      </div>

      {/* =========================
          VISUALIZATION GRID
      ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

        {/* BAR CHART */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-[360px]">
          <SpendingBarChart data={barChartData} />
        </div>

        {/* PIE CHART */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-[360px]">
          <SpendingPieChart data={chartData} />
        </div>
      </div>

      {/* =========================
          TRANSACTION TABLE
      ========================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Recent Transactions</h3>
          <span className="text-sm text-indigo-600 font-semibold cursor-pointer hover:underline">
            View All
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-left">
                  Entity
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-left">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-700">
                      {tx.merchantName || tx.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {format(new Date(tx.date), 'MMM dd, yyyy')}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 group-hover:bg-white transition-colors">
                      {tx.category}
                    </span>
                  </td>

                  <td
                    className={`px-6 py-5 text-right font-mono font-bold ${
                      tx.amount > 0 ? 'text-slate-900' : 'text-emerald-500'
                    }`}
                  >
                    {tx.amount > 0
                      ? `-$${tx.amount.toFixed(2)}`
                      : `+$${Math.abs(tx.amount).toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}