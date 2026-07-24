import { Router } from 'express';
import { MiddlewareAuth } from '../../middleware/auth-middleware';
import { customerController } from './controller/customer.controller';

const router = Router();
const baseUrl = '/customers';

router.post(
  `${baseUrl}`,
  MiddlewareAuth.authenticate,
  customerController.create,
);
router.get(
  `${baseUrl}`,
  MiddlewareAuth.authenticate,
  customerController.list,
);
router.get(
  `${baseUrl}/:id`,
  MiddlewareAuth.authenticate,
  customerController.findById,
);
router.put(
  `${baseUrl}/:id`,
  MiddlewareAuth.authenticate,
  customerController.update,
);
router.delete(
  `${baseUrl}/:id`,
  MiddlewareAuth.authenticate,
  customerController.delete,
);

export const customerRouter = router;
