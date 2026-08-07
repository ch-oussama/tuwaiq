import { NextResponse } from 'next/server';
import { getPrivacy, updatePrivacy } from '@/lib/db';

export async function GET() {
  try {
    const privacy = await getPrivacy();
    return NextResponse.json(privacy);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch privacy' }, { status: 500 });
  }
}

// Auth handled by middleware
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await updatePrivacy(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update privacy' }, { status: 500 });
  }
}
