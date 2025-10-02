import { Body, Controller, Delete, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { DeleteDto } from './dto/deleteDto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }
    @Get("all")
    getUsers() {
        return this.userService.getUsers()
    }

    @Delete("all")
    deleteUser(@Body() deleteDto: DeleteDto) {
        return this.userService.deleteUsers(deleteDto)
    }

}
