'use client';

interface CodePreviewProps {
  code?: string;
  className?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({
  code = '// Your code will be displayed here',
  className = '',
}) => {
  return (
    <div className={`bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto ${className}`}>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodePreview;