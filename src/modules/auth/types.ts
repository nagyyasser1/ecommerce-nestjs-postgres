import { User } from '../users/entities/user.entity';

type UserWithoutPassword = Omit<User, 'password'>;

type LoginMethodReturnType = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

type RefreshTokenMethodReturnType = {
  accessToken: string;
};

export {
  UserWithoutPassword,
  LoginMethodReturnType,
  RefreshTokenMethodReturnType,
};
