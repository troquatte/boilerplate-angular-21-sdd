import { Request, Response } from 'express';
import { z } from 'zod';
import { EStatusErrors } from '../../../enum/EStatusErros.enum';
import { EZod } from '../../../enum/EZod.enum';
import { ErrorHandlerHelper } from '../../../helpers/error-handler.helpers';
import { prisma } from '../../../prisma-conn';
import { customerService } from '../service/customer.service';

const ZCustomerCreateSchema = z.object({
  name: z.string().nullable().optional(),
  phone: z.string().min(8, { message: `Telefone ${EZod.REQUIRED}` }),
  cpf: z.string().nullable().optional(),
  userId: z.string().min(1, { message: `userId ${EZod.REQUIRED}` }),
});

const ZCustomerUpdateSchema = z.object({
  name: z.string().nullable().optional(),
  phone: z.string().min(8).optional(),
  cpf: z.string().nullable().optional(),
});

class CustomerController {
  public async create(req: Request, res: Response) {
    try {
      const tokenUserId = (req as any).tokenUserId;
      const currentUser = await prisma.user.findUnique({
        where: { id: tokenUserId },
      });

      if (!currentUser || currentUser.role !== 'ADMIN') {
        return res.status(403).json({
          error: EStatusErrors.E403,
          message: 'Permissão negada. Apenas administradores podem cadastrar clientes.',
        });
      }

      const payload = ZCustomerCreateSchema.parse(req.body);

      const customer = await customerService.create(payload);

      return res.status(201).json({
        data: customer,
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const tokenUserId = (req as any).tokenUserId;
      const currentUser = await prisma.user.findUnique({
        where: { id: tokenUserId },
      });

      if (!currentUser || currentUser.role !== 'ADMIN') {
        return res.status(403).json({
          error: EStatusErrors.E403,
          message: 'Permissão negada. Apenas administradores podem listar clientes.',
        });
      }

      const { filter, page, limit } = req.query;

      const customersData = await customerService.list(
        filter ? String(filter) : undefined,
        page ? Number(page) : 1,
        limit ? Number(limit) : 10,
      );

      return res.json({
        data: customersData,
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tokenUserId = (req as any).tokenUserId;

      const currentUser = await prisma.user.findUnique({
        where: { id: tokenUserId },
      });

      if (!currentUser) {
        return res.status(401).json({ error: 'Não autorizado.' });
      }

      const customer = await customerService.findById(id);

      // Regra de segurança: ADMIN vê qualquer um, cliente vê apenas a si mesmo
      if (currentUser.role !== 'ADMIN' && customer.userId !== currentUser.id) {
        return res.status(403).json({
          error: EStatusErrors.E403,
          message: 'Acesso negado aos dados deste cliente.',
        });
      }

      return res.json({
        data: customer,
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tokenUserId = (req as any).tokenUserId;

      const currentUser = await prisma.user.findUnique({
        where: { id: tokenUserId },
      });

      if (!currentUser) {
        return res.status(401).json({ error: 'Não autorizado.' });
      }

      const customer = await prisma.customer.findUnique({
        where: { id },
      });

      if (!customer) {
        return res.status(404).json({ error: EStatusErrors.E404 });
      }

      // Regra de segurança: ADMIN altera qualquer um, cliente altera apenas a si mesmo
      if (currentUser.role !== 'ADMIN' && customer.userId !== currentUser.id) {
        return res.status(403).json({
          error: EStatusErrors.E403,
          message: 'Acesso negado para alteração deste cliente.',
        });
      }

      const payload = ZCustomerUpdateSchema.parse(req.body);

      const updatedCustomer = await customerService.update(id, payload);

      return res.json({
        data: updatedCustomer,
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tokenUserId = (req as any).tokenUserId;

      const currentUser = await prisma.user.findUnique({
        where: { id: tokenUserId },
      });

      if (!currentUser || currentUser.role !== 'ADMIN') {
        return res.status(403).json({
          error: EStatusErrors.E403,
          message: 'Permissão negada. Apenas administradores podem desativar clientes.',
        });
      }

      await customerService.deactivate(id);

      return res.json({
        message: 'Cliente desativado com sucesso.',
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }
}

export const customerController = new CustomerController();
