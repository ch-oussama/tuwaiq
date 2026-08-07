"use server";

import { setAdminSession, removeAdminSession, isAdminEmail } from '@/lib/auth';
import { addPackage as dbAddPackage } from '@/lib/db';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  if (!email || !isAdminEmail(email)) {
    return { success: false, error: 'البريد الإلكتروني غير مصرح له' };
  }
  await setAdminSession(email);
  return { success: true };
}

export async function logoutAction() {
  await removeAdminSession();
}

export async function setLoginSession(email: string) {
  if (!isAdminEmail(email)) {
    return { success: false, error: 'Unauthorized' };
  }
  await setAdminSession(email);
  return { success: true };
}

export async function createPackageAction(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const shortDescription = formData.get('shortDescription') as string;
  const price = Number(formData.get('price'));
  const thumbnailUrl = formData.get('thumbnailUrl') as string;
  const imageUrls = (formData.get('images') as string || '').split(',').map(s => s.trim()).filter(s => s);
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
