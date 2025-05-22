// src/database/database.service.ts
import { Injectable } from '@nestjs/common';
// import { InjectConnection } from '@nestjs/typeorm';
// import { Connection } from 'typeorm';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  // constructor(@InjectConnection() private readonly connection: Connection) {}

  // async query(query: string, parameters?: any[]): Promise<any> {
  //   return this.connection.query(query, parameters);
  // }

  // async execute(query: string, parameters?: any[]): Promise<any> {
  //   return this.connection.query(query, parameters);
  // }

  private odsPool: Pool;
  private dashboardPool: Pool;

  constructor() {
    this.dashboardPool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    this.odsPool = createPool({
      host: process.env.ODS_HOST,
      user: process.env.ODS_USER,
      password: process.env.ODS_PASSWORD,
      database: process.env.ODS_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async queryOds(sql: string, params?: any[]): Promise<any> {
    const [rows] = await this.odsPool.query(sql, params);
    return rows;
  }

  async procedure(procedureName: string, params: string): Promise<any> {
    const sql = `CALL dashboard.${procedureName}(?)`;
    const [results] = await this.dashboardPool.query(sql, [params]);
    return results;
  }

  async getProfit(sql: string, param: any[]): Promise<any> {
    return await this.dashboardPool.query(sql, param);
  }

  async import(sql: string, param: any[]): Promise<any> {
    return await this.dashboardPool.query(sql, param);
  }

  async query(sql: string, param?: any[]): Promise<any> {
    return await this.dashboardPool.query(sql, param);
  }
}
