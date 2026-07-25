import { EStatusErrors } from '../../../enum/EStatusErros.enum';
import { prisma } from '../../../prisma-conn';

class CustomerAddressService {
  public async create(
    customerId: string,
    payload: {
      cep: string;
      logradouro: string;
      complemento?: string | null;
      unidade?: string | null;
      bairro: string;
      localidade: string;
      uf: string;
      estado?: string | null;
    },
  ) {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new Error(EStatusErrors.E404);
      }

      const address = await prisma.customerAddress.create({
        data: {
          ...payload,
          customerId,
        },
      });

      return address;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async listByCustomer(customerId: string) {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new Error(EStatusErrors.E404);
      }

      const addresses = await prisma.customerAddress.findMany({
        where: { customerId },
        orderBy: { createdAt: 'asc' },
      });

      return addresses;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async update(
    id: string,
    payload: {
      cep?: string;
      logradouro?: string;
      complemento?: string | null;
      unidade?: string | null;
      bairro?: string;
      localidade?: string;
      uf?: string;
      estado?: string | null;
    },
  ) {
    try {
      const address = await prisma.customerAddress.findUnique({
        where: { id },
      });

      if (!address) {
        throw new Error(EStatusErrors.E404);
      }

      const updated = await prisma.customerAddress.update({
        where: { id },
        data: payload,
      });

      return updated;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async delete(id: string) {
    try {
      const address = await prisma.customerAddress.findUnique({
        where: { id },
      });

      if (!address) {
        throw new Error(EStatusErrors.E404);
      }

      return await prisma.customerAddress.delete({
        where: { id },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const customerAddressService = new CustomerAddressService();
