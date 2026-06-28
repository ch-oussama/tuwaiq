import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPrivacy, updatePrivacy } from '@/lib/db';

export async function GET() {
  try {
    const privacy = await getPrivacy();
    return NextResponse.json(privacy);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch privacy' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    await updatePrivacy(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update privacy' }, { status: 500 });
  }
}
