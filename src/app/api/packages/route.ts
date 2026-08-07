import { NextResponse } from 'next/server';
import { addPackage, getPackages, deletePackage, updatePackage } from '@/lib/db';

// GET all packages (public)
export async function GET() {
  try {
    const packages = await getPackages();
    return NextResponse.json(packages);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

// POST create a new package (auth handled by middleware)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, shortDescription, price, thumbnailUrl, images, features, branch } = body;

    if (!title || typeof title !== 'string' || title.length > 200) {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }
    if (!description || typeof description !== 'string' || description.length > 5000) {
      return NextResponse.json({ error: 'Invalid description' }, { status: 400 });
    }

    const newPkg = await addPackage(body);
    return NextResponse.json(newPkg, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}

// DELETE a package (auth handled by middleware)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const success = await deletePackage(id);
    if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}

// PUT to update a package (auth handled by middleware)
export async function PUT(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Package ID required' }, { status: 400 });
    }
    const updated = await updatePackage(id, updates);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}
