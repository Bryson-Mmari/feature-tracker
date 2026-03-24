import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const featureModelMock = vi.hoisted(() => ({
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updateStatus: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('./models/featureModel', () => ({
  default: featureModelMock,
}));

import app from './app';

describe('feature API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('responds on the health route', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('API is running...');
  });

  it('lists features with parsed filters and pagination', async () => {
    featureModelMock.getAll.mockResolvedValueOnce({
      data: [{ id: 1, title: 'Feature alpha', priority: 'High', status: 'Open' }],
      total: 6,
    });

    const response = await request(app).get('/api/features').query({ status: 'Open', page: 2, limit: 3 });

    expect(response.status).toBe(200);
    expect(featureModelMock.getAll).toHaveBeenCalledWith({ status: 'Open', page: 2, limit: 3 });
    expect(response.body).toEqual({
      data: [{ id: 1, title: 'Feature alpha', priority: 'High', status: 'Open' }],
      total: 6,
      page: 2,
      totalPages: 2,
    });
  });

  it('rejects feature creation without a title', async () => {
    const response = await request(app).post('/api/features').send({ description: 'Missing title' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Title is required' });
    expect(featureModelMock.create).not.toHaveBeenCalled();
  });

  it('creates a feature when the payload is valid', async () => {
    const payload = {
      title: 'Feature beta',
      description: 'A new request',
      priority: 'Medium',
      status: 'Open',
    };

    const response = await request(app).post('/api/features').send(payload);

    expect(response.status).toBe(201);
    expect(featureModelMock.create).toHaveBeenCalledWith(payload);
    expect(response.body).toEqual({ message: 'Feature created successfully' });
  });

  it('updates a feature record', async () => {
    const payload = {
      title: 'Feature gamma',
      description: 'Updated copy',
      priority: 'Low',
      status: 'In Progress',
    };

    const response = await request(app).put('/api/features/7').send(payload);

    expect(response.status).toBe(200);
    expect(featureModelMock.update).toHaveBeenCalledWith(7, payload);
    expect(response.body).toEqual({ message: 'Feature updated successfully' });
  });

  it('rejects status updates without a status value', async () => {
    const response = await request(app).patch('/api/features/3/status').send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Status is required' });
    expect(featureModelMock.updateStatus).not.toHaveBeenCalled();
  });

  it('updates only the feature status when requested', async () => {
    const response = await request(app)
      .patch('/api/features/3/status')
      .send({ status: 'Completed' });

    expect(response.status).toBe(200);
    expect(featureModelMock.updateStatus).toHaveBeenCalledWith(3, 'Completed');
    expect(response.body).toEqual({ message: 'Status updated successfully' });
  });

  it('deletes a feature record', async () => {
    const response = await request(app).delete('/api/features/9');

    expect(response.status).toBe(200);
    expect(featureModelMock.delete).toHaveBeenCalledWith(9);
    expect(response.body).toEqual({ message: 'Feature deleted successfully' });
  });
});
