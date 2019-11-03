import { Injectable, HttpException, HttpStatus, NotFoundException, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>
    ){}
    
    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async findOneUser(userId): Promise<User> {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user) {
            throw new NotFoundException()
        }
        return user;
    }

    async findIfUserExists(
        userItem: { username: string, password: string }
    ): Promise<User> {
        
        const user = await this.userModel.findOne({ 
            username: userItem.username 
        });
        if (!user) {
            throw new UnauthorizedException('user not found');
        }

        if (!user.isValidPassword(userItem.password)) {
            throw new UnauthorizedException('password incorrect');
        }

        return user;
    }

    async createNewUser(newUser: CreateUserDto): Promise<User> {
        try {
            if (!newUser.password) {
                throw new UnprocessableEntityException('Password required');
            }
            const createdUser = new this.userModel(newUser);
            createdUser.setPassword(newUser.password);
            return await createdUser.save();
        } catch(err) {
            if (err.name === 'ValidationError') {
                const message = `User already exists`;
                throw new HttpException(message, HttpStatus.CONFLICT)
            }
        }
    }
}
