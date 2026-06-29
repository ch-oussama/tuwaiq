import { NextRequest, NextResponse } from 'next/server';
import { getFAQs, addFAQ, updateFAQ, deleteFAQ } from '@/lib/db';

export async function GET() {
  const faqs = await getFAQs();
  return NextResponse.json(faqs);
}

export async function POST(request: NextRequest) {
  try {
    const { question, answer } = await request.json();
    if (!question || !answer) {
      return NextResponse.json({ error: 'السؤال والإجابة مطلوبان' }, { status: 400 });
    }
    const faq = await addFAQ({ question, answer });
    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل الإضافة' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, question, answer } = await request.json();
    if (!id || !question || !answer) {
      return NextResponse.json({ error: 'المعرف والسؤال والإجابة مطلوبون' }, { status: 400 });
    }
    const ok = await updateFAQ(id, { question, answer });
    if (!ok) return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل التعديل' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const ok = await deleteFAQ(id);
    if (!ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
