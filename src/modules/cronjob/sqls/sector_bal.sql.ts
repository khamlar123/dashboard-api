export const sectorBal = (data: string) => `
  with par as (select ${data} as vdate from dual),

       brn as (select distinct substr(branch_code, 1, 4) as branch_code from rpt_branch),

       rates as (select eff_dt, ccy, buy from r_bpttqph where exr_typ = 'SMR' and eff_dt = (select vdate from par)),

       sec as (select '01' as sec
               union all
               select '02'
               union all
               select '03'
               union all
               select '04'
               union all
               select '05'
               union all
               select '06'
               union all
               select '07'
               union all
               select '08'
               union all
               select '09'),

       br_sec as (select brn.branch_code, sec.sec
                  from brn
                         left join sec on 1 = 1),

       T_Ball as (select contract_no, os_bal, tr_date
                  from (select tran.contract_no,
                               SUBSTR(tran.tr_date, 1, 6),
                               tran.tr_date,
                               tran.os_bal,
                               ## ?????????
                             row_number() over (partition by tran.contract_no order by tran.ts desc) rn
                        from ods.LNTTRAN tran
                        where tran_sts = 'N'
                          and SUBSTR(tran.tr_date, 1, 6) <= SUBSTR((select vdate from par), 1, 6)) t
                  where t.rn = 1),

       LNAC as (select lnac.account_no,
                       lcon.CONTRACT_NO,
                       lnac.ccy,
                       lnac.br,
                       lnac.lmt_no,
                       lnac.prod_cd,
                       lnac.status,
                       lnac.economic,
                       lnac.sector
                from lntlnac lnac
                       left join LNTCONT lcon on lnac.ACCOUNT_NO = lcon.ACCOUNT_NO),

       t_all as (select substr(ln.br, 1, 4) as                            br,
                        ln.CCY,
                        ln.SECTOR,
                        sum(tb.os_bal)      as                            os_bal,
                        case
                          when r.buy > 0 then round(nvl(sum(tb.os_bal), 0) * nvl(r.buy, 0), 2)
                          else round(nvl(sum(tb.os_bal), 0) * (1), 2) end BALLAK
                 from T_Ball tb
                        left outer join LNAC ln on tb.CONTRACT_NO = ln.CONTRACT_NO
                        left join rates r on ln.CCY = r.ccy
                 group by substr(ln.br, 1, 4), ln.CCY, ln.SECTOR),

       t_all1 as (select concat(brn.branch_code, '00') branch_code,
                         concat('SEC0', brn.sec) as    sec,
                         nvl(sum(BALLAK), 0)     as    balance,
                         (select vdate from par) as date
  from br_sec brn
    left join t_all
  on brn.branch_code = t_all.br and brn.sec = t_all.SECTOR
  group by brn.branch_code, brn.sec)

  select *
  from t_all1
  order by 1, 2
`;
