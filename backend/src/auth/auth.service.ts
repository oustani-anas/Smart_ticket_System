import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

    async register(authDto: RegisterDto) {
        const {firstname, lastname, email} = authDto;
        console.log("firstname = ", firstname)
        console.log("lastname = ", lastname)
        console.log("email = ", email)
    }
}
