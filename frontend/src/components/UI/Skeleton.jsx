import React from 'react';

/**
 * Skeleton Component
 * Renders shimmering animated placeholders for graceful loading UI states.
 * 
 * @param {Object} props
 * @param {'card' | 'table' | 'chart' | 'text' | 'circle'} [props.type='text'] - Shape profile of the skeleton
 * @param {number} [props.count=1] - Multiplier count for repeating elements
 * @param {string} [props.className=''] - Additional Tailwind CSS classes
 * @param {string} [props.height] - Optional custom height override
 */
export const Skeleton = ({ type = 'text', count = 1, className = '', height }) => {
  const baseShimmer = "animate-pulse bg-slate-200 dark:bg-slate-700/60 rounded-md";

  const renderSkeletonByType = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
              <div className={`h-5 w-1/3 ${baseShimmer}`} />
              <div className={`h-8 w-8 rounded-full ${baseShimmer}`} />
            </div>
            <div className={`h-8 w-2/3 ${baseShimmer}`} />
            <div className="space-y-2 pt-2">
              <div className={`h-3 w-full ${baseShimmer}`} />
              <div className={`h-3 w-4/5 ${baseShimmer}`} />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className={`h-4 w-20 ${baseShimmer}`} />
              <div className={`h-6 w-16 rounded-full ${baseShimmer}`} />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className={`w-full overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 ${className}`}>
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-4 w-3/4 ${baseShimmer}`} />
              ))}
            </div>
            {/* Table Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...Array(count > 1 ? count : 5)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4 items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`h-8 w-8 rounded-full shrink-0 ${baseShimmer}`} />
                    <div className={`h-4 w-24 ${baseShimmer}`} />
                  </div>
                  <div className={`h-4 w-20 ${baseShimmer}`} />
                  <div className={`h-4 w-16 ${baseShimmer}`} />
                  <div className={`h-6 w-20 rounded-full justify-self-end ${baseShimmer}`} />
                </div>
              ))}
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className={`p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm space-y-6 ${className}`}>
            {/* Chart Header */}
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className={`h-5 w-40 ${baseShimmer}`} />
                <div className={`h-3 w-24 ${baseShimmer}`} />
              </div>
              <div className="flex space-x-2">
                <div className={`h-8 w-16 rounded-md ${baseShimmer}`} />
                <div className={`h-8 w-16 rounded-md ${baseShimmer}`} />
              </div>
            </div>

            {/* Chart Bars */}
            <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-l border-slate-200 dark:border-slate-800">
              {[60, 40, 85, 30, 95, 50, 70, 45, 90, 65].map((heightPct, idx) => (
                <div
                  key={idx}
                  className={`w-full ${baseShimmer}`}
                  style={{ height: `${heightPct}%` }}
                />
              ))}
            </div>

            {/* Chart Legend */}
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${baseShimmer}`} />
                <div className={`h-3 w-16 ${baseShimmer}`} />
              </div>
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${baseShimmer}`} />
                <div className={`h-3 w-16 ${baseShimmer}`} />
              </div>
            </div>
          </div>
        );

      case 'circle':
        return (
          <div
            className={`${baseShimmer} rounded-full ${className}`}
            style={{ width: height || '40px', height: height || '40px' }}
          />
        );

      case 'text':
      default:
        return (
          <div className={`space-y-2.5 ${className}`}>
            {[...Array(count)].map((_, idx) => (
              <div
                key={idx}
                className={`${baseShimmer}`}
                style={{
                  height: height || '1rem',
                  width: idx === count - 1 && count > 1 ? '75%' : '100%',
                }}
              />
            ))}
          </div>
        );
    }
  };

  if (count > 1 && (type === 'card' || type === 'chart' || type === 'circle')) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(count)].map((_, i) => (
          <React.Fragment key={i}>{renderSkeletonByType()}</React.Fragment>
        ))}
      </div>
    );
  }

  return renderSkeletonByType();
};

export default Skeleton;
