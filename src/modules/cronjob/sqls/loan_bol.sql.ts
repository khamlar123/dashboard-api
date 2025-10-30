export const loan_bol = () => `
  with par as (select ? as vdate, ? as fdate from dual),

       brn as (select distinct substr(branch_code, 1, 4) as branch_code from rpt_branch),

       rates as (select eff_dt, ccy, buy
                 from r_bpttqph
                 where exr_typ = 'SMR'
                   and eff_dt between (select vdate from par) and (select fdate from par)),

       ALLs as (select a.AC_DT,
                       substr(a.AC, 1, 4) as                                                    br,
                       substr(a.AC, 7, 3) as                                                    ccy,
                       substr(AC, 10, 14)                                                       gl,
                       substr(AC, 10, 10)                                                       itm_no,
                       substr(AC, 20, 4)                                                        SEQ,
                       case when IFNULL(a.BAL, 0) > 0 then 0 else (IFNULL(a.BAL, 0) * (-1)) end debit,
                       case when IFNULL(a.BAL, 0) < 0 then 0 else (IFNULL(a.BAL, 0) * (1)) end  credit,
                       case
                         when r.buy > 0 then  nvl(r.buy, 0)
                         else 1 end as rate
                from core001.AITMIBA a
                       left join rates r on substr(a.AC, 7, 3) = r.ccy and a.AC_DT = r.eff_dt
                where a.AC_DT between (select vdate from par) and (select fdate from par)
                  AND (substr(AC, 10, 5) in (
                                             '21221', '21222','21223','21321','21322','21231' ) or
                       substr(AC, 10, 4) in ('2141','2142'))
                group by a.AC_DT, substr(a.AC, 7, 3), substr(AC, 10, 14)  ,
                         substr(a.AC, 1, 4), substr(AC, 10, 10), substr(AC, 20, 4)),

       loan_bol as (select AC_DT,
                           ccy,
                           gl,
                           case
                             when gl in ('21221520000001') then 'BOL003'
                             when gl in ('21221530170117', '21221530170118', '21221530170119', '21221530170120')
                               then 'BOL002'
                             when gl in ('21221530170121') then 'BOL001'
                             when gl in ('21321520010002') then 'BOL004'
                             else 'BOL005'
                             end                                      as bol_code,
                           concat(br, '00')                             as branch,
                           sum(debit) debit,
                           sum(credit) credit,
                           round(nvl(sum(debit), 0) * nvl(rate, 0), 2)  as CDDBALLAK,
                           round(nvl(sum(credit), 0) * nvl(rate, 0), 2) as CDCBALLAK
                    from ALLs
                    group by AC_DT, concat(br, '00'), ccy, gl
                    order by AC_DT, concat(br, '00'))

  select
    a.branch,
    a.bol_code,
    a.AC_DT,
    sum(a.CDCBALLAK) as amount
  from loan_bol a group by branch, ccy, bol_code;
`;
