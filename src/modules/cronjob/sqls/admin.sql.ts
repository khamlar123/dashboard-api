export const admin = () => `
  with par as (select ? as vdate from dual),

       rates as (select eff_dt, ccy, buy from r_bpttqph where exr_typ = 'SMR' and eff_dt = (select vdate from par)),

       admin as (select ac_date,
                        concat(substr(br, 1, 4), '00')                                                    as br,
                        itm_no,
                        ccy,
                        case when nvl(cddbal, 0) < 0 then (nvl(cddbal, 0) * (-1)) else nvl(cddbal, 0) end as cddbal,
                        cdcbal
                 from AITHMST
                 where AC_DATE = (select vdate from par)
                   and length(itm_no) = '10'
                   and (
                   substr(itm_no, 1, 7) in
                   (
                    '1441300',
                    '1441810',
                    '1442200',
                    '1442400',
                    '1442500',
                    '1442600',
                    '1442700'
                     )
                   )),

       admin_all as (select ac_date,
                            br,
                            itm_no,
                            ccy,
                            cddbal,
                            cdcbal
                     from admin
                     group by ac_date, br, itm_no, ccy, cddbal, cdcbal)

  select a.AC_DATE,
         a.br,
         a.ITM_NO,
         a.ccy,
         a.cddbal,
         case
           when b.buy > 0 then round(nvl(a.CDDBAL, 0 ) * nvl(b.buy, 0), 2)
           else nvl(a.CDDBAL, 0) * (1) end cddlak,
         CDCBAL,
         case
           when b.buy > 0 then round(nvl(a.CDCBAL, 0) * nvl(b.buy, 0), 2)
           else nvl(a.CDCBAL, 0 )* (1) end cdclak
  from admin_all a
         left outer join rates b on a.AC_DATE=b.eff_dt
    and a.CCY=b.ccy
  where (a.CDCBAL <> 0 or a.cddbal <> 0);

`;
