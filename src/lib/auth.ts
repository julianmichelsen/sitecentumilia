import { cookies } from 'next/headers';
import { getCookieName, verifyToken } from './auth-config';

export { isAuthConfigured, validateCredentials, getAuthToken, getCookieName, verifyToken } from './auth-config';

export function isAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(getCookieName());
    return verifyToken(token?.value);
  } catch {
    return false;
  }
}
