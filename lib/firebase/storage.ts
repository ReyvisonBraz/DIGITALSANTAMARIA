import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type UploadResult,
} from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { app } from '@/lib/firebase';
import type { StorageFile } from '@/types';

const storage = getStorage(app);

export async function uploadFile(
  file: File,
  path: string
): Promise<StorageFile> {
  const storageRef = ref(storage, path);
  const snapshot: UploadResult = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return {
    url,
    path: snapshot.ref.fullPath,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export function generateStoragePath(
  collection: string,
  uid: string,
  fileName: string
): string {
  const fallbackExt = 'bin';
  const rawExt = fileName.split('.').pop() || fallbackExt;
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || fallbackExt;
  const timestamp = Date.now();
  return `${collection}/${uid}/${timestamp}.${ext}`;
}
