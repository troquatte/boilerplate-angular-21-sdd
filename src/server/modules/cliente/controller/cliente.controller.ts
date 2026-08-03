import { Request, Response } from 'express';
import { ErrorHandlerHelper } from '../../../helpers/error-handler.helpers';
import { clienteService } from '../service/cliente.service';

class ClienteController {
  public async list(req: Request, res: Response) {
    try {
      const data = await clienteService.list();
      return res.json({ data });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const data = await clienteService.create(req.body);
      return res.status(201).json({ data });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const data = await clienteService.update(req.params['id'], req.body);
      return res.json({ data });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      await clienteService.delete(req.params['id']);
      return res.status(204).send();
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }
}

export const clienteController = new ClienteController();
