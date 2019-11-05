import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './questions/questions.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersController } from './answers/answers.controller';
import { AnswersService } from './answers/answers.service';
import { AnswersModule } from './answers/answers.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/discussionforum'),
    QuestionsModule,
    AuthModule,
    UsersModule,
    AnswersModule
  ],
  controllers: [AppController, AnswersController],
  providers: [AppService, AnswersService],
})
export class AppModule {}
