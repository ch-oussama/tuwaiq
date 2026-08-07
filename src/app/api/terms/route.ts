import { NextResponse } from 'next/server';
import { getTerms, updateTerms } from '@/lib/db';

export async function GET() {
  try {
    const terms = await getTerms();
    return NextResponse.json(terms);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch terms' }, { status: 500 });
  }
}

// Auth handled by middleware
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await updateTerms(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update terms' }, { status: 500 });
  }
}
