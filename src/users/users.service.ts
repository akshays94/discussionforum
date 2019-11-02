import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
    private readonly users: User[];
    constructor() {
        this.users = [
            {
                id: 100,
                username: 'akshay_s',
                password: 'Welcome@123'
            }, {
                id: 101,
                username: 'esha_a',
                password: 'Welcome@123'
            }, {
                id: 102,
                username: 'beena_s',
                password: 'Welcome@123'
            }
        ]
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
