import bcrypt from 'bcrypt';
import { prisma } from '../../../prisma-conn';
import { EStatusErrors } from '../../../enum/EStatusErros.enum';

function dateToStringBR(date: Date | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function stringBRToDate(str: string | null | undefined): Date | null {
  if (!str) return null;
  const [day, month, year] = str.split('/').map(Number);
  if (!day || !month || !year) return null;
  return new Date(Date.UTC(year, month - 1, day));
}

class ClienteService {
  public async findById(id: string) {
    try {
      const cliente = await prisma.cliente.findUnique({ where: { id } });
      if (!cliente) {
        throw new Error(EStatusErrors.E404);
      }
      return {
        ...cliente,
        birthDate: dateToStringBR(cliente.birthDate),
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  public async list(params: { page?: number; pageSize?: number; search?: string }) {
    try {
      const page = Math.max(1, params.page || 1);
      const pageSize = Math.max(1, params.pageSize || 10);
      const skip = (page - 1) * pageSize;

      const where = params.search
        ? {
            OR: [
              { cpf: { contains: params.search, mode: 'insensitive' as const } },
              { phone: { contains: params.search, mode: 'insensitive' as const } },
            ],
          }
        : undefined;

      const [dataRaw, total] = await Promise.all([
        prisma.cliente.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),
        prisma.cliente.count({ where }),
      ]);

      const data = dataRaw.map((c) => ({
        ...c,
        birthDate: dateToStringBR(c.birthDate),
      }));

      const totalPages = Math.ceil(total / pageSize);

      return { data, meta: { page, pageSize, total, totalPages } };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async create(payload: {
    phone: string;
    cpf?: string;
    fullName?: string;
    email?: string;
    birthDate?: string;
    tipo?: string;
  }) {
    try {
      const { phone, cpf, fullName, email, birthDate, tipo } = payload;

      let userId: string | undefined;

      if (email) {
        if (!cpf) {
          throw new Error('CPF obrigatorio para gerar acesso.');
        }

        const existingUser = await prisma.user.findUnique({
          where: { email },
          include: { cliente: true },
        });

        if (existingUser) {
          if (existingUser.cliente) {
            throw new Error('Email ja vinculado a outro cliente.');
          }
          userId = existingUser.id;
        } else {
          const newUser = await prisma.user.create({
            data: {
              name: fullName || null,
              email,
              password: bcrypt.hashSync(cpf, 6),
              role: 'CUSTOMER',
            },
          });
          userId = newUser.id;
        }
      }

      return await prisma.cliente.create({
        data: {
          phone,
          cpf: cpf || null,
          fullName: fullName || null,
          email: email || null,
          birthDate: stringBRToDate(birthDate),
          tipo: tipo || null,
          userId: userId || null,
        },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async update(
    id: string,
    payload: {
      phone?: string;
      cpf?: string;
      fullName?: string;
      email?: string;
      birthDate?: string;
      tipo?: string;
    },
  ) {
    try {
      const cliente = await prisma.cliente.findUnique({ where: { id } });
      if (!cliente) {
        throw new Error(EStatusErrors.E404);
      }

      const { phone, cpf, fullName, email, birthDate, tipo } = payload;
      let userId = cliente.userId;

      const emailChanged =
        email !== undefined &&
        ((cliente.email === null && email !== null) ||
          cliente.email !== email);

      if (emailChanged) {
        if (cliente.userId) {
          await prisma.cliente.update({
            where: { id },
            data: { userId: null },
          });
          userId = null;
        }

        if (email) {
          if (!cpf && !cliente.cpf) {
            throw new Error('CPF obrigatorio para gerar acesso.');
          }
          const cpfToUse = cpf || cliente.cpf;

          const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { cliente: true },
          });

          if (existingUser) {
            if (existingUser.cliente && existingUser.cliente.id !== id) {
              throw new Error('Email ja vinculado a outro cliente.');
            }
            userId = existingUser.id;
          } else {
            const newUser = await prisma.user.create({
              data: {
                name: fullName || cliente.fullName || null,
                email,
                password: bcrypt.hashSync(cpfToUse || '', 6),
                role: 'CUSTOMER',
              },
            });
            userId = newUser.id;
          }
        }
      }

      return await prisma.cliente.update({
        where: { id },
        data: {
          phone: phone !== undefined ? phone : cliente.phone,
          cpf: cpf !== undefined ? cpf || null : cliente.cpf,
          fullName: fullName !== undefined ? fullName || null : cliente.fullName,
          email: email !== undefined ? email || null : cliente.email,
          birthDate: birthDate !== undefined ? stringBRToDate(birthDate) : cliente.birthDate,
          tipo: tipo !== undefined ? tipo || null : cliente.tipo,
          userId,
        },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async delete(id: string) {
    try {
      const cliente = await prisma.cliente.findUnique({ where: { id } });
      if (!cliente) {
        throw new Error(EStatusErrors.E404);
      }

      return await prisma.cliente.delete({ where: { id } });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const clienteService = new ClienteService();
