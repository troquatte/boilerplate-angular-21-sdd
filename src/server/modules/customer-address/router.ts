import { Router } from 'express';
import { MiddlewareAuth } from '../../middleware/auth-middleware';
import { customerAddressController } from './controller/customer-address.controller';

const router = Router();

router.post(
  '/customers/:customerId/addresses',
  MiddlewareAuth.authenticate,
  customerAddressController.create,
);
router.get(
  '/customers/:customerId/addresses',
  MiddlewareAuth.authenticate,
  customerAddressController.list,
);
router.put(
  '/customers/:customerId/addresses/:id',
  MiddlewareAuth.authenticate,
  customerAddressController.update,
);
router.delete(
  '/customers/:customerId/addresses/:id',
  MiddlewareAuth.authenticate,
  customerAddressController.delete,
);

export const customerAddressRouter = router;
