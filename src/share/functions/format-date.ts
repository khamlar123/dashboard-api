import * as moment from 'moment';

export const formatDate = (array: any[]): any[] => {
  const formattedData = array.map((row: any) => {
    Object.keys(row).forEach((key) => {
      if (typeof Number(row?.Date) === 'number' && Number(row?.Date) > 40000) {
        // Likely a date, convert it
        row.Date = moment(row.Date, 'YYYYMMDD').format('YYYY-MM-DD');
      }
    });

    return row;
  });

  return formattedData;
};
