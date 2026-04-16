import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserRequest } from './dto/createUserRequest.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { User, UserRole, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type SafeUser = Omit<User, 'password'>;

const safeUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  login: true,
  role: true,
  createdAt: true,
  updatedAt: true,
});

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<SafeUser[]> {
    return await this.prismaService.user.findMany({
      select: safeUserSelect,
    });
  }

  async findById(id: string): Promise<SafeUser> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });

    if (!user)
      throw new NotFoundException(`User with id: ${id} was not found.`);

    return user;
  }

  async createUser(dto: CreateUserRequest): Promise<SafeUser> {
    const user = await this.prismaService.user.create({
      data: {
        login: dto.login.trim(),
        password: dto.password.trim(),
        role: dto.role ?? UserRole.VIEWER,
      },
      select: safeUserSelect,
    });
    return user;
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: dto.newPassword,
      },
    });

    return true;
  }

  async deleteUser(id: string): Promise<void> {
    await this.findById(id);

    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
