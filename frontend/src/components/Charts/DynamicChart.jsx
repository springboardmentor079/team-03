import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Skeleton from '../UI/Skeleton.jsx';
import EmptyState from '../UI/EmptyState.jsx';

/**
 * DynamicChart Component
 * A flexible, responsive chart wrapper for dynamic API payloads.
 * Handles loading, error, empty, and data states gracefully.
 * 
 * @param {Object} props
 * @param {Array<Object>} [props.data=[]] - Chart dataset array
 * @param {boolean} [props.isLoading=false] - Trigger skeleton loading state
 * @param {boolean} [props.isError=false] - Trigger error fallback state
 * @param {string} [props.errorMessage='Failed to load analytics data.'] - Error message text
 * @param {'bar' | 'line' | 'area'} [props.chartType='bar'] - Chart visual style type
 * @param {string} [props.xKey='name'] - Data key for X-axis
 * @param {string | Array<string>} [props.yKey='value'] - Data key(s) for Y-axis series
 * @param {string} [props.title] - Chart section title
 * @param {number | string} [props.height=320] - Chart container height
 * @param {Array<string>} [props.colors] - Array of color hex codes for chart series
 * @param {string} [props.className=''] - Additional container classes
 */
export const DynamicChart = ({
  data = [],
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load analytics data.',
  chartType = 'bar',
  xKey = 'name',
  yKey = 'value',
  title,
  height = 320,
  colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  className = '',
}) => {
  // 1. Loading State
  if (isLoading) {
    return <Skeleton type="chart" className={className} />;
  }

  // 2. Error State
  if (isError) {
    return (
      <div className={`p-6 border border-rose-200 dark:border-rose-900/50 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 text-center flex flex-col items-center justify-center ${className}`} style={{ minHeight: typeof height === 'number' ? `${height}px` : height }}>
        <div className="w-10 h-10 mb-2 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-rose-800 dark:text-rose-300">Analytics Error</h4>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 max-w-sm">{errorMessage}</p>
      </div>
    );
  }

  // 3. Empty Data State
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <EmptyState
        title="No Chart Data"
        message="No data payload available to generate chart visualization."
        className={className}
      />
    );
  }

  // Normalize yKey to array for multi-series support
  const yKeys = Array.isArray(yKey) ? yKey : [yKey];

  // Render chart inner content based on chartType prop
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            {yKeys.length > 1 && <Legend />}
            {yKeys.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[idx % colors.length]}
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            {yKeys.length > 1 && <Legend />}
            {yKeys.map((key, idx) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.25}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
      default:
        return (
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            {yKeys.length > 1 && <Legend />}
            {yKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[idx % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
    }
  };

  return (
    <div className={`p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${className}`}>
      {title && (
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">
          {title}
        </h3>
      )}
      <div style={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DynamicChart;
