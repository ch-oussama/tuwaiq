import { NextResponse } from 'next/server';
import { getCustomOptions, addCustomOption, deleteCustomOption, updateCustomOption } from '@/lib/db';

export async function GET() {
  try {
    const options = await getCustomOptions();
    return NextResponse.json(options);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
  }
}

// Auth handled by middleware
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || typeof body.name !== 'string' || body.name.length > 200) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
    const newOption = await addCustomOption(body);
    return NextResponse.json(newOption, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create option' }, { status: 500 });
  }
}

// Auth handled by middleware
export async function PUT(req: Request) {
  try {
    const { id, ...data } = await req.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const success = await updateCustomOption(id, data);
    if (!success) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update option' }, { status: 500 });
  }
}

// Auth handled by middleware
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const success = await deleteCustomOption(id);
    if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete option' }, { status: 500 });
  }
}
