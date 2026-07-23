import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../prisma-conn';

// ENUM
import { EStatusErrors } from '../../../enum/EStatusErros.enum';

// Utils
import { getEnv } from '../../../utils/get-env.utils';
import { UtilsTokenAuth } from '../utils/token.utils';

class AuthService {
  public async login(email: string, password: string) {
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: true,
        },
      });

      if (!findUser) {
        throw new Error(EStatusErrors.E404);
      }

      if (!bcrypt.compareSync(password, findUser.password || '')) {
        throw new Error(EStatusErrors.E401);
      }

      const tokens = UtilsTokenAuth.jwtGenerate(findUser as any);

      // Salva o refresh token no banco de dados local com expiração de 7 dias
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: findUser.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return tokens;
    } catch (err: any) {
      throw new Error(err.message === EStatusErrors.E401 ? EStatusErrors.E401 : EStatusErrors.E404);
    }
  }

  public async token(refresherToken: string) {
    try {
      // Verifica integridade e validade do JWT
      await jwt.verify(
        refresherToken,
        getEnv('JWT_REFRESH_TOKEN_SECRET'),
      );

      const decode = (await jwt.decode(refresherToken)) as { id: string };

      // Busca no banco
      const savedToken = await prisma.refreshToken.findUnique({
        where: { token: refresherToken },
      });

      // Se não existir ou estiver expirado no banco
      if (!savedToken || savedToken.expiresAt < new Date()) {
        if (savedToken) {
          await prisma.refreshToken.delete({ where: { token: refresherToken } }).catch(() => {});
        }
        throw new Error(EStatusErrors.E401);
      }

      const findUser = await prisma.user.findUnique({
        where: {
          id: decode.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: true,
        },
      });

      if (!findUser) {
        throw new Error(EStatusErrors.E404);
      }

      const newTokens = UtilsTokenAuth.jwtGenerate(findUser as any);

      // Deleta o token antigo e registra o novo
      await prisma.refreshToken.delete({
        where: { token: refresherToken },
      });

      await prisma.refreshToken.create({
        data: {
          token: newTokens.refreshToken,
          userId: findUser.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return newTokens;
    } catch (err: any) {
      throw new Error(EStatusErrors.E401);
    }
  }

  public async logout(refresherToken: string) {
    try {
      await prisma.refreshToken.delete({
        where: { token: refresherToken },
      });
    } catch (err) {
      // Ignora se o token não existir
    }
  }
}

export const authService = new AuthService();
