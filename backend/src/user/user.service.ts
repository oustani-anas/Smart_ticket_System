
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async createUser(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      return this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          firstname: registerDto.firstname,
          lastname: registerDto.lastname,
          // username: registerDto.username,
        },
      });
    } catch(error) {
      throw new BadRequestException('Invalid Registration Data');
    }
  }

  async findUserByEmail(email: string) {
    const user = this.prisma.user.findUnique({ where: { email } });
    if(!user)
      throw new NotFoundException('User not Found')
    return user
  }

  async findUserByEmailOrUsername(email: string, username: string) {
    const user = this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if(!user)
      throw new NotFoundException('User not Found');

    return user;
  }
  
  
  async validateUser(email: string, password: string) {
    if(!email || !password)
      throw new BadRequestException('Unexpected fields in request body');
    console.log('email: ', email);
    console.log('password: ', password);
    const user = await this.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  // Get user by ID
  async findOneById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // Update user role
  async updateRole(id: string, role: string) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  // Delete user
  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  // Ban / Unban user
  async updateBanStatus(id: string, isBanned: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isBanned },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstname: true,
        lastname: true,
        email: true,
        avatar: true,
        tickets: {
          select: {
            id: true,
            event: {
              select: {
                name: true,
                location: true,
              },
            },
          },
        },
      },
    });

    return {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      avatar: user.avatar,
      tickets: user.tickets.map((ticket) => ({
        id: ticket.id,
        event: {
          name: ticket.event.name,
          date: ticket.event.location,
        },
      })),
    };
  }
    


}