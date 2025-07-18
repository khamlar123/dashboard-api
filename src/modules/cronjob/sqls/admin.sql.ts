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
                    '1442700',
                    '4201100',
                    '4201200',
                    '4201400',
                    '4202100',
                    '4202800',
                    '4203100',
                    '4203200',
                    '4300000',
                    '4402000',
                    '4403120',
                    '4403200',
                    '4405100',
                    '4405200',
                    '4405300',
                    '4406100',
                    '4406200',
                    '4406300',
                    '4407100',
                    '4407200',
                    '4408100',
                    '4408200',
                    '4408300',
                    '4408400',
                    '4408500',
                    '4408600',
                    '4408710',
                    '4408720',
                    '4408730',
                    '4408800'
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
           when b.buy > 0 then round(nvl(a.CDDBAL, 0) * nvl(b.buy, 0), 2)
           else nvl(a.CDDBAL, 0) * (1) end cddlak,
         CDCBAL,
         case
           when b.buy > 0 then round(nvl(a.CDCBAL, 0) * nvl(b.buy, 0), 2)
           else nvl(a.CDCBAL, 0) * (1) end cdclak
  from admin_all a
         left outer join rates b on a.AC_DATE = b.eff_dt
    and a.CCY = b.ccy
  where (a.CDCBAL <> 0 or a.cddbal <> 0);

`;
