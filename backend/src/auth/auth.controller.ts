
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';


@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Get('/test')
  // @UseGuards(AuthGuard('jwt'))
  async test(@Res() res) {
    console.log("tessssssst");
    res.send('inside test');
  }
  
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    console.log("inside the login endpoint")
    return this.authService.login(loginDto);
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
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
    res.redirect(`http://localhost:3000?token=${jwt.access_token}`);
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async Logout(@Req() req, @Res() res) {
    res.clearCookie('jwt');
    return res.status(200).json({ message: 'Logout successful' });
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