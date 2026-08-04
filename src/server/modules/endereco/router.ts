import { Router } from 'express';
import { enderecoController } from './controller/endereco.controller';

const router = Router();
const baseUrl = '/dashboard/clientes/:clienteId/enderecos';

router.get(`${baseUrl}`, enderecoController.list);
router.post(`${baseUrl}`, enderecoController.create);
router.get(`${baseUrl}/:id`, enderecoController.findById);
router.patch(`${baseUrl}/:id`, enderecoController.update);
router.delete(`${baseUrl}/:id`, enderecoController.delete);

export const enderecoRouter = router;
