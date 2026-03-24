import type { Request, Response } from 'express';
import featureModel from '../models/featureModel';
import type { Feature, FeatureStatus } from '../types/feature';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'An unexpected error occurred';

export const getFeatures = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 5 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const filters =
      typeof status === 'string'
        ? { status: status as FeatureStatus, page: pageNumber, limit: limitNumber }
        : { page: pageNumber, limit: limitNumber };

    const result = await featureModel.getAll(filters);

    res.json({
      data: result.data,
      total: result.total,
      page: pageNumber,
      totalPages: Math.ceil(result.total / limitNumber)
    });

  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const createFeature = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    await featureModel.create(req.body as Feature);
    res.status(201).json({ message: 'Feature created successfully' });
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const updateFeature = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    await featureModel.update(id, req.body as Feature);
    res.json({ message: 'Feature updated successfully' });
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const updateFeatureStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: 'Status is required' });
      return;
    }

    await featureModel.updateStatus(id, status as FeatureStatus);

    res.json({ message: 'Status updated successfully' });

  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const deleteFeature = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    await featureModel.delete(id);
    res.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};
