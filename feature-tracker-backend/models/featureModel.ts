import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../config/db';
import type { Feature, FeatureFilters, FeatureListResult, FeatureStatus } from '../types/feature';

interface FeatureRow extends RowDataPacket, Feature {
  id: number;
}

interface CountRow extends RowDataPacket {
  total: number;
}

const featureModel = {
  getAll: async ({ status, page, limit }: FeatureFilters): Promise<FeatureListResult> => {
    let query = 'SELECT * FROM feature_requests';
    let countQuery = 'SELECT COUNT(*) as total FROM feature_requests';
    const values: Array<string | number> = [];

    if (status) {
      query += ' WHERE status = ?';
      countQuery += ' WHERE status = ?';
      values.push(status);
    }

    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await db.query<FeatureRow[]>(query, values);
    const [countResult] = await db.query<CountRow[]>(countQuery, status ? [status] : []);

    return {
      data: rows,
      total: countResult[0]?.total ?? 0,
    };
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
