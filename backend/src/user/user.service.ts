
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        firstname: registerDto.firstname,
        lastname: registerDto.lastname,
        username: registerDto.username,
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserByEmailOrUsername(email: string, username: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });
  }
  
  
  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}