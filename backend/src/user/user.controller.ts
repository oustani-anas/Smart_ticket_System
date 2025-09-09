
import { Controller, UseGuards, Get, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';


UseGuards(AuthGuard('jwt'))
@Controller('/user')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('/profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req) {
        console.log("req user service: ", req.user.id);
        return this.userService.getProfile(req.user.id);
    }    
}
