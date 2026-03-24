import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../config/db';
import type { Feature, FeatureStatus } from '../types/feature';

interface FeatureRow extends RowDataPacket, Feature {}

const featureModel = {
  getAll: async (): Promise<Feature[]> => {
    const [rows] = await db.query<FeatureRow[]>('SELECT * FROM feature_requests ORDER BY created_at DESC');
    return rows;
  },

  create: async (data: Feature): Promise<ResultSetHeader> => {
    const { title, description, priority, status } = data;
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO feature_requests (title, description, priority, status) VALUES (?, ?, ?, ?)',
      [title, description, priority, status]
    );
    return result;
  },

  update: async (id: number, data: Feature): Promise<ResultSetHeader> => {
    const { title, description, priority, status } = data;
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE feature_requests SET title=?, description=?, priority=?, status=? WHERE id=?',
      [title, description, priority, status, id]
    );
    return result;
  },

  updateStatus: async (id: number, status: FeatureStatus): Promise<ResultSetHeader> => {
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE feature_requests SET status=? WHERE id=?',
      [status, id]
    );
    return result;
  },

  delete: async (id: number): Promise<ResultSetHeader> => {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM feature_requests WHERE id=?', [id]);
    return result;
  }
};

export default featureModel;
