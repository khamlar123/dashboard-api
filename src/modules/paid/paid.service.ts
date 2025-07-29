import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';

@Injectable()
export class PaidService {
  constructor(private readonly database: DatabaseService) {}

  async paid(date: string, branch: string, option: string) {
    checkCurrentDate(date);
    const [result] = await this.database.queryOdsUat(
      `call P_AI_D_501_APB(?,?,?)`,
      [date, branch, option],
    );

    return result;
  }
}
