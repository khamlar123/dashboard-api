import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { checkCurrentDate } from '../../share/functions/check-current-date';
import { paidInterface } from '../../common/interfaces/paid.interface';

@Injectable()
export class PaidService {
  constructor(private readonly database: DatabaseService) {}

  // async paid(date: string, branch: string, option: string) {
  //   checkCurrentDate(date);
  //   const [result] = await this.database.queryOdsUat(
  //     `call P_AI_D_501_APB(?,?,?)`,
  //     [date, branch, option],
  //   );
  //
  //   return this.groupBy(result);
  // }
  //
  // private groupBy(data: paidInterface[]) {
  //   const customerDeposits: paidInterface[] = [];
  //   const bankAndFinancialInstitutionDeposits: paidInterface[] = [];
  //   const loanMoney: paidInterface[] = [];
  //   const interbankAccount: paidInterface[] = [];
  //   const otherDebts: paidInterface[] = [];
  //   const fullCapital: paidInterface[] = [];
  //
  //   data.forEach((e: paidInterface) => {
  //     if (e.G1 === '01') {
  //       customerDeposits.push(e);
  //     }
  //     if (e.G1 === '02') {
  //       bankAndFinancialInstitutionDeposits.push(e);
  //     }
  //
  //     if (e.G1 === '03') {
  //       loanMoney.push(e);
  //     }
  //
  //     if (e.G1 === '04') {
  //       interbankAccount.push(e);
  //     }
  //
  //     if (e.G1 === '05') {
  //       otherDebts.push(e);
  //     }
  //
  //     if (e.G1 === '06') {
  //       fullCapital.push(e);
  //     }
  //   });
  //
  //   function createSub(array: paidInterface[]) {
  //     const grouped = {};
  //     array.forEach((item) => {
  //       const groupKey = item.G2; // You can dynamically define this with item.G2, item.G, etc.
  //       if (!grouped[groupKey]) {
  //         grouped[groupKey] = [];
  //       }
  //       grouped[groupKey].push(item);
  //     });
  //
  //     return grouped;
  //   }
  //
  //   function checkSubGroup(data: paidInterface[]): boolean {
  //     const array = data.map((m) => m.G2);
  //     const removes = [...new Set(array)];
  //     return removes?.length > 1 ? true : false;
  //   }
  //
  //   const mainRes: any[] = [];
  //
  //   if (customerDeposits) {
  //     const itx = this.makHeader(customerDeposits, {
  //       category_name: 'ເງິນຝາກຂອງລູກຄ້າ',
  //       G: '1',
  //       G1: '01',
  //       G2: '0190',
  //     });
  //     mainRes.push(itx);
  //     customerDeposits.forEach((e) => {
  //       e.is_header = false;
  //       e.header_number = '';
  //       mainRes.push(e);
  //     });
  //   }
  //
  //   if (bankAndFinancialInstitutionDeposits) {
  //     const itx = this.makHeader(bankAndFinancialInstitutionDeposits, {
  //       category_name: 'ເງິນຝາກຂອງທະນາຄານ ແລະ ສະຖາບັນການເງິນ',
  //       G: '1',
  //       G1: '02',
  //       G2: '0290',
  //     });
  //     mainRes.push(itx);
  //     bankAndFinancialInstitutionDeposits.forEach((e) => {
  //       e.is_header = false;
  //       e.header_number = '';
  //       mainRes.push(e);
  //     });
  //   }
  //
  //   if (checkSubGroup(loanMoney)) {
  //     const group1 = this.makSubHeader(createSub(loanMoney)['0310'], {
  //       category_name: '1. ທະນາຄານທຸລະກິດ ແລະ ສະຖາບັນການເງິນ',
  //       G: '1',
  //       G1: '03',
  //       G2: '0310',
  //     });
  //
  //     const group2 = this.makSubHeader(createSub(loanMoney)['0320'], {
  //       category_name: '2. ແຫຼ່ງທຶນອື່ນ',
  //       G: '1',
  //       G1: '03',
  //       G2: '0320',
  //     });
  //
  //     const mainHeader = {
  //       category_code: '',
  //       category_name: 'ເງິນກູ້ຢືມມາ',
  //       LAK: group1?.LAK + group2?.LAK,
  //       USD: group1?.USD + group2?.USD,
  //       THB: group1?.THB + group2?.THB,
  //       CNY: group1?.CNY + group2?.CNY,
  //       EUR: group1?.EUR + group2?.EUR,
  //       VND: group1?.VND + group2?.VND,
  //       FBAL: group1?.FConvert_to_LAK + group2?.FConvert_to_LAK,
  //       'Convert to LAK': group1?.FConvert_to_LAK + group2?.FConvert_to_LAK,
  //       G: '1',
  //       G1: '03',
  //       G2: '0390',
  //       is_header: true,
  //       header_number: 'III',
  //     };
  //
  //     mainRes.push(mainHeader);
  //     mainRes.push(group1);
  //     createSub(loanMoney)['0310'].forEach((e) => {
  //       e.is_header = false;
  //       e.header_number = '';
  //       mainRes.push(e);
  //     });
  //     mainRes.push(group2);
  //     createSub(loanMoney)['0320'].forEach((e) => {
  //       e.is_header = false;
  //       e.header_number = '';
  //       mainRes.push(e);
  //     });
  //   } else {
  //     const itx = this.makHeader(loanMoney, {
  //       category_name: 'ເງິນກູ້ຢືມມາ',
  //       G: '1',
  //       G1: '03',
  //       G2: '0390',
  //     });
  //     mainRes.push(itx);
  //     loanMoney.forEach((e) => {
  //       e.is_header = false;
  //       e.header_number = '';
  //       mainRes.push(e);
  //     });
  //   }
  //
  //   if (interbankAccount) {
  //     const itx = this.makHeader(interbankAccount, {
  //       category_name: 'ບັນຊີລະຫວ່າງທະນາຄານ',
  //       G: '1',
  //       G1: '04',
  //       G2: '0490',
  //     });
  //     mainRes.push(itx);
  //     interbankAccount.forEach((e) => {
  //       e.is_header = false;
  //       e.header_number = '';
  //       mainRes.push(e);
  //     });
  //   }
  //
  //   if (otherDebts) {
  //     const itx = this.makHeader(otherDebts, {
  //       category_name: 'ໜີ້ສິນອື່ນໆ',
  //       G: '1',
  //       G1: '05',
  //       G2: '0590',
  //     });
  //     mainRes.push(itx);
  //     otherDebts.forEach((e) => {
  //       e.is_header = false;
  //       e.header_number = '';
  //       mainRes.push(e);
  //     });
  //
  //     const mergeAllGroup1 = customerDeposits.concat(
  //       bankAndFinancialInstitutionDeposits,
  //       loanMoney,
  //       interbankAccount,
  //       otherDebts,
  //     );
  //
  //     const sub = this.makSubHeader(mergeAllGroup1, {
  //       category_name: 'ລວມໜີ້ສິນທັງໜົດ',
  //       G: '1',
  //       G1: '05',
  //       G2: '0590',
  //     });
  //
  //     mainRes.push(sub);
  //   }
  //
  //   if (fullCapital) {
  //     const itx = this.makHeader(fullCapital, {
  //       category_name: 'ທຶນທັງໜົດ',
  //       G: '2',
  //       G1: '06',
  //       G2: '0690',
  //     });
  //     mainRes.push(itx);
  //     fullCapital.forEach((e) => {
  //       e.is_header = false;
  //       e.header_number = '';
  //       mainRes.push(e);
  //     });
  //
  //     const mergeAllGroup = customerDeposits.concat(
  //       bankAndFinancialInstitutionDeposits,
  //       loanMoney,
  //       interbankAccount,
  //       otherDebts,
  //       fullCapital,
  //     );
  //
  //     const sub = this.makHeader(mergeAllGroup, {
  //       category_name: 'ລວມໜີ້ສິນ ແລະ ທຶນທັງໜົດ',
  //       G: '2',
  //       G1: '07',
  //       G2: '0590',
  //     });
  //
  //     mainRes.push(sub);
  //   }
  //
  //   return mainRes;
  // }
  //
  // private makHeader(
  //   array: paidInterface[],
  //   object: {
  //     category_name: string;
  //     G: string;
  //     G1: string;
  //     G2: string;
  //   },
  // ): any {
  //   const sumFields = [
  //     'LAK',
  //     'USD',
  //     'THB',
  //     'CNY',
  //     'EUR',
  //     'VND',
  //     'FConvert_to_LAK',
  //     'Convert_to_LAK',
  //   ];
  //
  //   const result = {
  //     category_code: '',
  //     category_name: object.category_name,
  //     G: object.G,
  //     G1: object.G1,
  //     G2: object.G2,
  //     is_header: true,
  //     header_number:
  //       object.G1 === '01'
  //         ? 'I'
  //         : object.G1 === '02'
  //           ? 'II'
  //           : object.G1 === '03'
  //             ? 'III'
  //             : object.G1 === '04'
  //               ? 'IV'
  //               : object.G1 === '05'
  //                 ? 'V'
  //                 : object.G1 === '06'
  //                   ? 'VI'
  //                   : 'L',
  //   };
  //
  //   for (const field of sumFields) {
  //     result[field] = array.reduce(
  //       (sum, item) => sum + parseFloat(item[field] || '0'),
  //       0,
  //     );
  //   }
  //
  //   return result;
  // }
  //
  // private makSubHeader(
  //   array: paidInterface[],
  //   object: {
  //     category_name: string;
  //     G: string;
  //     G1: string;
  //     G2: string;
  //   },
  // ): any {
  //   const sumFields = [
  //     'LAK',
  //     'USD',
  //     'THB',
  //     'CNY',
  //     'EUR',
  //     'VND',
  //     'FConvert_to_LAK',
  //     'Convert_to_LAK',
  //   ];
  //
  //   const result = {
  //     category_code: '',
  //     category_name: object.category_name,
  //     is_header: false,
  //     header_number: '',
  //   };
  //
  //   for (const field of sumFields) {
  //     result[field] = array.reduce(
  //       (sum, item) => sum + parseFloat(item[field] || '0'),
  //       0,
  //     );
  //   }
  //
  //   return result;
  // }
}
