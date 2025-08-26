declare module '@next-auth/prisma-adapter' {
  import { Adapter } from 'next-auth/adapters';
  import { PrismaClient } from '@prisma/client';

  export function PrismaAdapter(prisma: PrismaClient): Adapter;
}
