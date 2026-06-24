"use server";

import { cookies } from 'next/headers';
import { addPackage as dbAddPackage, getPackages } from '@/lib/db';

const HARDCODED_ADMIN_EMAIL = "admin@tuwaiqstudio.com";

export async function loginAction(formData: FormData) {
  const email = formData.get('email');
  if (email === HARDCODED_ADMIN_EMAIL) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return { success: true };
  }
  return { success: false, error: 'البريد الإلكتروني غير مصرح له' };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
}

export async function createPackageAction(formData: FormData) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const shortDescription = formData.get('shortDescription') as string;
  const price = Number(formData.get('price'));
  const thumbnailUrl = formData.get('thumbnailUrl') as string;
  const imageUrls = (formData.get('images') as string).split(',').map(s => s.trim()).filter(s => s);
  const features = (formData.get('features') as string).split('\n').map(s => s.trim()).filter(s => s);

  await dbAddPackage({
    title,
    description,
    shortDescription,
    price,
    thumbnailUrl,
    images: imageUrls,
    features,
  });
}
