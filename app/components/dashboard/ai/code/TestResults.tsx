'use client';

interface TestResult {
  success: boolean;
  output: string;
}

interface TestResultsProps {
  results?: TestResult;
  className?: string;
}

const TestResults: React.FC<TestResultsProps> = ({
  results = { success: false, output: 'No test results available' },
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold">
        {results.success ? (
          <span className="text-green-500">✓ All tests passed!</span>
        ) : (
          <span className="text-red-500">✗ Some tests failed</span>
        )}
      </h3>
      
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
        <pre className="whitespace-pre-wrap">
          <code>{results.output}</code>
        </pre>
      </div>
    </div>
  );
};

export default TestResults;