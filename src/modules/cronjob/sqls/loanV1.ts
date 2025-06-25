export const loan = () => `
 # ALL
with par as (select ? as vdate from dual),

     brn as (select distinct substr(branch_code, 1, 4) as branch_code from rpt_branch),

     rates as (select eff_dt, ccy, buy from r_bpttqph where exr_typ = 'SMR' and eff_dt = (select vdate from par)),

     ALLs as (select substr(a.br, 1, 4)    as                   br,
                     a.ccy,
                     nvl(sum(a.CDDBAL), 0) as                   CDDBAL,
                     case
                         when r.buy > 0 then (nvl(sum(a.CDDBAL), 0) * nvl(r.buy, 0))
                         else (nvl(sum(a.CDDBAL), 0) * (1)) end BALLAK,
                     nvl(sum(a.CDCBAL), 0) as                   CDCBAL
              from AITHMST a
                       left join rates r on a.CCY = r.ccy
              where a.ac_date = (select vdate from par)
                and length(a.ITM_NO) = '10'
                AND SUBSTR(a.ITM_NO, 1, 2) in ('12')
                and SUBSTR(a.ITM_NO, 1, 4) <> '1299'
                and SUBSTR(a.ITM_NO, 1, 4) not in ('1297', '1289')
                and SUBSTR(a.ITM_NO, 5, 1) <> '7'
              group by a.ccy, substr(a.br, 1, 4)),

# NPL
     NPL as (select substr(a.br, 1, 4)    as                   br,
                    a.ccy,
                    nvl(sum(a.CDDBAL), 0) as                   CDDBAL,
                    case
                        when r.buy > 0 then (nvl(sum(a.CDDBAL), 0) * nvl(r.buy, 0))
                        else (nvl(sum(a.CDDBAL), 0) * (1)) end BALLAK,
                    nvl(sum(a.CDCBAL), 0) as                   CDCBAL
             from AITHMST a
                      left join rates r on a.CCY = r.ccy
             where a.ac_date = (select vdate from par)
               and length(a.ITM_NO) = '10'
               AND SUBSTR(a.ITM_NO, 1, 3) in ('129')
               and SUBSTR(a.ITM_NO, 1, 4) <> '1299'
               and SUBSTR(a.ITM_NO, 1, 4) not in ('1297', '1289')
               and SUBSTR(a.ITM_NO, 5, 1) <> '7'
             group by a.ccy, substr(a.br, 1, 4)),

# Class
     Class as (select substr(a.br, 1, 4)    as                   br,
                      a.ccy,
                      SUBSTR(a.ITM_NO, 1, 4)                     gl,
                      nvl(sum(a.CDDBAL), 0) as                   CDDBAL,
                      case
                          when r.buy > 0 then (nvl(sum(a.CDDBAL), 0) * nvl(r.buy, 0))
                          else (nvl(sum(a.CDDBAL), 0) * (1)) end LAK,
                      nvl(sum(a.CDCBAL), 0) as                   CDCBAL
               from AITHMST a
                        left join rates r on a.CCY = r.ccy
               where a.ac_date = (select vdate from par)
                 and length(a.ITM_NO) = '10'
                 AND SUBSTR(a.ITM_NO, 1, 2) in ('12')
                 and SUBSTR(a.ITM_NO, 1, 4) <> '1299'
                 and SUBSTR(a.ITM_NO, 1, 4) not in ('1297', '1289')
                 and SUBSTR(a.ITM_NO, 5, 1) <> '7'
               group by a.ccy, substr(a.br, 1, 4), SUBSTR(a.ITM_NO, 1, 4)),

     subclass as (select br,
                         gl,
                         substr(gl, 1, 3)                                                    ga,
                         case when substr(gl, 1, 3) = '120' then sum(nvl(LAK, 0)) else 0 end 'A',
                         case when substr(gl, 1, 3) = '128' then sum(nvl(LAK, 0)) else 0 end 'B',
                         case
                             when substr(gl, 1, 3) = '129' then
                                 case when substr(gl, 1, 4) = '1291' then sum(nvl(LAK, 0)) else 0 end
                             end                                                             'C',
                         case
                             when substr(gl, 1, 3) = '129' then
                                 case when substr(gl, 1, 4) = '1292' then sum(nvl(LAK, 0)) else 0 end
                             end                                                             'D',
                         case
                             when substr(gl, 1, 3) = '129' then
                                 case when substr(gl, 1, 4) = '1293' then sum(nvl(LAK, 0)) else 0 end
                             end                                                             'E'
                  from Class
                  group by br, gl, substr(gl, 1, 3)),

 #Approve

         approve as (select substr(a.br, 1, 4) as                                     br,
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
                          left join rates r on a.CCY = r.ccy
                 where a.AC_DATE = (select vdate from par)
                   and a.OTHSYS_ID = 'FE'
                   and a.TR_CODE not in ('0135152', '0132230', '0132210')
                   and length(a.ITM) = '10'
                   and SUBSTR(a.ITM, 1, 3) in ('120')
                   and SUBSTR(a.ITM, 1, 4) <> '1299'
                   and SUBSTR(a.ITM, 1, 4) not in ('1297', '1289')
                   and SUBSTR(a.ITM, 5, 1) <> '7'
                 group by substr(a.br, 1, 4), a.ccy),


#Loan Term

T_Ball as ( select contract_no, os_bal, tr_date
from (select tran.contract_no, SUBSTR(tran.tr_date, 1, 6), tran.tr_date,
             tran.os_bal, ## ?????????
             row_number() over (partition by tran.contract_no order by tran.ts desc) rn
      from ods.LNTTRAN tran
      where tran_sts = 'N'
        and SUBSTR(tran.tr_date, 1, 6) <= SUBSTR( (select vdate from par) , 1, 6)
      ) t
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
              left join LNTCONT lcon on lnac.ACCOUNT_NO=lcon.ACCOUNT_NO ),

t_all as (select substr(ln.br, 1, 4) as  br,
                 ln.CCY,
                 substr(ln.PROD_CD, 4, 1) as term,
                 sum(tb.os_bal) as os_bal,
                 case
                     when r.buy > 0 then round(nvl(sum(tb.os_bal), 0) * nvl(r.buy, 0), 2)
                     else round(nvl(sum(tb.os_bal), 0) * (1), 2) end BALLAK
          from T_Ball tb
                   left outer join LNAC ln on tb.CONTRACT_NO = ln.CONTRACT_NO
                   left join rates r on ln.CCY = r.ccy
          group by substr(ln.br, 1, 4), ln.CCY, substr(ln.PROD_CD, 4, 1)),

t_all1 as (select br,
       case when term='1' then nvl(sum(BALLAK),0) else 0 end 'Short',
       case when term='2' then nvl(sum(BALLAK),0) else 0 end 'Middle',
       case when term='3' then nvl(sum(BALLAK),0) else 0 end 'Longs'
from t_all
group by br, term )

select concat(brn.branch_code,'00') as Branch_code,
       (select vdate from par) as Dates,
       #'0' as Loan_plan,
       nvl(loanall.loan_all_balLAK,0) as Loan_Balance_Daily,
       #'0' as NPL_plan,
       nvl(loannpl.loannpl_balLAK,0)  as NPL_Balance_Daily,
       #'0' as Fund,
       nvl(ApproveLoan.Approve_amt,0) as  Drawndown_Daily,
       loansubclass.A          as A,
       loansubclass.B          as B,
       loansubclass.C          as C,
       loansubclass.D          as D,
       loansubclass.E          as E,
       loanterm.Short as Short,
       loanterm.Middle as Middle,
       loanterm.Longs as Longs
from brn
         left join (select BR, round(sum(BALLAK) * (-1), 2) loan_all_balLAK
                    from ALLs
                    group by br) loanall on brn.branch_code = loanall.BR
         left join (select BR, nvl(round(sum(BALLAK) * (-1), 2), 0) loannpl_balLAK
                    from NPL
                    group by br) loannpl on brn.branch_code = loannpl.br
         left join (select br, nvl(sum(DBBALLAK),0) Approve_amt
                    from approve
                    group by br) ApproveLoan on brn.branch_code = ApproveLoan.br
         left join (select br,
                           nvl(round(sum(A), 2) * (-1), 0) as 'A',
                           nvl(round(sum(B), 2) * (-1), 0) as 'B',
                           nvl(round(sum(C), 2) * (-1), 0) as 'C',
                           nvl(round(sum(D), 2) * (-1), 0) as 'D',
                           nvl(round(sum(E), 2) * (-1), 0) as 'E'
                    from subclass
                    group by br) loansubclass on brn.branch_code = loansubclass.br

         left join (
                    select br,
                    sum(Short) as Short ,
                    sum(Middle) as Middle,
                    sum(Longs) as Longs
                    from t_all1 group by br) loanterm on brn.branch_code = loanterm.br ;
                    `;
