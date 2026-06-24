import { NextResponse } from 'next/server';
import { addReview } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { packageId, author, rating, content } = await req.json();
    if (!packageId || !author || !content || !rating) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const review = await addReview(packageId, { author, rating, content });
    if (!review) return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
