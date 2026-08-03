import bcrypt from 'bcrypt';
import { prisma } from '../../../prisma-conn';
import { EStatusErrors } from '../../../enum/EStatusErros.enum';

class ClienteService {
  public async list() {
    try {
      return await prisma.cliente.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async create(payload: {
    phone: string;
    cpf?: string;
    fullName?: string;
    email?: string;
    birthDate?: Date;
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
          birthDate: birthDate || null,
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
      birthDate?: Date;
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
          birthDate: birthDate !== undefined ? birthDate || null : cliente.birthDate,
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
