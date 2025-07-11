export const liquidityExchange = () => `
  with par as (select ? as vdate from dual),

       exchange_data as (select '2382'                        as category_code,
                                case
                                  when substr(hmst.ITM_NO, 1, 7) in ('2382120') then 'ຍອດເງິນແລກປ່ຽນ'
                                  end                            category_name,
                                hmst.ccy                      as ccy,
                                hmst.br                       as br,
                                (-1) * ifnull(hmst.cddbal, 0) as cddbal,
                                (1) * ifnull(hmst.cdcbal, 0)  as cdcbal,
                                case
                                  when hmst.ccy = 'LAK' then
                                    (-1) * (((1) * ifnull(hmst.cdcbal, 0)) - ((-1) * ifnull(hmst.cddbal, 0)))
                                  else
                                    ((1) * ifnull(hmst.cdcbal, 0)) - ((-1) * ifnull(hmst.cddbal, 0))
                                  end                         as bal,
                                hmst.itm_no
                         from ods.AITHMST hmst
                         where length(hmst.itm_no) = 10
                           and substr(hmst.ITM_NO, 1, 7) in ('2382120')
                           and hmst.AC_DATE = (select vdate from par)),

       exch
         as (select (select vdate from par) as date, concat(substr(BR, 1, 4), '00') as br, category_name, ccy, nvl(sum (bal), 0) as bal
  from exchange_data
  group by concat(substr(BR, 1, 4), '00'), ccy
    )

  select *
  from exch;
`;
