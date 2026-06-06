'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: 'positive' | 'negative' | 'neutral';
  iconName: string;
  trendData?: number[];
}

export default function StatCard({
  title,
  value,
  change,
  changeType = 'positive',
  iconName,
  trendData
}: StatCardProps) {
  const isPos = changeType === 'positive';
  const isNeg = changeType === 'negative';

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-display font-bold text-neutral-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl">
          <Icon name={iconName} size={20} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        {change !== undefined && (
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isPos
                  ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                  : isNeg
                  ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                  : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
              }`}
            >
              {isPos ? '↑' : isNeg ? '↓' : '•'} {change}
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">
              vs last month
            </span>
          </div>
        )}

        {/* Custom Mini SVG Sparkline */}
        {trendData && trendData.length > 1 && (
          <div className="h-6 w-24">
            <svg className="w-full h-full" viewBox="0 0 100 30">
              <defs>
                <linearGradient id={`sparkline-grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPos ? '#22c55e' : isNeg ? '#ef4444' : '#737373'} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={isPos ? '#22c55e' : isNeg ? '#ef4444' : '#737373'} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area */}
              <path
                d={`M 0,30 ${trendData
                  .map((val, idx) => {
                    const max = Math.max(...trendData);
                    const min = Math.min(...trendData);
                    const range = max - min || 1;
                    const x = (idx / (trendData.length - 1)) * 100;
                    const y = 25 - ((val - min) / range) * 20; // Bound y between 5 and 25
                    return `L ${x},${y}`;
                  })
                  .join(' ')} L 100,30 Z`}
                fill={`url(#sparkline-grad-${title})`}
              />
              {/* Line */}
              <path
                d={trendData
                  .map((val, idx) => {
                    const max = Math.max(...trendData);
                    const min = Math.min(...trendData);
                    const range = max - min || 1;
                    const x = (idx / (trendData.length - 1)) * 100;
                    const y = 25 - ((val - min) / range) * 20;
                    return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke={isPos ? '#22c55e' : isNeg ? '#ef4444' : '#737373'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
