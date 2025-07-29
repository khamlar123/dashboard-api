import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import { paidInterface } from '../../common/interfaces/paid.interface';

@Injectable()
export class PaidService {
  constructor(private readonly database: DatabaseService) {}

  async paid(date: string, branch: string, option: string) {
    checkCurrentDate(date);
    const [result] = await this.database.queryOdsUat(
      `call P_AI_D_501_APB(?,?,?)`,
      [date, branch, option],
    );

    const groupData = this.groupBy(result);

    return groupData;
  }

  private groupBy(data: paidInterface[]) {
    const customerDeposits: paidInterface[] = [];
    const bankAndFinancialInstitutionDeposits: paidInterface[] = [];
    const loanMoney: paidInterface[] = [];
    const interbankAccount: paidInterface[] = [];
    const otherDebts: paidInterface[] = [];
    const fullCapital: paidInterface[] = [];

    data.forEach((e: paidInterface) => {
      if (e.G1 === '01') {
        customerDeposits.push(e);
      }
      if (e.G1 === '02') {
        bankAndFinancialInstitutionDeposits.push(e);
      }

      if (e.G1 === '03') {
        loanMoney.push(e);
      }

      if (e.G1 === '04') {
        interbankAccount.push(e);
      }

      if (e.G1 === '05') {
        otherDebts.push(e);
      }

      if (e.G1 === '06') {
        fullCapital.push(e);
      }
    });

    return {
      customerDeposits,
      bankAndFinancialInstitutionDeposits,
      loanMoney,
      interbankAccount,
      otherDebts,
      fullCapital,
    };
  }
}
