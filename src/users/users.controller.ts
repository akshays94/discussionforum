import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService 
    ){}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAllUsers(): Promise<User[]> {
        return this.usersService.findAll()
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id') 
    getOneUser(@Param('id') userId: number): Promise<User> {
        return this.usersService.findOneUser(userId);
    }

}
