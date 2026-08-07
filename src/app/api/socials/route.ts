import { getSocials, updateSocials } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const socials = await getSocials();
    return NextResponse.json(socials);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch socials' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();

    // Validate: only allow known fields, only string values, max length
    const allowedFields = ['discord', 'twitter', 'tiktok', 'email'];
    const branches = ['studio', 'design'];
    const sanitized: Record<string, Record<string, string>> = {};

    for (const branch of branches) {
      if (data[branch] && typeof data[branch] === 'object') {
        sanitized[branch] = {};
        for (const field of allowedFields) {
          const val = data[branch][field];
          if (typeof val === 'string' && val.length <= 500) {
            // Basic URL validation for non-email fields
            if (field !== 'email' && val && !val.startsWith('http') && val !== '') continue;
            sanitized[branch][field] = val;
          }
        }
      }
    }

    await updateSocials(sanitized as any);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update socials' }, { status: 500 });
  }
}
