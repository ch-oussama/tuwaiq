import { NextRequest, NextResponse } from 'next/server';
import { getFAQs, addFAQ, updateFAQ, deleteFAQ } from '@/lib/db';

export async function GET() {
  const faqs = await getFAQs();
  return NextResponse.json(faqs);
}

// Auth handled by middleware
export async function POST(request: NextRequest) {
  try {
    const { question, answer } = await request.json();
    if (!question || typeof question !== 'string' || question.length > 1000) {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }
    if (!answer || typeof answer !== 'string' || answer.length > 5000) {
      return NextResponse.json({ error: 'Invalid answer' }, { status: 400 });
    }
    const faq = await addFAQ({ question, answer });
    return NextResponse.json(faq, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// Auth handled by middleware
export async function PUT(request: NextRequest) {
  try {
    const { id, question, answer } = await request.json();
    if (!id || !question || !answer) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const ok = await updateFAQ(id, { question, answer });
    if (!ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// Auth handled by middleware
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    const ok = await deleteFAQ(id);
    if (!ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
