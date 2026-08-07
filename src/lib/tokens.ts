const SESSION_SECRET = process.env.AUTH_SECRET || 'tuwaiq-session-key-2026';

function encode(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function decode(value: string): string {
  return Buffer.from(value, 'base64url').toString();
}

function sign(data: string): string {
  let hash = 0;
  const combined = data + SESSION_SECRET;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function createSessionToken(email: string): string {
  const payload = encode(JSON.stringify({ e: email, t: Date.now() }));
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): { email: string } | null {
  try {
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;
    if (sign(payload) !== sig) return null;
    const data = JSON.parse(decode(payload));
    if (!data.e || !data.t) return null;
    if (Date.now() - data.t > 86400 * 1000) return null;
    return { email: data.e };
  } catch {
    return null;
  }
}

export const ADMIN_EMAILS = [
  'tuwaiqstudio2026@gmail.com',
  'godiabout57@gmail.com',
  'avenstud@gmail.com',
];
