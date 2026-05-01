import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL || 'addmin739@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === adminEmail && password === adminPassword) {
      // In a real app, use a proper JWT and sign it
      // Here we use a simple token for demonstration
      const sessionToken = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      
      cookies().set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return NextResponse.json({ message: 'Login successful' });
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
