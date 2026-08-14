import React from 'react';

/**
 * Default Empty Folder SVG Icon fallback.
 */
const DefaultEmptyIcon = () => (
  <svg
    className="w-12 h-12 text-slate-400 dark:text-slate-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

/**
 * EmptyState UI Component
 * Renders a polished fallback state for empty database queries or search results.
 * 
 * @param {Object} props
 * @param {string} [props.title='No Data Found'] - Optional bold heading title
 * @param {string} [props.message='There is no information to display at this time.'] - Descriptive fallback message
 * @param {React.ReactNode | React.ElementType} [props.icon] - Custom icon component or node
 * @param {string} [props.actionText] - Text label for call-to-action button
 * @param {Function} [props.onAction] - Click handler for action button
 * @param {string} [props.className=''] - Custom container utility classes
 */
export const EmptyState = ({
  title = 'No Data Found',
  message = 'There is no information to display at this time.',
  icon,
  actionText,
  onAction,
  className = '',
}) => {
  const renderIcon = () => {
    if (!icon) return <DefaultEmptyIcon />;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || typeof icon === 'object') {
      const CustomIcon = icon;
      return <CustomIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />;
    }
    return icon;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 my-4 ${className}`}
    >
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800/80 shadow-inner">
        {renderIcon()}
      </div>

      {title && (
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
          {title}
        </h3>
      )}

      {message && (
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400 mb-6">
          {message}
        </p>
      )}

      {actionText && onAction && (
        <button
          onClick={onAction}
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg shadow-sm transition-all duration-150 ease-in-out cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
