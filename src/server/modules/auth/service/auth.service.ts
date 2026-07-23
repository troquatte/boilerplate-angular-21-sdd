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

      return UtilsTokenAuth.jwtGenerate(findUser as any);
    } catch (err: any) {
      throw new Error(EStatusErrors.E404);
    }
  }

  public async token(refresherToken: string) {
    try {
      await jwt.verify(
        refresherToken,
        getEnv('JWT_REFRESH_TOKEN_SECRET'),
      );

      const decode = (
        (await jwt.decode(refresherToken)) as { payload: { id: string } }
      ).payload;

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

      return UtilsTokenAuth.jwtGenerate(findUser as any);
    } catch (err: any) {
      throw new Error(EStatusErrors.E404);
    }
  }
}

export const authService = new AuthService();
