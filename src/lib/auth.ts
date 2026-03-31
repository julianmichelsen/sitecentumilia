import { cookies } from 'next/headers';

const ADMIN_USERNAME = 'centumilia2020';
const ADMIN_PASSWORD = 'T@nise21022020';
const AUTH_TOKEN = 'centumilia_admin_session_2024';
const COOKIE_NAME = 'centumilia_auth';

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function getAuthToken(): string {
  return AUTH_TOKEN;
}

export function getCookieName(): string {
  return COOKIE_NAME;
}

export function isAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME);
    return token?.value === AUTH_TOKEN;
  } catch {
    return false;
  }
}
