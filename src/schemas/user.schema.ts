import * as mongoose from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import * as crypto from 'crypto';

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, 'cannot be blank'],
        index: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, 'cannot be blank'],
        index: true,
        unique: true
    },
    bio: String,
    image: String,
    hash: String,
    salt: String
}, {
    timestamps: true // creates: createdAt and updatedAt
})

UserSchema.plugin(uniqueValidator, { message: 'is already taken' })


const ITERATIONS = 10000;
const KEYLEN = 512;
const DIGEST = 'sha512';

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
}

UserSchema.methods.isValidPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
    return this.hash === hash;
}