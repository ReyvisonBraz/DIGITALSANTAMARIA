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
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  writeBatch: (...args: unknown[]) => mockWriteBatch(...args),
}));

jest.mock('@/lib/firebase', () => ({
  db: { app: 'test-db' },
}));

jest.mock('@/lib/firebase/converters', () => ({
  reportConverter: {},
}));

jest.mock('@/services/notifications.service', () => ({
  tryCreateNotification: jest.fn(),
}));

import {
  createReport,
  getReportById,
  cancelReportByCitizen,
  updateReportStatus,
  getReportsByUser,
  getPendingReports,
  getAllReports,
  getTopReports,
} from '@/services/reports.service';

describe('reports.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddDoc.mockResolvedValue({ id: 'report-new-id' });
    mockUpdateDoc.mockResolvedValue(undefined);
    mockGetDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
    mockGetDocs.mockResolvedValue({ docs: [], empty: true });
  });

  describe('createReport', () => {
    it('creates a report with pending status', async () => {
      await expect(createReport({
        reporterId: 'user-1',
        reporterName: 'Maria',
        type: 'infrastructure',
        title: 'Buraco na via',
        description: 'Existe um buraco grande na via principal.',
        location: null,
        isPetition: false,
      })).resolves.toBe('report-new-id');

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'reports' }),
        expect.objectContaining({
          reporterId: 'user-1',
          reporterName: 'Maria',
          type: 'infrastructure',
          title: 'Buraco na via',
          status: 'pending',
          votes: 0,
        }),
      );
    });

    it('stores external photo metadata when photoURL is provided', async () => {
      await createReport({
        reporterId: 'user-1',
        reporterName: 'Maria',
        type: 'infrastructure',
        title: 'Buraco na via',
        description: 'Existe um buraco grande na via principal.',
        location: null,
        isPetition: false,
        photoURL: 'https://example.com/foto.jpg',
      });

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          photo: expect.objectContaining({
            url: 'https://example.com/foto.jpg',
            path: 'external',
            name: 'Imagem externa',
          }),
        }),
      );
    });

    it('sets photo to null when no photoURL is provided', async () => {
      await createReport({
        reporterId: 'user-1',
        reporterName: 'Maria',
        type: 'environment',
        title: 'Descarte irregular',
        description: 'Descarte irregular de lixo hospitalar.',
        location: null,
        isPetition: false,
      });

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ photo: null }),
      );
    });

    it('trims whitespace from photoURL', async () => {
      await createReport({
        reporterId: 'user-1',
        reporterName: 'Maria',
        type: 'security',
        title: 'Iluminação quebrada',
        description: 'Poste sem luz na rua.',
        location: null,
        isPetition: false,
        photoURL: '  https://example.com/foto.jpg  ',
      });

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          photo: expect.objectContaining({ url: 'https://example.com/foto.jpg' }),
        }),
      );
    });

    it('propagates Firestore errors', async () => {
      mockAddDoc.mockRejectedValueOnce(new Error('permission-denied'));

      await expect(createReport({
        reporterId: 'user-1',
        reporterName: 'Maria',
        type: 'infrastructure',
        title: 'Test',
        description: 'Test',
        location: null,
        isPetition: false,
      })).rejects.toThrow('permission-denied');
    });
  });

  describe('getReportById', () => {
    it('returns null when report does not exist', async () => {
      mockGetDoc.mockResolvedValueOnce({ exists: () => false });

      const result = await getReportById('nonexistent');
      expect(result).toBeNull();
    });

    it('returns the report data when it exists', async () => {
      const reportData = {
        id: 'report-1',
        reporterId: 'user-1',
        title: 'Buraco na via',
        status: 'pending',
      };
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => reportData,
      });

      const result = await getReportById('report-1');
      expect(result).toEqual(reportData);
    });
  });

  describe('getReportsByUser', () => {
    it('returns reports for a specific user', async () => {
      const reports = [
        { id: 'r1', data: () => ({ id: 'r1', reporterId: 'user-1', title: 'Report 1', createdAt: { toMillis: () => 1000 } }) },
        { id: 'r2', data: () => ({ id: 'r2', reporterId: 'user-1', title: 'Report 2', createdAt: { toMillis: () => 2000 } }) },
      ];
      mockGetDocs.mockResolvedValueOnce({ docs: reports });

      const result = await getReportsByUser('user-1');
      expect(result).toHaveLength(2);
    });

    it('returns empty array when user has no reports', async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [] });

      const result = await getReportsByUser('user-1');
      expect(result).toHaveLength(0);
    });
  });

  describe('cancelReportByCitizen', () => {
    it('cancels a report with valid reason', async () => {
      const tx = {
        get: jest.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({
            reporterId: 'user-1',
            status: 'pending',
          }),
        }),
        update: jest.fn(),
      };
      mockRunTransaction.mockImplementation((_db: unknown, cb: (t: unknown) => Promise<unknown>) => cb(tx));

      await cancelReportByCitizen('report-1', 'user-1', 'Não preciso mais deste relato');

      expect(tx.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: 'cancelled',
          cancellation: expect.objectContaining({
            cancelledBy: 'user-1',
            reason: 'Não preciso mais deste relato',
          }),
        }),
      );
    });

    it('throws when reason is too short', async () => {
      await expect(
        cancelReportByCitizen('report-1', 'user-1', 'curto')
      ).rejects.toThrow('justificativa');
    });

    it('throws when report does not exist', async () => {
      const tx = {
        get: jest.fn().mockResolvedValue({ exists: () => false }),
        update: jest.fn(),
      };
      mockRunTransaction.mockImplementation((_db: unknown, cb: (t: unknown) => Promise<unknown>) => cb(tx));

      await expect(
        cancelReportByCitizen('missing', 'user-1', 'Razão válida para cancelamento')
      ).rejects.toThrow('não encontrado');
    });

    it('throws when user is not the report owner', async () => {
      const tx = {
        get: jest.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({
            reporterId: 'other-user',
            status: 'pending',
          }),
        }),
        update: jest.fn(),
      };
      mockRunTransaction.mockImplementation((_db: unknown, cb: (t: unknown) => Promise<unknown>) => cb(tx));

      await expect(
        cancelReportByCitizen('report-1', 'user-1', 'Razão válida para cancelamento')
      ).rejects.toThrow('permissão');
    });

    it('throws when report status is not cancellable', async () => {
      const tx = {
        get: jest.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({
            reporterId: 'user-1',
            status: 'resolved',
          }),
        }),
        update: jest.fn(),
      };
      mockRunTransaction.mockImplementation((_db: unknown, cb: (t: unknown) => Promise<unknown>) => cb(tx));

      await expect(
        cancelReportByCitizen('report-1', 'user-1', 'Razão válida para cancelamento')
      ).rejects.toThrow('não pode mais ser cancelado');
    });
  });

  describe('getTopReports', () => {
    it('returns top reports sorted by votes', async () => {
      const reports = [
        { id: 'r1', data: () => ({ id: 'r1', votes: 10 }) },
        { id: 'r2', data: () => ({ id: 'r2', votes: 5 }) },
      ];
      mockGetDocs.mockResolvedValueOnce({ docs: reports });

      const result = await getTopReports(10);
      expect(result).toHaveLength(2);
      expect(mockLimit).toHaveBeenCalledWith(10);
    });

    it('uses default limit of 10', async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [] });

      await getTopReports();
      expect(mockLimit).toHaveBeenCalledWith(10);
    });
  });
});
