
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService
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
    const payload = { 
      email: user.email, 
      sub: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    
    return {
      token: this.jwtService.sign(payload),
      user: {
        email: user.email, 
        sub: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      }
    };
  }

  async loginWithGoogle(user: any) {
    console.log("=== loginWithGoogle ===");
    console.log("User for JWT:", user);
    
    const payload = { email: user.email, sub: user.id };
    console.log("JWT payload:", payload);
    
    const token = this.jwtService.sign(payload);
    console.log("JWT token generated");
    
    return {
      token: token,
    };
  }

  async register(registerDto: RegisterDto) {
    
    // const {email, username} = registerDto;
    const {email } = registerDto;
    const existingUser = await this.userService.findUserByEmailOrUsername(email, "");
    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }
    
    const user = await this.userService.createUser(registerDto);
    return { 
      "message": "Registration successful, please login to continue" 
    };
  }

  async findOrCreateUser(user: {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
  }) {
    console.log("=== findOrCreateUser ===");
    console.log("User data:", user);
    
    try {
      // Check if the user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        console.log("Existing user found:", existingUser);
        return existingUser;
      }

      console.log("Creating new user...");
      // If the user doesn't exist, create a new one
      const newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          firstname: user.firstName,
          lastname: user.lastName,
          avatar: user.avatar,
          // firstlogin: true, // Set firstlogin to true for new users
        },
      });

      console.log("New user created:", newUser);
      return newUser;
    } catch (error) {
      console.error("Error in findOrCreateUser:", error);
      throw error;
    }
  }

  generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  generateResetToken(userId: string) {
    return this.jwtService.sign({ userId });
  }

  // Save the reset token in the database
  async saveResetToken(userId: string, token: string) {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Token expires in 1 hour

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });
  }

  // Send reset email
  async sendResetEmail(email: string, token: string) {
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

    const gmailUser = this.configService.get<string>('GMAIL');
    const gmailPass = this.configService.get<string>('PASSWORD');

    // Fallback: if mail creds are not configured in dev, log the link and do not throw
    if (!gmailUser || !gmailPass) {
      // eslint-disable-next-line no-console
      console.warn('[ForgotPassword] Missing GMAIL/PASSWORD env vars. Reset link:', resetLink);
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      await transporter.sendMail({
        from: gmailUser,
        to: email,
        subject: 'Password Reset',
        text: `Click the link to reset your password: ${resetLink}`,
        html: `<p>Click the link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[ForgotPassword] Email sending failed:', error);
      // Do not leak provider errors to client; surface a generic error
      throw new BadRequestException('Email service is currently unavailable. Please try again later.');
    }
  }

  // Validate the reset token
  async validateResetToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || user.resetToken !== token || user.resetTokenExpiry < new Date()) {
        throw new BadRequestException('Invalid or expired token');
      }

      return user.id;
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  // Update the user's password
  async updatePassword(userId: string, newPassword: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword, // Make sure to hash this password before saving
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

}