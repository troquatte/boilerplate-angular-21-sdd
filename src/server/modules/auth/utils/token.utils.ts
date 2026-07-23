import { sign } from 'jsonwebtoken';
import { getEnv } from '../../../utils/get-env.utils';

export class UtilsTokenAuth {
  public static jwtGenerate(userPayload: {
    id: string;
    name: string | null;
    email: string;
    password?: string;
  }) {
    const acessToken = sign(
      { email: userPayload.email },
      getEnv('JWT_SECRET'),
      { expiresIn: getEnv('JWT_EXPIRES_IN') as any }
    );

    const refreshToken = sign(
      { id: userPayload.id },
      getEnv('JWT_REFRESH_TOKEN_SECRET'),
      { expiresIn: '7d' }
    );

    return { acessToken, refreshToken };
  }
}
