'use client';

interface SummaryViewProps {
  title?: string;
  summary: string;
  className?: string;
}

const SummaryView: React.FC<SummaryViewProps> = ({
  title = 'Meeting Summary',
  summary,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="prose dark:prose-invert max-w-none">
          {summary.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryView;