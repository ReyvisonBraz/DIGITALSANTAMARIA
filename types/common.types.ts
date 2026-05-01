import type { Timestamp } from 'firebase/firestore';

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface StorageFile {
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
}

export interface PaginatedResult<T> {
  items: T[];
  lastDoc: unknown | null;
  hasMore: boolean;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
