export const LiabilityCapitalAsset = () => `
with par as (select ? as vdate from dual),

T as (
select  hmst.AC_DATE, parm.category_code,
                       parm.category_name,
                       hmst.ccy,
                       hmst.br,
                       parm.itm_no,
                       parm.dc_sign,
                       case when parm.dc_sign = 'C'
                                then parm.bal_sign*ifnull(hmst.cdcbal,0)
                            when parm.dc_sign = 'D'
                                then parm.bal_sign*ifnull(hmst.cddbal,0)
                            else 0
                       end bal,
                        concat(substr(BR,1,4),'00') as hbr
                from ods.AITHMST hmst
                    left outer join report.R_AI_PROD_ITM_PARM parm
                     on length(hmst.itm_no) = 10
                        and hmst.gl_book_flg = 'BK002'
                        and parm.itm_no = substr(hmst.itm_no,1,length(trim(parm.itm_no)))
                        and hmst.ac_date =(select vdate from par) 
                where parm.rpt_id = 'AI_D_501' ),

    T2 as (
        select AC_DATE, hbr as br,
               case when substr(category_code,1,2) in ('01','02','03','05') then 'L'
        when substr(category_code,1,2) in ('04') then 'L4'
        when substr(category_code,1,2) in ('06') then 'C'
        end as category_code,
                   sum(case when ccy = 'LAK' then bal
\t\t\t\telse F_EXCH_LAK_BY_ACDT(ccy,bal,'SMR','FX_BUY', AC_DATE)
\t\t   end) all_bal
        from T group by AC_DATE, hbr , substr(category_code,1,2)
    )

select AC_DATE,br,
       category_code,
       nvl(all_bal,0) as bal
       from T2 ;
`;
