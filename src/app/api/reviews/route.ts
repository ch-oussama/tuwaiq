import { NextResponse } from 'next/server';
import { addReview, deleteReview } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { packageId, author, rating, content } = await req.json();

    // Validate
    if (!packageId || typeof packageId !== 'string') {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
    }
    if (!author || typeof author !== 'string' || author.length > 100) {
      return NextResponse.json({ error: 'Invalid author' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.length > 2000) {
      return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    const review = await addReview(packageId, { author, rating, content });
    if (!review) return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await getAdminSession();
    const { packageId, reviewId } = await req.json();
    if (!packageId || !reviewId) return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });

    const success = await deleteReview(packageId, reviewId);
    if (!success) return NextResponse.json({ error: 'Failed or not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
