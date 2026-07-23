import bcrypt from 'bcrypt';
import { EStatusErrors } from '../../../enum/EStatusErros.enum';
import { prisma } from '../../../prisma-conn';

// Enum

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

    if (!findUser.resetPasswordSecret) {
      const genereteSecret = Date.now().toString().slice(-6);

      const { secret } = await prisma.resetPasswordSecret.create({
        data: {
          secret: genereteSecret,
          userId: findUser.id,
        },
        select: {
          secret: true,
        },
      });

      // UtilsSendMail.send(email, secret);
      return { email, secret };
    }

    // UtilsSendMail.send(email, findUser.resetPasswordSecret.secret);
    return { email, secret: findUser.resetPasswordSecret.secret };
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
      findUser.resetPasswordSecret.secret !== secret
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
      findUser.resetPasswordSecret.secret !== secret
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
        name: true,
        email: true,
      },
    });

    await prisma.resetPasswordSecret.delete({
      where: {
        userId: findUser.id,
      },
    });

    return update;
  }
}

export const resetPasswordService = new ResetPasswordService();
