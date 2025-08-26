'use client';

type Status = 'success' | 'error' | 'warning' | 'info' | 'processing';

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

const statusStyles = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

const statusLabels = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
  processing: 'Processing',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status]
      } ${className}`}
    >
      {label || statusLabels[status]}
    </span>
  );
};

export default StatusBadge;