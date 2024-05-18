import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

interface SignupParams {
  email: string;
  name: string;
  username: string;
  surname?: string;
  age?: number;
  description?: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

const generateJWT = (name: string, id: number) => {
  return jwt.sign({ id, name }, process.env.JSON_TOKEN_SECRET, {
    expiresIn: '14d',
  });
};

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(data: SignupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const token = generateJWT(user.name, user.id);

    return {
      status: 'success',
      token,
    };
  }

  async login(data: LoginParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = generateJWT(user.name, user.id);

    return {
      status: 'success',
      token,
    };
  }
}
