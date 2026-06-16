import {
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { app } from '@/lib/firebase';
import type { StorageFile } from '@/types';

const storage = getStorage(app);
const UPLOAD_TIMEOUT_MS = 45_000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void,
): Promise<StorageFile> {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });
  const snapshot = await withTimeout(
    new Promise<typeof uploadTask.snapshot>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (state) => {
          if (!state.totalBytes) return;
          onProgress?.(Math.round((state.bytesTransferred / state.totalBytes) * 100));
        },
        reject,
        () => resolve(uploadTask.snapshot),
      );
    }),
    UPLOAD_TIMEOUT_MS,
    'O envio da imagem demorou demais. Verifique sua conexao e tente novamente.',
  );
  const url = await withTimeout(
    getDownloadURL(snapshot.ref),
    10_000,
    'A imagem foi enviada, mas não foi possível obter o link público agora.',
  );
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
