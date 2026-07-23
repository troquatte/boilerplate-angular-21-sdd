import bcrypt from 'bcrypt';
import { EStatusErrors } from '../../../enum/EStatusErros.enum';
import { prisma } from '../../../prisma-conn';

class ResetPasswordService {
  public async validateUser(email: string) {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        resetPasswordSecret: true,
      },
    });

    if (!findUser) {
      throw new Error(EStatusErrors.E404);
    }

    const genereteSecret = Date.now().toString().slice(-6);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de validade

    if (findUser.resetPasswordSecret) {
      await prisma.resetPasswordSecret.delete({
        where: { userId: findUser.id },
      });
    }

    const createdSecret = await prisma.resetPasswordSecret.create({
      data: {
        secret: genereteSecret,
        userId: findUser.id,
        expiresAt,
      },
      select: {
        secret: true,
      },
    });

    return { email, secret: createdSecret.secret };
  }

  public async validateSecurityCode(email: string, secret: string) {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        resetPasswordSecret: true,
      },
    });

    if (
      !findUser ||
      !findUser.resetPasswordSecret ||
      findUser.resetPasswordSecret.secret !== secret ||
      findUser.resetPasswordSecret.expiresAt < new Date()
    ) {
      throw new Error(EStatusErrors.E404);
    }

    return { email, secret };
  }

  public async resetPassword(
    email: string,
    secret: string,
    newPassword: string,
  ) {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        resetPasswordSecret: true,
      },
    });

    if (
      !findUser ||
      !findUser.resetPasswordSecret ||
      findUser.resetPasswordSecret.secret !== secret ||
      findUser.resetPasswordSecret.expiresAt < new Date()
    ) {
      throw new Error(EStatusErrors.E404);
    }

    const update = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: bcrypt.hashSync(newPassword, 6),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    await prisma.resetPasswordSecret.delete({
      where: {
        userId: findUser.id,
      },
    });

    // Revoga todas as sessões ativas do usuário ao redefinir a senha com sucesso
    await prisma.refreshToken.deleteMany({
      where: {
        userId: findUser.id,
      },
    });

    return update;
  }
}

export const resetPasswordService = new ResetPasswordService();
