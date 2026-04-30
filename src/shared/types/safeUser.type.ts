/* eslint-disable prettier/prettier */
import { User, Prisma } from '@prisma/client';

export type SafeUser = Omit<User, 'password' | 'refreshToken'>;

export const safeUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  login: true,
  role: true,
  createdAt: true,
  updatedAt: true,
});