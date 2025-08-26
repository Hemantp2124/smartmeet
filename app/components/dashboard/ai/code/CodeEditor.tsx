'use client';

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value = '',
  onChange = () => {},
  language = 'typescript',
  readOnly = false,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
        <code>{value}</code>
      </pre>
      {!readOnly && (
        <textarea
          className="absolute inset-0 w-full h-full opacity-0 cursor-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      )}
    </div>
  );
};

export default CodeEditor;