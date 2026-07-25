import { ERoles } from '../enum/ERoles.enum';

export interface IUserEntity {
  id?: string;
  name: string;
  password: string;
  email: string;
  deleteUser: boolean;
  role: ERoles;
  user_id: string;
}
