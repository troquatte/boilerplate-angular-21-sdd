import { sign } from 'jsonwebtoken';
import { getEnv } from '../../../utils/get-env.utils';

export class UtilsTokenAuth {
  public static jwtGenerate(userPayload: {
    id: string;
    name: string | null;
    email: string;
    password?: string;
  }) {
    const payload = userPayload;
    delete payload.password;

    const acessToken = sign({ payload }, getEnv('JWT_SECRET'), {
      expiresIn: getEnv('JWT_EXPIRES_IN') as any,
    });

    const refreshToken = sign(
      { payload: { id: payload.id } },
      getEnv('JWT_REFRESH_TOKEN_SECRET'),
    );

    return { acessToken, refreshToken };
  }
}
