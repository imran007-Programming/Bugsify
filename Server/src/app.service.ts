import { Injectable } from '@nestjs/common';

export interface Home {
  success: boolean;
  message: string;
}

@Injectable()
export class AppService {
  getHome(): Home {
    return {
      success: true,
      message: 'wellcome to bugsify api',
    };
  }
}
