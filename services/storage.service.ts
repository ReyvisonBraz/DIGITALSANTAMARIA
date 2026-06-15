import { uploadFile, deleteFile, generateStoragePath } from '@/lib/firebase/storage';
import type { StorageFile } from '@/types';

export async function uploadReportPhoto(uid: string, file: File): Promise<StorageFile> {
  const path = generateStoragePath('reports', uid, file.name);
  return uploadFile(file, path);
}

export async function uploadPetitionCover(uid: string, file: File): Promise<StorageFile> {
  const path = generateStoragePath('petitions', uid, file.name);
  return uploadFile(file, path);
}

export async function uploadAvatar(uid: string, file: File): Promise<StorageFile> {
  const path = generateStoragePath('avatars', uid, file.name);
  return uploadFile(file, path);
}

export async function uploadBusinessLogo(uid: string, file: File): Promise<StorageFile> {
  const path = generateStoragePath('businesses', uid, file.name);
  return uploadFile(file, path);
}

export { deleteFile };
