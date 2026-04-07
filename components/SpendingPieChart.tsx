'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function SpendingPieChart({ data }: { data: DataPoint[] }) {
  // =========================
  // MOUNT STATE (FIX FOR SSR ISSUE)
  // =========================
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // =========================
  // SKELETON LOADER (PREVENT HYDRATION ERRORS)
  // =========================
  if (!isMounted) {
    return (
      <div className="h-[300px] w-full bg-white animate-pulse rounded-xl border border-gray-100" />
    );
  }

  // =========================
  // CHART RENDER
  // =========================
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-[320px]">
      <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase">
        Spending by Category
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: any) => {
              if (typeof value !== 'number') return '$0.00';
              return `$${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`;
            }}
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />

          <Legend
  verticalAlign="bottom"
  height={36}
  iconSize={10}
  wrapperStyle={{
    fontSize: '12px',
    paddingTop: '10px',
  }}
/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}