import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'
import { emailDto } from 'src/auth/dto/emailDto';
@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  private emailTransport() {
    return nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

 
  private generateOtp(): string {
    const randomInteger = Math.floor(Math.random() * 1000000); 
    const code = randomInteger.toString().padStart(6, '0');    
    return code;
 }


  async sendSignupEmail(useremail: string) {
    const otp = this.generateOtp(); 

    const transport = this.emailTransport();
    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: useremail,
      subject: 'Confirme ton email',
      text: `Merci de t'être inscrit ! Voici ton code de confirmation : ${otp}`,
    };

    try {
      await transport.sendMail(options);
      return otp; 
    } catch (error) {
      console.log('Erreur en envoyant l’email :', error);
      throw error;
    }
  }
}
