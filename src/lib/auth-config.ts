export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_USERNAME && 
    process.env.ADMIN_PASSWORD && 
    process.env.ADMIN_AUTH_TOKEN
  );
}

export function validateCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return false;
  }

  return username === adminUsername && password === adminPassword;
}

export function getAuthToken(): string {
  return process.env.ADMIN_AUTH_TOKEN || '';
}

export function getCookieName(): string {
  return process.env.ADMIN_AUTH_COOKIE_NAME || 'centumilia_auth';
}

export function verifyToken(token: string | undefined): boolean {
  const authToken = process.env.ADMIN_AUTH_TOKEN;
  return Boolean(authToken) && token === authToken;
}
