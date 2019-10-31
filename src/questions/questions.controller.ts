import { Controller, Get, Req, Post, HttpCode, Param, Query, Body } from '@nestjs/common';
import { Request } from 'express';

let QUESTIONS = [];

@Controller('questions')
export class QuestionsController {
  
  @Get()
  findAll(@Req() request: Request): object {
    return QUESTIONS;
  }

  @Post()
  create(@Body() body): object {
    let { title, content } = body;
    QUESTIONS.push({
      id: QUESTIONS.length + 1,
      title,
      content
    });
    return QUESTIONS;
  }

  @Get(':id')
  findOne(@Param() params): object {
    let { id } = params;
    for (let index = 0; index < QUESTIONS.length; index++) {
      const question = QUESTIONS[index];
      if (question.id === parseInt(id)) {
        return question
      }
    }
    return {};
  }

}
