import { EStatusErrors } from '../../../enum/EStatusErros.enum';
import { prisma } from '../../../prisma-conn';

class CustomerService {
  public async create(payload: {
    name?: string | null;
    phone: string;
    cpf?: string | null;
    userId: string;
  }) {
    try {
      const { name, phone, cpf, userId } = payload;

      // Verifica se o usuário já possui um cadastro de cliente associado
      const existingUserCustomer = await prisma.customer.findUnique({
        where: { userId },
      });
      if (existingUserCustomer) {
        throw new Error(EStatusErrors.E409);
      }

      // Verifica se já existe um cliente com o mesmo CPF
      if (cpf) {
        const existingCpf = await prisma.customer.findUnique({
          where: { cpf },
        });
        if (existingCpf) {
          throw new Error(EStatusErrors.E409);
        }
      }

      const customer = await prisma.customer.create({
        data: {
          name,
          phone,
          cpf,
          userId,
        },
      });

      return customer;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async list(filter?: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {
        active: true,
      };

      if (filter) {
        whereClause.OR = [
          { name: { contains: filter, mode: 'insensitive' } },
          { phone: { contains: filter, mode: 'insensitive' } },
          { cpf: { contains: filter, mode: 'insensitive' } },
        ];
      }

      const [customers, total] = await prisma.$transaction([
        prisma.customer.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.customer.count({
          where: whereClause,
        }),
      ]);

      return {
        customers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async findById(id: string) {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id },
      });

      if (!customer) {
        throw new Error(EStatusErrors.E404);
      }

      return customer;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async update(
    id: string,
    payload: { name?: string | null; phone?: string; cpf?: string | null },
  ) {
    try {
      const { name, phone, cpf } = payload;

      const customer = await prisma.customer.findUnique({
        where: { id },
      });

      if (!customer) {
        throw new Error(EStatusErrors.E404);
      }

      // Se um novo CPF for enviado, valida se não pertence a outro cliente
      if (cpf && cpf !== customer.cpf) {
        const existingCpf = await prisma.customer.findUnique({
          where: { cpf },
        });
        if (existingCpf) {
          throw new Error(EStatusErrors.E409);
        }
      }

      const updated = await prisma.customer.update({
        where: { id },
        data: {
          name,
          phone,
          cpf,
        },
      });

      return updated;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async deactivate(id: string) {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id },
      });

      if (!customer) {
        throw new Error(EStatusErrors.E404);
      }

      const updated = await prisma.customer.update({
        where: { id },
        data: {
          active: false,
        },
      });

      return updated;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const customerService = new CustomerService();
