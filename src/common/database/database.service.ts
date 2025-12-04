import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private report: Pool;
  private odsProd: Pool;

  constructor() {
    this.report = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    this.odsProd = createPool({
      host: process.env.ODS_HOST,
      user: process.env.ODS_USER,
      password: process.env.ODS_PASSWORD,
      database: process.env.ODS_NAME,
      port: Number(process.env.ODS_PORT),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async queryOds(sql: string, params?: any[]): Promise<any> {
    const [rows] = await this.odsProd.query(sql, params);
    return rows;
  }

  async query(sql: string, param?: any[]): Promise<any[]> {
    try {
      const [rows] = await this.report.query(sql, param);
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      console.error('Database query error:', error);
      return error; // Re-throw for proper error handling upstream
    }
  }
}
