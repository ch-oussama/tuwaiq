import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTerms, updateTerms } from '@/lib/db';

export async function GET() {
  try {
    const terms = await getTerms();
    return NextResponse.json(terms);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch terms' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    await updateTerms(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update terms' }, { status: 500 });
  }
}
