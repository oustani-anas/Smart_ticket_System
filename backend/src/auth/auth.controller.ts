
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
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
}