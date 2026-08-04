import { Request, Response } from 'express';
import { ErrorHandlerHelper } from '../../../helpers/error-handler.helpers';
import { clienteService } from '../service/cliente.service';

class ClienteController {
  public async list(req: Request, res: Response) {
    try {
      const page = req.query['page'] ? parseInt(req.query['page'] as string, 10) : undefined;
      const pageSize = req.query['pageSize'] ? parseInt(req.query['pageSize'] as string, 10) : undefined;
      const search = req.query['search'] as string | undefined;

      const result = await clienteService.list({ page, pageSize, search });
      return res.json(result);
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async findById(req: Request, res: Response) {
    try {
      const data = await clienteService.findById(req.params['id']);
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
