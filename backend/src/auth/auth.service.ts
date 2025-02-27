
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginWithGoogle(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    
    const {email, username} = registerDto;
    const existingUser = await this.userService.findUserByEmailOrUsername(email, username);
    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }
    
    const user = await this.userService.createUser(registerDto);
    return user;
  }

  async findOrCreateUser(user: {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
  }) {
    // Check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return existingUser;
    }

    // If the user doesn't exist, create a new one
    const newUser = await this.prisma.user.create({
      data: {
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        avatar: user.avatar,
        firstlogin: true, // Set firstlogin to true for new users
        role: 'user', // Default role
      },
    });

    return newUser;
  }

}