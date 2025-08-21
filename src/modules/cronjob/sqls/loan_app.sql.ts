export const loadApp = () => `
with par as (select ? as vdate, ? as tdate from dual),

     brn as (select distinct substr(branch_code, 1, 4) as branch_code from rpt_branch),

     rates as (select eff_dt, ccy, buy from r_bpttqph where exr_typ = 'SMR'
                      and eff_dt  between (select vdate from par) and (select tdate from par) ),

     approve as (select a.AC_DATE,substr(a.br, 1, 4) as                                     br,
                        a.ccy,
                        case when a.SIGN = 'D' then sum(nvl(a.amt, 0)) else 0 end debit,
                        case when a.SIGN = 'C' then sum(nvl(a.amt, 0)) else 0 end credit,
                        case
                            when SIGN = 'D' then
                                case
                                    when r.buy > 0 then round(nvl(sum(a.amt), 0) * nvl(r.buy, 0),2)
                                    else round(nvl(sum(a.amt), 0) * (1),2) end end       DBBALLAK,

                        case
                            when SIGN = 'C' then
                                case
                                    when r.buy > 0 then round(nvl(sum(a.amt), 0) * nvl(r.buy, 0),2)
                                    else round(nvl(sum(a.amt), 0) * (1),2) end end       CRBALLAK
                 from BPTVCHH a
                          left join rates r on a.CCY = r.ccy and a.AC_DATE=r.eff_dt
                 where a.AC_DATE between (select vdate from par) and (select tdate from par)
                   and a.OTHSYS_ID = 'FE'
                   and a.TR_CODE not in ('0135152', '0132230', '0132210')
                   and length(a.ITM) = '10'
                   and SUBSTR(a.ITM, 1, 3) in ('120')
                   and SUBSTR(a.ITM, 1, 4) <> '1299'
                   and SUBSTR(a.ITM, 1, 4) not in ('1297', '1289')
                   and SUBSTR(a.ITM, 5, 1) <> '7'
                 group by substr(a.br, 1, 4), a.ccy, a.AC_DATE)

select AC_DATE,
       concat(br,'00') as br,
       nvl(sum(debit),0) as amount,
       ccy
from approve group by AC_DATE, br, ccy ;
`;
