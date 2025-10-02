import { ApiProperty } from "@nestjs/swagger"
import {IsNotEmpty, IsEmail} from "class-validator"
export class DeleteDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string
   
}