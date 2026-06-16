import { uploadFile, deleteFile, generateStoragePath } from '@/lib/firebase/storage';
import type { StorageFile } from '@/types';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const REPORT_MAX_BYTES = 5 * 1024 * 1024;
const PROFILE_MAX_BYTES = 2 * 1024 * 1024;

interface UploadOptions {
  onProgress?: (progress: number) => void;
}

function validateImageFile(file: File, maxBytes: number): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Use uma imagem JPG, PNG ou WebP.');
  }
  if (file.size > maxBytes) {
    const maxMb = Math.floor(maxBytes / 1024 / 1024);
    throw new Error(`A imagem deve ter no maximo ${maxMb} MB.`);
  }
}

async function uploadImage(
  uid: string,
  file: File,
  collection: string,
  maxBytes: number,
  options?: UploadOptions,
): Promise<StorageFile> {
  validateImageFile(file, maxBytes);
  const path = generateStoragePath(collection, uid, file.name);
  return uploadFile(file, path, options?.onProgress);
}

export async function uploadReportPhoto(uid: string, file: File, options?: UploadOptions): Promise<StorageFile> {
  return uploadImage(uid, file, 'reports', REPORT_MAX_BYTES, options);
}

export async function uploadPetitionCover(uid: string, file: File, options?: UploadOptions): Promise<StorageFile> {
  return uploadImage(uid, file, 'petitions', REPORT_MAX_BYTES, options);
}

export async function uploadAvatar(uid: string, file: File, options?: UploadOptions): Promise<StorageFile> {
  return uploadImage(uid, file, 'avatars', PROFILE_MAX_BYTES, options);
}

export async function uploadBusinessLogo(uid: string, file: File, options?: UploadOptions): Promise<StorageFile> {
  return uploadImage(uid, file, 'businesses', PROFILE_MAX_BYTES, options);
}

export { deleteFile };
