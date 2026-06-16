const mockCollection = jest.fn((...args: unknown[]) => ({
  path: String(args[1]),
  withConverter: jest.fn(function withConverter(this: unknown) {
    return this;
  }),
}));
const mockDoc = jest.fn((...args: unknown[]) => ({
  path: args.slice(1).map(String).join('/'),
  withConverter: jest.fn(function withConverter(this: unknown) {
    return this;
  }),
}));
const mockAddDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockQuery = jest.fn((...args: unknown[]) => args[0]);
const mockWhere = jest.fn((...args: unknown[]) => ({ field: args[0], op: args[1], value: args[2] }));
const mockOrderBy = jest.fn((...args: unknown[]) => ({ field: args[0], direction: args[1] }));
const mockLimit = jest.fn((...args: unknown[]) => ({ limit: args[0] }));
const mockOnSnapshot = jest.fn();
const mockRunTransaction = jest.fn();
const mockWriteBatch = jest.fn();
const mockServerTimestamp = jest.fn(() => 'SERVER_TIMESTAMP');
const mockHttpsCallable = jest.fn();

jest.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  limit: (...args: unknown[]) => mockLimit(...args),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
  orderBy: (...args: unknown[]) => mockOrderBy(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  runTransaction: (...args: unknown[]) => mockRunTransaction(...args),
  serverTimestamp: () => mockServerTimestamp(),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  writeBatch: (...args: unknown[]) => mockWriteBatch(...args),
}));

jest.mock('firebase/functions', () => ({
  httpsCallable: (...args: unknown[]) => mockHttpsCallable(...args),
}));

jest.mock('@/lib/firebase', () => ({
  db: { app: 'test-db' },
  functions: { app: 'test-functions' },
}));

jest.mock('@/lib/firebase/converters', () => ({
  demandConverter: {},
  petitionConverter: {},
  reportConverter: {},
  userConverter: {},
}));

jest.mock('@/services/notifications.service', () => ({
  tryCreateNotification: jest.fn(),
}));

import { createDemand } from '@/services/demands.service';
import { createPetition } from '@/services/petitions.service';
import { createReport } from '@/services/reports.service';
import { updateUserProfile } from '@/services/users.service';

describe('critical services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddDoc.mockResolvedValue({ id: 'new-doc-id' });
    mockUpdateDoc.mockResolvedValue(undefined);
    mockSetDoc.mockResolvedValue(undefined);
    mockGetDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
    mockGetDocs.mockResolvedValue({ docs: [], empty: true });
  });

  describe('demands.service', () => {
    it('creates a citizen demand with a pending status', async () => {
      await expect(createDemand({
        authorId: 'user-1',
        authorName: 'Maria',
        type: 'reclamacao',
        category: 'infraestrutura',
        subject: 'Buraco na rua',
        text: 'Ha um buraco grande na via.',
        isAnonymous: false,
        consent: true,
      })).resolves.toEqual({ id: 'new-doc-id' });

      expect(mockCollection).toHaveBeenCalledWith(expect.anything(), 'demands');
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'demands' }),
        expect.objectContaining({
          authorId: 'user-1',
          authorName: 'Maria',
          status: 'pending',
          isAnonymous: false,
          consent: true,
        }),
      );
    });

    it('propagates Firestore errors when demand creation fails', async () => {
      mockAddDoc.mockRejectedValueOnce(new Error('permission-denied'));

      await expect(createDemand({
        authorId: 'user-1',
        authorName: 'Maria',
        type: 'reclamacao',
        category: 'infraestrutura',
        subject: 'Buraco na rua',
        text: 'Ha um buraco grande na via.',
        isAnonymous: false,
        consent: true,
      })).rejects.toThrow('permission-denied');
    });
  });

  describe('reports.service', () => {
    it('creates a report and stores the external photo metadata when provided', async () => {
      await expect(createReport({
        reporterId: 'user-1',
        reporterName: 'Maria',
        type: 'infrastructure',
        title: 'Lixeira quebrada',
        description: 'A lixeira da praca esta quebrada.',
        location: null,
        isPetition: false,
        photoURL: 'https://example.com/foto.jpg',
      })).resolves.toBe('new-doc-id');

      expect(mockCollection).toHaveBeenCalledWith(expect.anything(), 'reports');
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'reports' }),
        expect.objectContaining({
          reporterId: 'user-1',
          reporterName: 'Maria',
          status: 'pending',
          photo: expect.objectContaining({
            url: 'https://example.com/foto.jpg',
            path: 'external',
          }),
        }),
      );
    });

    it('propagates Firestore errors when report creation fails', async () => {
      mockAddDoc.mockRejectedValueOnce(new Error('unavailable'));

      await expect(createReport({
        reporterId: 'user-1',
        reporterName: 'Maria',
        type: 'environment',
        title: 'Descarte irregular',
        description: 'Descarte irregular de lixo.',
        location: null,
        isPetition: false,
      })).rejects.toThrow('unavailable');
    });
  });

  describe('petitions.service', () => {
    it('creates an active petition with normalized optional fields', async () => {
      await expect(createPetition({
        creatorId: 'user-1',
        creatorName: 'Maria',
        title: 'Mais iluminacao',
        description: 'Pedido por iluminacao publica.',
        category: 'obras',
        goal: 100,
        coverImageURL: '  https://example.com/capa.jpg  ',
      })).resolves.toBe('new-doc-id');

      expect(mockCollection).toHaveBeenCalledWith(expect.anything(), 'petitions');
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'petitions' }),
        expect.objectContaining({
          creatorId: 'user-1',
          status: 'active',
          signaturesCount: 0,
          coverImageURL: 'https://example.com/capa.jpg',
        }),
      );
    });

    it('propagates Firestore errors when petition creation fails', async () => {
      mockAddDoc.mockRejectedValueOnce(new Error('permission-denied'));

      await expect(createPetition({
        creatorId: 'user-1',
        creatorName: 'Maria',
        title: 'Mais iluminacao',
        description: 'Pedido por iluminacao publica.',
        category: 'obras',
        goal: 100,
      })).rejects.toThrow('permission-denied');
    });
  });

  describe('users.service', () => {
    it('updates editable profile fields with an updatedAt timestamp', async () => {
      await expect(updateUserProfile('user-1', {
        displayName: 'Maria',
        photoURL: 'https://example.com/avatar.jpg',
        phone: '91999990000',
      })).resolves.toBeUndefined();

      expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'users', 'user-1');
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'users/user-1' }),
        expect.objectContaining({
          displayName: 'Maria',
          photoURL: 'https://example.com/avatar.jpg',
          phone: '91999990000',
          updatedAt: 'SERVER_TIMESTAMP',
        }),
      );
    });

    it('propagates Firestore errors when profile update fails', async () => {
      mockUpdateDoc.mockRejectedValueOnce(new Error('permission-denied'));

      await expect(updateUserProfile('user-1', {
        displayName: 'Maria',
      })).rejects.toThrow('permission-denied');
    });
  });
});
