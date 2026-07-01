/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AppService, type Home } from './app.service';
import { timeStamp } from 'node:console';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHome(): Home {
    return this.appService.getHome();
  }
  @Get('health')
  getHealth() {
    return {
      success: true,
      message: "Api is running properly",
      status: "Up",
      timeStamp: new Date().toISOString()
    }
  }
}
