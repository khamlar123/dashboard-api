export const loanCcy = () => `
  with par as (select ? as vdate from dual)

  select a.AC_DATE,
         a.ccy,
         nvl(sum(a.CDDBAL) * (-1), 0)                           as CDDBAL,
         nvl(sum(a.CDCBAL), 0)                           as CDCBAL,
         F_EXCH_LAK_BY_ACDT(A.ccy, nvl(sum(a.CDDBAL) * (-1), 0),
                            'SMR', 'FX_BUY', (select vdate from par) ) as BAL_LAK
  from AITHMST a
  where a.ac_date  = (select vdate from par)
    and length(a.ITM_NO) = '10'
    AND SUBSTR(a.ITM_NO, 1, 2) in ('12')
    and SUBSTR(a.ITM_NO, 1, 4) <> '1299'
    and SUBSTR(a.ITM_NO, 1, 4) not in ('1297', '1289')
    and SUBSTR(a.ITM_NO, 5, 1) <> '7'
  group by a.AC_DATE, a.ccy;
`;
