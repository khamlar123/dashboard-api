import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ITest } from 'src/interfaces/test.interface';

@Injectable()
export class TestService {
  constructor(private readonly databaseService: DatabaseService) {}
  async findAll(): Promise<ITest[]> {
    const query = 'SELECT * FROM user';
    return this.databaseService.query(query);
  }

  async findOne(id: number): Promise<ITest> {
    const query = 'SELECT * FROM user WHERE id = ?';
    const [user] = await this.databaseService.query(query, [id]);
    return user;
  }
}
