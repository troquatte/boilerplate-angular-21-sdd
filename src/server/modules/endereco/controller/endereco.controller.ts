import { Request, Response } from 'express';
import { ErrorHandlerHelper } from '../../../helpers/error-handler.helpers';
import { enderecoService } from '../service/endereco.service';

class EnderecoController {
  public async list(req: Request, res: Response) {
    try {
      const result = await enderecoService.list(req.params['clienteId']);
      return res.json(result);
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const data = await enderecoService.create(req.params['clienteId'], req.body);
      return res.status(201).json({ data });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async findById(req: Request, res: Response) {
    try {
      const data = await enderecoService.findById(req.params['clienteId'], req.params['id']);
      return res.json({ data });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const data = await enderecoService.update(req.params['clienteId'], req.params['id'], req.body);
      return res.json({ data });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      await enderecoService.delete(req.params['clienteId'], req.params['id']);
      return res.status(204).send();
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async selectPrincipal(req: Request, res: Response) {
    try {
      const data = await enderecoService.selectPrincipal(req.params['clienteId'], req.params['id']);
      return res.json({ data });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }
}

export const enderecoController = new EnderecoController();
