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
  price: string | number;
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

export interface TermsSection {
  title: string;
  content: string;
}

export interface TermsData {
  studioTerms: TermsSection[];
  designTerms: TermsSection[];
}

export interface PrivacyData {
  studioPrivacy: TermsSection[];
  designPrivacy: TermsSection[];
}

export interface CustomOption {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
}

export interface OrderItem {
  optionId: string;
  optionName: string;
  price: number;
}

export interface Order {
  id: string;
  code: string;
  items: OrderItem[];
  total: number;
  discordUsername: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: number;
  branch?: 'studio' | 'design';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

const packagesCollection = collection(db, 'packages');
const projectsCollection = collection(db, 'projects');
const customOptionsCollection = collection(db, 'customOptions');
const ordersCollection = collection(db, 'orders');
const faqsCollection = collection(db, 'faqs');

const termsDoc = doc(db, 'content', 'terms');
const privacyDoc = doc(db, 'content', 'privacy');

export async function getTerms(): Promise<TermsData | null> {
  try {
    const snapshot = await getDoc(termsDoc);
    if (snapshot.exists()) {
      return snapshot.data() as TermsData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching terms:', error);
    return null;
  }
}

export async function updateTerms(data: TermsData): Promise<void> {
  await setDoc(termsDoc, data);
}

export async function getPrivacy(): Promise<PrivacyData | null> {
  try {
    const snapshot = await getDoc(privacyDoc);
    if (snapshot.exists()) {
      return snapshot.data() as PrivacyData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching privacy:', error);
    return null;
  }
}

export async function updatePrivacy(data: PrivacyData): Promise<void> {
  await setDoc(privacyDoc, data);
}

export async function getCustomOptions(): Promise<CustomOption[]> {
  try {
    const snapshot = await getDocs(customOptionsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomOption));
  } catch (error) {
    console.error('Error fetching custom options:', error);
    return [];
  }
}

export async function addCustomOption(option: Omit<CustomOption, 'id'>): Promise<CustomOption> {
  const newRef = doc(customOptionsCollection);
  await setDoc(newRef, option);
  return { id: newRef.id, ...option } as CustomOption;
}

export async function deleteCustomOption(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'customOptions', id));
    return true;
  } catch (error) {
    console.error('Error deleting custom option:', error);
    return false;
  }
}

export async function updateCustomOption(id: string, data: Partial<CustomOption>): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'customOptions', id), data);
    return true;
  } catch (error) {
    console.error('Error updating custom option:', error);
    return false;
  }
}

export async function addOrder(order: Omit<Order, 'id'>): Promise<Order> {
  const newRef = doc(ordersCollection);
  await setDoc(newRef, order);
  return { id: newRef.id, ...order } as Order;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const snapshot = await getDocs(ordersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { status });
}

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

export async function deleteReview(packageId: string, reviewId: string): Promise<boolean> {
  try {
    const pkgRef = doc(db, 'packages', packageId);
    const snapshot = await getDoc(pkgRef);
    if (!snapshot.exists()) return false;
    
    const pkgData = snapshot.data();
    const currentReviews = (pkgData.reviews || []) as Review[];
    const filteredReviews = currentReviews.filter(r => r.id !== reviewId);
    
    await updateDoc(pkgRef, { reviews: filteredReviews });
    return true;
  } catch (error) {
    return false;
  }
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

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const docRef = doc(db, 'projects', id);
  await updateDoc(docRef, updates);
  const updated = await getDoc(docRef);
  return updated.exists() ? ({ id: updated.id, ...updated.data() } as Project) : null;
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'projects', id));
    return true;
  } catch (error) {
    return false;
  }
}

export async function getFAQs(): Promise<FAQItem[]> {
  try {
    const snapshot = await getDocs(faqsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQItem));
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export async function addFAQ(faq: Omit<FAQItem, 'id'>): Promise<FAQItem> {
  const newRef = doc(faqsCollection);
  await setDoc(newRef, faq);
  return { id: newRef.id, ...faq } as FAQItem;
}

export async function updateFAQ(id: string, data: Partial<FAQItem>): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'faqs', id), data);
    return true;
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return false;
  }
}

export async function deleteFAQ(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'faqs', id));
    return true;
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return false;
  }
}
