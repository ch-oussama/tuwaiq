import { db, ensureInit } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

async function getDb() {
  await ensureInit();
  return db;
}

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

const getPackagesCollection = () => collection(db, 'packages');
const getProjectsCollection = () => collection(db, 'projects');
const getCustomOptionsCollection = () => collection(db, 'customOptions');
const getOrdersCollection = () => collection(db, 'orders');
const getFAQsCollection = () => collection(db, 'faqs');

const getTermsDoc = () => doc(db, 'content', 'terms');
const getPrivacyDoc = () => doc(db, 'content', 'privacy');
const getSocialsDoc = () => doc(db, 'content', 'socials');

export async function getTerms(): Promise<TermsData | null> {
  try {
    await ensureInit();
    const snapshot = await getDoc(getTermsDoc());
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
  await setDoc(getTermsDoc(), data);
}

export async function getPrivacy(): Promise<PrivacyData | null> {
  try {
    await ensureInit();
    const snapshot = await getDoc(getPrivacyDoc());
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
  await setDoc(getPrivacyDoc(), data);
}

export interface SocialLinks {
  studio: { discord: string; twitter: string; tiktok: string; email: string };
  design: { discord: string; twitter: string; tiktok: string; email: string };
}

const defaultSocials: SocialLinks = {
  studio: { discord: 'https://discord.gg/tuwaiqstudio', twitter: 'https://x.com/tuwaiq_studio', tiktok: 'https://tiktok.com/@tuwaiq_studio', email: 'studio@tuwaiqstudio.com' },
  design: { discord: 'https://discord.gg/twq3', twitter: 'https://x.com/tuwaiq_design', tiktok: 'https://tiktok.com/@tuwaiq_design', email: 'design@tuwaiqstudio.com' },
};

export async function getSocials(): Promise<SocialLinks> {
  try {
    await ensureInit();
    const snapshot = await getDoc(getSocialsDoc());
    if (snapshot.exists()) {
      return snapshot.data() as SocialLinks;
    }
    return defaultSocials;
  } catch (error) {
    console.error('Error fetching socials:', error);
    return defaultSocials;
  }
}

export async function updateSocials(data: SocialLinks): Promise<void> {
  await setDoc(getSocialsDoc(), data);
}

export async function getCustomOptions(): Promise<CustomOption[]> {
  try {
    const snapshot = await getDocs(getCustomOptionsCollection());
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomOption));
  } catch (error) {
    console.error('Error fetching custom options:', error);
    return [];
  }
}

export async function addCustomOption(option: Omit<CustomOption, 'id'>): Promise<CustomOption> {
  const newRef = doc(getCustomOptionsCollection());
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
  const newRef = doc(getOrdersCollection());
  await setDoc(newRef, order);
  return { id: newRef.id, ...order } as Order;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const snapshot = await getDocs(getOrdersCollection());
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
    const d = await getDb();
    const snapshot = await getDocs(getPackagesCollection());
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
  const newRef = doc(getPackagesCollection());
  const newPkg = { ...pkg, reviews: [] };
  await setDoc(newRef, newPkg);
  return { id: newRef.id, ...newPkg } as Package;
}

export async function updatePackage(id: string, updates: Partial<Package>): Promise<Package | null> {
  const docRef = doc(db, 'packages', id);
  await updateDoc(docRef, updates);
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
    await ensureInit();
    const snapshot = await getDocs(getProjectsCollection());
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function addProject(project: Omit<Project, 'id'>): Promise<Project> {
  const newRef = doc(getProjectsCollection());
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
    await ensureInit();
    const snapshot = await getDocs(getFAQsCollection());
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQItem));
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export async function addFAQ(faq: Omit<FAQItem, 'id'>): Promise<FAQItem> {
  const newRef = doc(getFAQsCollection());
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

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

const getSocialLinksCollection = () => collection(db, 'socialLinks');

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const snapshot = await getDocs(getSocialLinksCollection());
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SocialLink));
  } catch (error) {
    console.error('Error fetching social links:', error);
    return [];
  }
}

export async function addSocialLink(link: Omit<SocialLink, 'id'>): Promise<SocialLink> {
  const newRef = doc(getSocialLinksCollection());
  await setDoc(newRef, link);
  return { id: newRef.id, ...link };
}

export async function updateSocialLink(id: string, data: Partial<SocialLink>): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'socialLinks', id), data);
    return true;
  } catch (error) {
    console.error('Error updating social link:', error);
    return false;
  }
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'socialLinks', id));
    return true;
  } catch (error) {
    console.error('Error deleting social link:', error);
    return false;
  }
}

export interface BannedEmail {
  id: string;
  email: string;
  reason: string;
  bannedAt: number;
}

const getBannedCollection = () => collection(db, 'banned');

export async function banEmail(email: string, reason: string): Promise<BannedEmail> {
  const newRef = doc(getBannedCollection());
  const data = { email, reason, bannedAt: Date.now() };
  await setDoc(newRef, data);
  return { id: newRef.id, ...data };
}

export async function unbanEmail(email: string): Promise<boolean> {
  try {
    const snapshot = await getDocs(getBannedCollection());
    const match = snapshot.docs.find(d => d.data().email === email);
    if (match) {
      await deleteDoc(doc(db, 'banned', match.id));
    }
    return true;
  } catch (error) {
    console.error('Error unbanning email:', error);
    return false;
  }
}

export async function checkIsBanned(email: string): Promise<boolean> {
  try {
    const snapshot = await getDocs(getBannedCollection());
    return snapshot.docs.some(d => d.data().email === email);
  } catch (error) {
    console.error('Error checking banned status:', error);
    return false;
  }
}

export interface SupportTicket {
  id: string;
  discordUsername: string;
  problem: string;
  uid: string;
  status: 'open' | 'closed';
  createdAt: number;
}

const getSupportTicketsCollection = () => collection(db, 'supportTickets');

export async function addSupportTicket(ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>): Promise<SupportTicket> {
  const newRef = doc(getSupportTicketsCollection());
  const data = { ...ticket, status: 'open' as const, createdAt: Date.now() };
  await setDoc(newRef, data);
  return { id: newRef.id, ...data };
}

export async function canSubmitTicket(discordUsername: string): Promise<boolean> {
  try {
    const snapshot = await getDocs(getSupportTicketsCollection());
    const openTickets = snapshot.docs.filter(d => {
      const data = d.data();
      return data.discordUsername === discordUsername && data.status === 'open';
    });
    return openTickets.length === 0;
  } catch (error) {
    console.error('Error checking ticket status:', error);
    return false;
  }
}

export async function closeSupportTicket(id: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'supportTickets', id), { status: 'closed' });
    return true;
  } catch (error) {
    console.error('Error closing support ticket:', error);
    return false;
  }
}

export async function deleteSupportTicket(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'supportTickets', id));
    return true;
  } catch (error) {
    console.error('Error deleting support ticket:', error);
    return false;
  }
}
