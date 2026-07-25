import { Request, Response } from 'express';
import { z } from 'zod';
import { EStatusErrors } from '../../../enum/EStatusErros.enum';
import { EZod } from '../../../enum/EZod.enum';
import { ErrorHandlerHelper } from '../../../helpers/error-handler.helpers';
import { prisma } from '../../../prisma-conn';
import { customerAddressService } from '../service/customer-address.service';

const ZCustomerAddressCreateSchema = z.object({
  cep: z.string().min(8, { message: `CEP ${EZod.REQUIRED}` }),
  logradouro: z.string().min(1, { message: `Logradouro ${EZod.REQUIRED}` }),
  complemento: z.string().nullable().optional(),
  unidade: z.string().nullable().optional(),
  bairro: z.string().min(1, { message: `Bairro ${EZod.REQUIRED}` }),
  localidade: z.string().min(1, { message: `Cidade ${EZod.REQUIRED}` }),
  uf: z.string().min(2).max(2, { message: `UF ${EZod.REQUIRED}` }),
  estado: z.string().nullable().optional(),
});

const ZCustomerAddressUpdateSchema = z.object({
  cep: z.string().min(8).optional(),
  logradouro: z.string().min(1).optional(),
  complemento: z.string().nullable().optional(),
  unidade: z.string().nullable().optional(),
  bairro: z.string().min(1).optional(),
  localidade: z.string().min(1).optional(),
  uf: z.string().min(2).max(2).optional(),
  estado: z.string().nullable().optional(),
});

class CustomerAddressController {
  private validateOwnerOrAdmin = async (
    res: Response,
    tokenUserId: string,
    customerId: string,
  ): Promise<{ authorized: boolean; customer?: any }> => {
    try {
      const currentUser = await prisma.user.findUnique({
        where: { id: tokenUserId },
      });

      if (!currentUser) {
        res.status(401).json({ error: 'Não autorizado.' });
        return { authorized: false };
      }

      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        res.status(404).json({ error: EStatusErrors.E404 });
        return { authorized: false };
      }

      if (currentUser.role !== 'ADMIN' && customer.userId !== currentUser.id) {
        res.status(403).json({
          error: EStatusErrors.E403,
          message: 'Acesso negado. Você não é proprietário deste cadastro de cliente.',
        });
        return { authorized: false };
      }

      return { authorized: true, customer };
    } catch (err) {
      throw err;
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const tokenUserId = (req as any).tokenUserId;

      const authCheck = await this.validateOwnerOrAdmin(res, tokenUserId, customerId);
      if (!authCheck.authorized) return;

      const payload = ZCustomerAddressCreateSchema.parse(req.body);

      const address = await customerAddressService.create(customerId, payload);

      return res.status(201).json({
        data: address,
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  };

  public list = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const tokenUserId = (req as any).tokenUserId;

      const authCheck = await this.validateOwnerOrAdmin(res, tokenUserId, customerId);
      if (!authCheck.authorized) return;

      const addresses = await customerAddressService.listByCustomer(customerId);

      return res.json({
        data: addresses,
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const { customerId, id } = req.params;
      const tokenUserId = (req as any).tokenUserId;

      const authCheck = await this.validateOwnerOrAdmin(res, tokenUserId, customerId);
      if (!authCheck.authorized) return;

      const address = await prisma.customerAddress.findUnique({
        where: { id },
      });

      if (!address || address.customerId !== customerId) {
        return res.status(404).json({
          error: EStatusErrors.E404,
          message: 'Endereço não encontrado para este cliente.',
        });
      }

      const payload = ZCustomerAddressUpdateSchema.parse(req.body);

      const updated = await customerAddressService.update(id, payload);

      return res.json({
        data: updated,
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const { customerId, id } = req.params;
      const tokenUserId = (req as any).tokenUserId;

      const authCheck = await this.validateOwnerOrAdmin(res, tokenUserId, customerId);
      if (!authCheck.authorized) return;

      const address = await prisma.customerAddress.findUnique({
        where: { id },
      });

      if (!address || address.customerId !== customerId) {
        return res.status(404).json({
          error: EStatusErrors.E404,
          message: 'Endereço não encontrado para este cliente.',
        });
      }

      await customerAddressService.delete(id);

      return res.json({
        message: 'Endereço deletado com sucesso.',
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  };
}

export const customerAddressController = new CustomerAddressController();
