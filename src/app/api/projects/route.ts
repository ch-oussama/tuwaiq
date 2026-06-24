import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProjects, deleteProject } from '@/lib/db';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

// GET all projects
export async function GET() {
  try {
    const projects = await getProjects();
    // Sort by numeric ID (1, 2, 3...)
    projects.sort((a, b) => {
      const numA = parseInt(a.id) || 0;
      const numB = parseInt(b.id) || 0;
      return numA - numB;
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create a new project with sequential ID
export async function POST(req: Request) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();

    // Get next sequential ID
    const projectsCol = collection(db, 'projects');
    const snapshot = await getDocs(projectsCol);
    let maxId = 0;
    snapshot.docs.forEach(d => {
      const numId = parseInt(d.id);
      if (!isNaN(numId) && numId > maxId) maxId = numId;
    });
    const nextId = String(maxId + 1);

    // Save with sequential ID
    const newRef = doc(db, 'projects', nextId);
    await setDoc(newRef, body);

    return NextResponse.json({ id: nextId, ...body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project', details: (error as any)?.message || String(error) }, { status: 500 });
  }
}

// DELETE a project by id
export async function DELETE(req: Request) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    const success = await deleteProject(id);
    if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
