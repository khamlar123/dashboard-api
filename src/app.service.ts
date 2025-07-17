import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { DatabaseService } from './common/database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly database: DatabaseService) {}

  getHello(): string {
    return 'Hello welcome to dashboard API version 0.1!';
  }

  async test(): Promise<any> {
    const data = await this.database.query('SELECT * FROM test', []);
    return [data];
  }
}
