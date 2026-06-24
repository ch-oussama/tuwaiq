import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addPackage, getPackages, deletePackage } from '@/lib/db';

// GET all packages
export async function GET() {
  try {
    const packages = await getPackages();
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

// POST create a new package
export async function POST(req: Request) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const newPkg = await addPackage(body);
    return NextResponse.json(newPkg, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create package', details: (error as any)?.message || String(error) }, { status: 500 });
  }
}

// DELETE a package by id
export async function DELETE(req: Request) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    const success = await deletePackage(id);
    if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
