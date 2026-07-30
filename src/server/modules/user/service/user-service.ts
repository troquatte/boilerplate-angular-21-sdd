import bcrypt from 'bcrypt';
import { EStatusErrors } from '../../../enum/EStatusErros.enum';
import { prisma } from '../../../prisma-conn';

class UserService {
  public async create(payload: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    try {
      const { name, email, password, role } = payload;

      const findUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (findUser) {
        throw new Error(EStatusErrors.E409);
      }

      const create = await prisma.user.create({
        data: {
          name,
          email,
          password: bcrypt.hashSync(password, 6),
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return create;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async read(id: string) {
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (!findUser) {
        throw new Error(EStatusErrors.E404);
      }

      return findUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async update(id: string, name: string, role: string) {
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!findUser) {
        throw new Error(EStatusErrors.E404);
      }

      const update = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return update;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async delete(id: string) {
    try {
      return await prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (err: any) {
      throw new Error(EStatusErrors.E404);
    }
  }
}

export const userService = new UserService();
