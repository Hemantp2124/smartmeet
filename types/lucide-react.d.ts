declare module 'lucide-react' {
  import * as React from 'react';
  
  interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    className?: string;
  }

  export const LogOut: React.FC<IconProps>;
  // Add other icons as needed
}
