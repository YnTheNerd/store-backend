import { Body, Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { DeleteDto } from './dto/deleteDto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }
    @Get("all")
    getUsers(
        @Query('page') page: string,
        @Query('limit') limit: string
    ) {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        return this.userService.getUsers(pageNumber, limitNumber);
    }


    @Delete()
    deleteUser(@Body() deleteDto: DeleteDto) {
        return this.userService.deleteUsers(deleteDto)
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        const userId = parseInt(id);
        return this.userService.getUserById(userId);
    }


}
