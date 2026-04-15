import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserRequest } from './dto/createUserRequest.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user)
      throw new NotFoundException(`User with id: ${id} was not found.`);

    return user;
  }

  async createUser(dto: CreateUserRequest): Promise<User> {
    console.log('Creating user:', dto);
    const user = await this.prismaService.user.create({
      data: {
        login: dto.login.trim(),
        password: dto.password.trim(),
        role: dto.role ?? UserRole.VIEWER,
      },
    });
    console.log('Created user:', user); // and this
    return user;
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<boolean> {
    const user = await this.findById(id);

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
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
