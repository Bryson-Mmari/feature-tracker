import { Router, type Router as ExpressRouter } from 'express';
import {
  createFeature,
  deleteFeature,
  getFeatures,
  updateFeature,
  updateFeatureStatus
} from '../controllers/featureController';

const router: ExpressRouter = Router();

router.get('/', getFeatures);
router.post('/', createFeature);
router.put('/:id', updateFeature);
router.patch('/:id/status', updateFeatureStatus);
router.delete('/:id', deleteFeature);

export default router;
