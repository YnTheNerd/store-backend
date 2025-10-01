import {Controller, Post,Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/SignupDto';
import { ActivationDto } from './dto/activationDto';
import { SigninDto } from './dto/signinDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}
    @Post("signup")
    signup(@Body() signupDto: SignupDto){
        return this.authService.signup(signupDto)
    }

    @Post("activation")
    activation(@Body() activationDto: ActivationDto){
        return this.authService.activation(activationDto)
    }

    @Post("signin")
    signin(@Body() signinDto: SigninDto){
        return this.authService.signin(signinDto)
    }

}