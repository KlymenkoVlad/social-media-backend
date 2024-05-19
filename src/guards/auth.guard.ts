import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { UserPayload } from 'src/interfaces/user.interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split('Bearer ')[1];

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = (await jwt.verify(
        token,
        process.env.JSON_TOKEN_SECRET,
      )) as UserPayload;

      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) throw new UnauthorizedException('User not found');
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
