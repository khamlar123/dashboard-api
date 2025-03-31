// src/database/database.service.ts
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async query(query: string, parameters?: any[]): Promise<any> {
    return this.connection.query(query, parameters);
  }

  async execute(query: string, parameters?: any[]): Promise<any> {
    return this.connection.query(query, parameters);
  }
}
