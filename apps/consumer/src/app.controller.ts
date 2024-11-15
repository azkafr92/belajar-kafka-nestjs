import { Controller, Get, HttpStatus, Logger, Res } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { Response } from 'express';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Get('ping')
  ping(@Res() res: Response) {
    const statusCode = HttpStatus.OK;
    res.status(statusCode).json({ statusCode, message: 'OK' });
  }

  @EventPattern('MyFirstTopic', Transport.KAFKA)
  onMyFirstTopic(@Payload() data: { message: string; timestamp: number }) {
    this.logger.log(JSON.stringify(data));
  }
}
