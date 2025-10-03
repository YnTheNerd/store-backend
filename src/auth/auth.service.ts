import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/SignupDto';
import { MailerService } from 'src/mailer/mailer.service';
import { ActivationDto } from './dto/activationDto';
import { SigninDto } from './dto/signinDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async signup(signupDto: SignupDto) {
    const { email, password, username, address} = signupDto;

    try {

      const otp = await this.mailService.sendSignupEmail(email);

      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (user) {
        throw new ConflictException('User already exists');
      }

      const hash = await bcrypt.hash(password, 10);
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      await this.prismaService.user.create({
        data: { username, email, password: hash, address, isActive:false, otpCode: otp, otpExpiresAt: expiresAt },
      });



      return { message: 'User successfully created', otp: otp };
    } catch (error) {
      console.error(' Error during signup:', error);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Something went wrong during signup');
    }
  }
  //activation de compte utilisateur

  async activation(activationDto: ActivationDto) {
    const { email, code } = activationDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (user.isActive) {
      throw new BadRequestException('Compte déjà activé');
    }

    if (user.otpCode !== code) {
      throw new BadRequestException('Code OTP invalide');
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new BadRequestException('Code OTP expiré');
    }
    await this.prismaService.user.update({
      where: { email },
      data: {
        isActive: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    return { message: 'Compte activé avec succès ' };
  }

  //connexion avec jwt
  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
  
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
  
    if (!user.isActive) {
      throw new ConflictException('Compte non activé');
    }
  
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }
  
    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role, 
    };
  
    let token: string;
  
    if (user.role === 'superadmin' || user.email === 'francoiseleslie05@gmail.com') {
      token = this.jwtService.sign(payload, {
        secret: this.configService.get('SECRET_KEY'),
      });
    } else {
      token = this.jwtService.sign(payload, {
        expiresIn: '24h',
        secret: this.configService.get('SECRET_KEY'),
      });
    }
  
    return {
      token,
      user: {
        userId:user.userId,
        username: user.username,
        useremail: user.email,
        role: user.role,
      },
    };
  }
  

}

