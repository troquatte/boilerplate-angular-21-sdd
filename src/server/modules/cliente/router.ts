import { Router } from 'express';
import { clienteController } from './controller/cliente.controller';

const router = Router();
const baseUrl = '/dashboard/clientes';

router.get(`${baseUrl}`, clienteController.list);
router.get(`${baseUrl}/:id`, clienteController.findById);
router.post(`${baseUrl}`, clienteController.create);
router.patch(`${baseUrl}/:id`, clienteController.update);
router.delete(`${baseUrl}/:id`, clienteController.delete);

export const clienteRouter = router;
