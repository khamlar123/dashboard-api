import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello welcome to dashboard API version 0.1!';
  }
}
