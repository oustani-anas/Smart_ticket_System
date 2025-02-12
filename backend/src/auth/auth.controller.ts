import { Body, Controller, Get, Post, Req, Res} from '@nestjs/common'; 
import { Response, Request } from 'express';
import { RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {

    constructor(private authservice: AuthService) {}


    @Get('/testt')
    async test(@Body() testt: string) {
        console.log(testt);
        return 'this is the first test'
    }

    @Post('/register')
    async Register(@Body() registerDto: RegisterDto) {
        console.log("inside the endpoint: ");
        this.authservice.register(registerDto);  
    }
}
