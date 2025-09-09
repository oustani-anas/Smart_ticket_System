
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as GoogleTokenStrategy  from "passport-google-id-token";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CustomGoogleTokenStrategy extends PassportStrategy(GoogleTokenStrategy, 'google-token') {
    constructor( 
        private readonly authservice: AuthService,
        private readonly configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
        })
    }

    async validate(parsedToekn: any, googleId: string) {
        const { payload } = parsedToekn;
        console.log('google Id token payload: ', payload);

        const userProfile = {
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            avatar: payload.avatar
        };

        try {
            const user = await this.authservice.findOrCreateUser(userProfile);
            if (!user) {
                throw new UnauthorizedException('Could not process Google user.')
            }
            return user; 
        } catch(error) {
            throw new UnauthorizedException('Auth Failed.');
        }
    }
}
