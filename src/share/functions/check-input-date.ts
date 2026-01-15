import * as moment from 'moment';

export const checkInputDate = (date: string) => {
  const m = moment(date, 'YYYYMM');
  const convertDate = m.isSame(moment(), 'month')
    ? moment().subtract(1, 'day').format('YYYYMMDD') // today (20260114)
    : m.endOf('month').format('YYYYMMDD');
  return convertDate.toString();
};
