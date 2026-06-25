import { db } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  thumbnailUrl: string;
  images: string[];
  features: string[];
  reviews: Review[];
  branch?: 'studio' | 'design';
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  images?: string[];
  tags: string[];
  branch?: 'studio' | 'design';
}

const packagesCollection = collection(db, 'packages');
const projectsCollection = collection(db, 'projects');

export async function getPackages(): Promise<Package[]> {
  try {
    const snapshot = await getDocs(packagesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

export async function getPackageById(id: string): Promise<Package | undefined> {
  try {
    const docRef = doc(db, 'packages', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Package;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching package:', error);
    return undefined;
  }
}

export async function addPackage(pkg: Omit<Package, 'id' | 'reviews'>): Promise<Package> {
  const newRef = doc(packagesCollection);
  const newPkg = { ...pkg, reviews: [] };
  await setDoc(newRef, newPkg);
  return { id: newRef.id, ...newPkg } as Package;
}

export async function updatePackage(id: string, updates: Partial<Package>): Promise<Package | null> {
  const docRef = doc(db, 'packages', id);
  await updateDoc(docRef, updates);
  // Fetch the updated one to return fully intact
  const updated = await getDoc(docRef);
  return updated.exists() ? ({ id: updated.id, ...updated.data() } as Package) : null;
}

export async function deletePackage(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'packages', id));
    return true;
  } catch (error) {
    return false;
  }
}

export async function addReview(packageId: string, review: Omit<Review, 'id'>): Promise<Review | null> {
  const pkgRef = doc(db, 'packages', packageId);
  const snapshot = await getDoc(pkgRef);
  if (!snapshot.exists()) return null;
  
  const pkgData = snapshot.data();
  const currentReviews = (pkgData.reviews || []) as Review[];
  const newReview = { ...review, id: 'r' + Date.now() };
  
  currentReviews.push(newReview);
  await updateDoc(pkgRef, { reviews: currentReviews });
  
  return newReview;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const snapshot = await getDocs(projectsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function addProject(project: Omit<Project, 'id'>): Promise<Project> {
  const newRef = doc(projectsCollection);
  await setDoc(newRef, project);
  return { id: newRef.id, ...project } as Project;
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'projects', id));
    return true;
  } catch (error) {
    return false;
  }
}
