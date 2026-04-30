import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SafeUser, safeUserSelect } from '../shared/types/safeUser.type';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { hash, compare } from 'bcrypt';
 
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async authenticate(sub: string, login: string, role: UserRole): Promise<object> {
    const payload = { sub, login, role }

    const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '15m',
      })

    const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: '1d',
      })

    await this.prismaService.user.update({
      where: { id: sub },
      data: {
        refreshToken,
      }
    })

    return { accessToken, refreshToken };
  }

  async validateUser(login: string, password: string): Promise<SafeUser> {
    const user = await this.prismaService.user.findFirst({
      where: { login: login.trim() }
    })

    const isMatch = await compare(password.trim(), user.password);

    if (!user || !isMatch) throw new ForbiddenException();

    return user
  }

  async signUp(login: string, password: string): Promise<SafeUser> {
    const user = await this.prismaService.user.findFirst({
      where: { login: login.trim() },
    });

    if (user) {
      throw new BadRequestException();
    }

    const hashedPassword = await hash(password, 10)
    const newUser = await this.prismaService.user.create({
      data: {
        login: login,
        password: hashedPassword,
      },
      select: safeUserSelect,
    })

    return newUser;
  }

  async logIn(login: string, password: string): Promise<any> {
    const user = await this.validateUser(login, password)

    return this.authenticate(user.id, user.login, user.role)
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new NotFoundException(`No refresh token in body`)
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      })

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub }
      })

      return this.authenticate(user.id, user.login, user.role)
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
