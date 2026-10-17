import { NextResponse } from 'next/server';
import { findUserByUsernameOrEmail, createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import store from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = body.username || body.email;
    const password = body.password;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const user = findUserByUsernameOrEmail(username);
    if (!user || user.passwordHash !== String(password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(user);

    // Update global store active role
    store.setRole(user.role);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      },
      message: `Welcome back, ${user.name}!`
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Login failed' },
      { status: 500 }
    );
  }
}
