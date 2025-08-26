'use client';

import { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-block"
        role="tooltip"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap ${positionClasses[position]} ${className}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform -translate-x-1/2 -translate-y-1/2 ${
              position === 'top' ? 'bottom-0 left-1/2 rotate-45' : ''
            } ${position === 'right' ? 'left-0 top-1/2 -rotate-45' : ''} ${
              position === 'bottom' ? 'top-0 left-1/2 rotate-45' : ''
            } ${position === 'left' ? 'right-0 top-1/2 -rotate-45' : ''}`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;