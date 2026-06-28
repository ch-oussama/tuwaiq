import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCustomOptions, addCustomOption, deleteCustomOption, updateCustomOption } from '@/lib/db';

export async function GET() {
  try {
    const options = await getCustomOptions();
    return NextResponse.json(options);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const newOption = await addCustomOption(body);
    return NextResponse.json(newOption, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create option' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id, ...data } = await req.json();
    const success = await updateCustomOption(id, data);
    if (!success) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update option' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    const success = await deleteCustomOption(id);
    if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete option' }, { status: 500 });
  }
}
