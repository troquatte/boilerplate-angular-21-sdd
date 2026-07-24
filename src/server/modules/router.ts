import { authRouter } from './auth/router';
import { userRouter } from './user/router';
import { customerRouter } from './customer/router';
import { customerAddressRouter } from './customer-address/router';

export const router = [authRouter, userRouter, customerRouter, customerAddressRouter];
