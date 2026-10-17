import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = parseSessionToken(token);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user
  });
}
