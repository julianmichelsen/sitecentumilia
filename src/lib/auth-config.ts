const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const AUTH_TOKEN = process.env.ADMIN_AUTH_TOKEN;
const COOKIE_NAME = process.env.ADMIN_AUTH_COOKIE_NAME || 'centumilia_auth';

export function isAuthConfigured(): boolean {
  return Boolean(ADMIN_USERNAME && ADMIN_PASSWORD && AUTH_TOKEN);
}

export function validateCredentials(username: string, password: string): boolean {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return false;
  }

  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function getAuthToken(): string {
  return AUTH_TOKEN || '';
}

export function getCookieName(): string {
  return COOKIE_NAME;
}

export function verifyToken(token: string | undefined): boolean {
  return Boolean(AUTH_TOKEN) && token === AUTH_TOKEN;
}
