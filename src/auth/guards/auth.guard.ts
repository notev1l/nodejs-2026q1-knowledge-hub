import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    
    if (request.url.startsWith('/doc') || request.url === '/') {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const authorization = request.headers.authorization;
    const token = authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      })

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub }
      })

      request.user = payload

      return true
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}