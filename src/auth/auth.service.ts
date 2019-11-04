import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/create-user.dto';
import { User } from '../users/user.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(newUser: CreateUserDto): Promise<User> {
        return await this.usersService.createNewUser(newUser);
    }    

    async login(userItem: { username: string, password: string }) {

        const user = await this.usersService.findIfUserExists(userItem)
        const payload = { username: user.username, sub: user._id };
        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
}
