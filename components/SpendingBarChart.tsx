'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SpendingBarChart({ data }: { data: any[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl" />;

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-[320px]">
      <h3 className="text-sm font-semibold text-gray-600 mb-6 uppercase tracking-wider">Spending Trends (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            minTickGap={20}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`$${value.toFixed(2)}`, 'Spent']}
          />
          <Bar
  dataKey="amount"
  fill="#6366f1"
  radius={[6, 6, 0, 0]}
  isAnimationActive={true}
  animationDuration={800}
>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.amount > 100 ? '#ef4444' : '#3b82f6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}