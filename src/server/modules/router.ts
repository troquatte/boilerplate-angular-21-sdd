import { authRouter } from './auth/router';
import { resetPasswordRouter } from './reset-password/router';
import { userRouter } from './user/router';

export const router = [authRouter, resetPasswordRouter, userRouter];
