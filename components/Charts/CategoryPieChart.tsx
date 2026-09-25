'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useExpenses } from '../../context/ExpenseContext';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  currencySymbol?: string;
}

const CustomPieTooltip: React.FC<CustomTooltipProps> = ({ active, payload, currencySymbol = '$' }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900/95 p-3 shadow-xl backdrop-blur-md light:border-gray-200 light:bg-white/95">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="text-xs font-semibold text-gray-200 light:text-gray-800">
            {data.category}
          </span>
        </div>
        <p className="mt-1 text-base font-bold text-white light:text-gray-900">
          {currencySymbol}
          {data.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className="mt-1 flex items-center justify-between gap-4 text-[11px] text-gray-400 light:text-gray-500">
          <span>{data.percentage}% of total</span>
          <span>{data.count} items</span>
        </div>
      </div>
    );
  }
  return null;
};

export const CategoryPieChart: React.FC = () => {
  const { categoryStats, settings, isMounted, metrics } = useExpenses();
  const { currencySymbol } = settings;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!isMounted) {
    return <div className="h-64 w-full animate-pulse rounded-xl bg-gray-800/40" />;
  }

  if (categoryStats.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 p-6 text-center text-gray-500 light:border-gray-300">
        <p className="text-sm">No category distribution data.</p>
        <p className="text-xs text-gray-600 light:text-gray-400 mt-1">Add expenses to see category breakdown.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-60 w-full max-w-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomPieTooltip currencySymbol={currencySymbol} />} />
            <Pie
              data={categoryStats}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="total"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {categoryStats.map((entry, index) => (
                <Cell
                  key={`slice-${index}`}
                  fill={entry.color}
                  stroke="#111827"
                  strokeWidth={2}
                  className="transition-all duration-200 cursor-pointer hover:opacity-80"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-medium text-gray-400 light:text-gray-500 uppercase tracking-wider">
            Total
          </span>
          <span className="text-base font-bold text-white light:text-gray-900">
            {currencySymbol}{metrics.totalSpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-gray-500 light:text-gray-400">
            {categoryStats.length} {categoryStats.length === 1 ? 'Category' : 'Categories'}
          </span>
        </div>
      </div>

      {/* Category Pills Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-1.5 px-2">
        {categoryStats.slice(0, 6).map((cat, i) => (
          <div
            key={cat.category}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] transition-all ${
              activeIndex === i
                ? 'bg-gray-800 text-white ring-1 ring-emerald-500 light:bg-gray-200 light:text-gray-900'
                : 'bg-gray-900/60 text-gray-300 light:bg-gray-100 light:text-gray-700'
            }`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <span className="font-medium">{cat.category}</span>
            <span className="text-gray-400 light:text-gray-500 font-mono">
              {cat.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
