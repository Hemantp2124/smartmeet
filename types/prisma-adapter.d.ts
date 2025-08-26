import { Adapter } from 'next-auth/adapters';

declare module '@auth/prisma-adapter' {
  import { PrismaClient } from '@prisma/client';
  
  const PrismaAdapter: (prisma: PrismaClient, options?: any) => Adapter;
  export default PrismaAdapter;
}
