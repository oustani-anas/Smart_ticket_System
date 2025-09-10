
import { Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards,
  NotFoundException,
  Res,
  Req,
  HttpCode,
  HttpStatus } 
  from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { Response, Request } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  // for first API test
  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  async test(@Res() res) {
    console.log("tessssssst");
    res.send('inside test');
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('/validate')
  getDashboard() {
    console.log("test inside the validate endpoint");
    return { message: 'Welcome to the dashboard!' };
  }


  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
  const { token, user } = await this.authService.login(loginDto);

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  });


  return {
    message: "login success",
    user,
  };
}


  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    console.log("resgister DTO: " , registerDto);
    return this.authService.register(registerDto);
  }


  @Post('/google/token')
  @UseGuards(AuthGuard('google-token'))
  async googleAuthToken(@Req() req: Request) {
    const user = req.user;
    console.log('user = ', user)
    return this.authService.loginWithGoogle(user);
  }
  
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates the Google OAuth flow
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    console.log( "the user is logged with google oauth");
    const user = req.user;
    const jwt = await this.authService.loginWithGoogle(user);
    res.redirect(`http://localhost:3000?token=${jwt.token}`);
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logout successful' };
  }

  @Get('/refresh')
  @UseGuards(AuthGuard('jwt'))
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as any; // Type assertion to access Prisma User properties
    const payload = { 
      email: user.email, 
      sub: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    
    const newToken = this.authService.generateToken(payload);
    
    res.cookie('access_token', newToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });

    return { message: 'Token refreshed successfully' };
  }

  
  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string) {
    console.log("inside forgot password endpoint ");
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log("inside forgot password endpoint 1");

    // Generate a reset token
    const resetToken = this.authService.generateResetToken(user.id);

    // Save the token in the database
    await this.authService.saveResetToken(user.id, resetToken);

    // Send the reset email
    await this.authService.sendResetEmail(user.email, resetToken);

    return { message: 'Reset email sent' };
  }

  // Reset password endpoint
  @Post('/reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    // Validate the token
    const userId = await this.authService.validateResetToken(token);

    // Update the password
    await this.authService.updatePassword(userId, newPassword);

    return { message: 'Password reset successfully' };
  }

}