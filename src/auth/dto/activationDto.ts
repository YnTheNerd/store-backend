
import { ApiProperty } from "@nestjs/swagger"
import {IsNotEmpty, IsEmail} from "class-validator"
export class ActivationDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string
    @ApiProperty()
    @IsNotEmpty()
    readonly code: string
}