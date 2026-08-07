import { NextResponse } from 'next/server';
import { getProjects, deleteProject, updateProject } from '@/lib/db';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

// GET all projects (public)
export async function GET() {
  try {
    const projects = await getProjects();
    projects.sort((a, b) => {
      const numA = parseInt(a.id) || 0;
      const numB = parseInt(b.id) || 0;
      return numA - numB;
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create a new project (auth handled by middleware)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, category, description, branch } = body;
    if (!title || typeof title !== 'string' || title.length > 200) {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }
    if (!description || typeof description !== 'string' || description.length > 5000) {
      return NextResponse.json({ error: 'Invalid description' }, { status: 400 });
    }

    const projectsCol = collection(db, 'projects');
    const snapshot = await getDocs(projectsCol);
    let maxId = 0;
    snapshot.docs.forEach(d => {
      const numId = parseInt(d.id);
      if (!isNaN(numId) && numId > maxId) maxId = numId;
    });
    const nextId = String(maxId + 1);

    const newRef = doc(db, 'projects', nextId);
    await setDoc(newRef, body);

    return NextResponse.json({ id: nextId, ...body }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// DELETE a project (auth handled by middleware)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const success = await deleteProject(id);
    if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

// PUT to update a project (auth handled by middleware)
export async function PUT(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }
    const updated = await updateProject(id, updates);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
