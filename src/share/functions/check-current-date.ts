import * as moment from 'moment';
import { BadRequestException } from '@nestjs/common';

export const checkCurrentDate = (date: string) => {
  const input = moment(date, 'YYYYMMDD');
  const current = moment().format('YYYYMMDD');
  const checkDate = input.isSameOrBefore(current, 'day');
  if (!checkDate) {
    throw new BadRequestException('Date is greater than current');
  }
};
