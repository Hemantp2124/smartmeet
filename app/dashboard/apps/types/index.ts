import { ElementType } from 'react';

export interface App {
  id: string;
  name: string;
  description: string;
  icon: ElementType;
  connected: boolean;
  color: string;
  lastUsed?: string;
}
