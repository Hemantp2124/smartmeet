// app/api/user/profile/route.ts
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';

const scrypt = promisify(_scrypt);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        image: true,
        // Add other fields you want to expose
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Update name if provided
    if (name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name },
      });
    }

    // Update password if current and new passwords are provided
    if (currentPassword && newPassword) {
      // Verify current password
      if (!user.password) {
        return new NextResponse('Password not set for this account', { status: 400 });
      }
      
      const [salt, storedHash] = user.password.split('.');
      const hash = (await scrypt(currentPassword, salt, 32)) as Buffer;
      
      if (storedHash !== hash.toString('hex')) {
        return new NextResponse('Current password is incorrect', { status: 400 });
      }

      // Update to new password
      const newSalt = randomBytes(8).toString('hex');
      const newHash = (await scrypt(newPassword, newSalt, 32)) as Buffer;
      const hashedPassword = `${newSalt}.${newHash.toString('hex')}`;
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}