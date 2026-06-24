// Server-side rate limiter using in-memory store
// For production, this should be Redis or similar.

type RateLimitEntry = {
  count: number;
  lastRequestTime: number;
  blockedUntil: number | null;
};

const ipLogs = new Map<string, RateLimitEntry>();

const MAX_REQUESTS = 10; // Max requests allowed in the time window
const TIME_WINDOW_MS = 10000; // 10 seconds rapid window to detect spam
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes block

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = ipLogs.get(ip);

  if (!entry) {
    ipLogs.set(ip, { count: 1, lastRequestTime: now, blockedUntil: null });
    return { allowed: true };
  }

  // Check if currently blocked
  if (entry.blockedUntil && entry.blockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((entry.blockedUntil - now) / 1000) };
  }
  
  // If block expired, reset
  if (entry.blockedUntil && entry.blockedUntil <= now) {
    entry.blockedUntil = null;
    entry.count = 0;
  }

  // Check rapid fire requests
  if (now - entry.lastRequestTime < TIME_WINDOW_MS) {
    entry.count += 1;
    if (entry.count > MAX_REQUESTS) {
      entry.blockedUntil = now + BLOCK_DURATION_MS;
      return { allowed: false, retryAfter: Math.ceil(BLOCK_DURATION_MS / 1000) };
    }
  } else {
    // Reset if it's outside the active rapid fire window
    entry.count = 1;
  }

  entry.lastRequestTime = now;
  return { allowed: true };
}
