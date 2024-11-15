import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    @Inject('TEST_SERVICE') private readonly clientKafka: ClientKafka,
  ) {}

  @Get('ping')
  ping(@Res() res: Response) {
    const statusCode = HttpStatus.OK;
    res.status(statusCode).json({ statusCode, message: 'OK' });
  }

  @Get('test/kafka')
  testKafka() {
    this.clientKafka.emit(
      'MyFirstTopic',
      JSON.stringify({ message: 'OK', timestamp: Date.now() }),
    );
  }
}
