import { IsEmail, isNotEmpty, IsOptional, IsString,  } from "class-validator"

export class emailDto{
    @IsEmail()
    receiver: string;
    @IsString()
    subject: string;
    @IsString()
    text: string;
}