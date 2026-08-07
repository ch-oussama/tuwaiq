import { cookies } from 'next/headers';
import { verifySessionToken, createSessionToken, ADMIN_EMAILS } from './tokens';

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 86400;

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function setAdminSession(email: string) {
  const token = createSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function removeAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  if (!isAdminEmail(payload.email)) return null;
  return { email: payload.email };
}
