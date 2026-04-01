import { NextRequest } from 'next/server';

type Bucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 60_000;
const LIMIT = 60;

const globalStore = globalThis as typeof globalThis & {
  __ADMIN_RATE_LIMIT?: Map<string, Bucket>;
};

const store = globalStore.__ADMIN_RATE_LIMIT ?? new Map<string, Bucket>();
globalStore.__ADMIN_RATE_LIMIT = store;

function getClientId(request: NextRequest) {
  const xff = request.headers.get('x-forwarded-for');
  return request.ip || xff?.split(',')[0]?.trim() || 'unknown';
}

export function consumeContactRateLimit(request: NextRequest) {
  const now = Date.now();
  const id = getClientId(request);
  const key = `contact_${id}`;
  const bucket = store.get(key);
  const contactLimit = 3;

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: contactLimit - 1, reset: now + WINDOW_MS };
  }

  if (bucket.count >= contactLimit) {
    return { ok: false, remaining: 0, reset: bucket.resetAt };
  }

  bucket.count += 1;
  return { ok: true, remaining: contactLimit - bucket.count, reset: bucket.resetAt };
}

export function consumeAdminRateLimit(request: NextRequest) {
  const now = Date.now();
  const id = getClientId(request);
  const bucket = store.get(id);

  if (!bucket || bucket.resetAt <= now) {
    store.set(id, { count: 1, resetAt: now + WINDOW_MS });
    return {
      ok: true,
      limit: LIMIT,
      remaining: LIMIT - 1,
      reset: now + WINDOW_MS,
    };
  }

  if (bucket.count >= LIMIT) {
    return {
      ok: false,
      limit: LIMIT,
      remaining: 0,
      reset: bucket.resetAt,
    };
  }

  bucket.count += 1;
  return {
    ok: true,
    limit: LIMIT,
    remaining: LIMIT - bucket.count,
    reset: bucket.resetAt,
  };
}
