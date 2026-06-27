import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addReview, deleteReview } from '@/lib/db';

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

export async function DELETE(req: Request) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { packageId, reviewId } = await req.json();
    if (!packageId || !reviewId) return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
    
    const success = await deleteReview(packageId, reviewId);
    if (!success) return NextResponse.json({ error: 'Failed or not found' }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
