export const adminExp = () => `
  with par as (select ? as vdate from dual),
       branch_list as (select sub_branch_code
                       from rpt_branch
                       where (sub_branch_code = '400100'
                         or fict6_branch_code = '999999'
                         or fict9_branch_code = '999999' )
       ),
       param_main as (

         select '031611' as category_code, '16.1.1 - ເງິນເດືອນແລະຄ່າແຮງງານ' as category_name, '4201' as itm_no , 'D' as dc_sign , '1' as bal_sign from dual union all
         select '031612', '16.1.2 - ລາຍເງິນອູດໜູນແລະສະຫວັດດີການພະນັກງານ', '4202', 'D', '1' from dual union all
         select '031613', '16.1.3 - ລາຍຈ່າຍເພື່ອກໍ່ສ້າງພະນັກງານ', '4203', 'D', '1' from dual union all
         select '031614', '16.1.4 - ລາຍຈ່າຍອື່ນໆດ້ານພະນັກງານ', '4208', 'D', '1' from dual union all

         select '031701', '16.2.1 - ລາຍຈ່າຍພາສີ ແລະ ອາກອນ', '430', 'D', '1' from dual union all
         select '031702', '16.2.2 - ຄ່າງວດຂອງສິນເຊື່ອ ເຊົ່າ-ຊື້ ແລະ ລາຍການປະເພດດຽວກັນ', '4401', 'D', '1' from dual union all
         select '031703', '16.2.3 - ຄ່າເຊົ່າຕ່າງໆ', '4402', 'D', '1' from dual union all
         select '031704', '16.2.4 - ຄ່ານາຍໜ້າ ແລະ ຄ່າປ່ວຍຕ່າງໆ', '4403', 'D', '1' from dual union all
         select '031709', '16.2.5 - ຄ່າບໍລິການຕ່າງໆທີ່ບໍລິສັດໃນກຸ່ມເປັນຜູ້ສະໜອງໃຫ້', '4404', 'D', '1' from dual union all
         select '031710', '16.2.6 - ຄ່າຂົນສົ່ງ ແລະ ຄ່າໂດຍສານ', '4405', 'D', '1' from dual union all
         select '031714', '16.2.7 -  ຄ່າໂຄສະນາ, ໜັງສືພິມ, ວາລະສານ ແລະ ປື້ມຕ່າງໆ', '4406', 'D', '1' from dual union all
         select '031720', '16.2.8 - ເຄື່ອງໃຊ້ຫ້ອງການ ແລະ ສິ່ງພິມຕ່າງໆ', '4407', 'D', '1' from dual union all
         select '031723', '16.2.9 -  ຄ່າບໍລິການອື່ນໆຈາກທາງນອກ', '4408', 'D', '1' from dual union all
         select '031729', '16.2.10 - ຄ່າໄຊ້ຈ່າຍເຂົ້າໃນກອງປະຊຸມ', '4408600', 'D', '1' from dual union all
         select '031730', '16.2.11 - ຄ່າຮັບແຂກ, ຄ່າພັກເຊົາ ແລະ ອັດຕາກິນ', '44087', 'D', '1' from dual union all
         select '031734', '16.2.12  - ອື່ນໆ', '4408800', 'D', '1' from dual
       ),


       T_NOW as (
         select  parm.category_code,
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
         from param_main  parm
                left join ods.AITHMST hmst
                          on length(hmst.itm_no) = 10
                            and hmst.gl_book_flg = 'BK002'
                            and parm.itm_no = substr(hmst.itm_no,1,length(trim(parm.itm_no)))
                            and hmst.ac_date = (select vdate from par)
         where  BR in (select sub_branch_code from branch_list)
       ),


       TN1 as (
         select
           A.category_code,
           A.category_name,
           hbr,
           ccy,
           sum(A.bal) as bal,
           sum(case when A.ccy = 'LAK' then A.bal
                    else F_EXCH_LAK_BY_ACDT(A.ccy,A.bal,'SMR','FX_BUY',(select vdate from par))
             end) bal_lak
         from T_NOW A
         group by A.category_code, A.category_name, hbr, ccy ),


       TN2 as
         (  select category_code,category_name, hbr, ccy,
                   bal,
                   bal_lak
            from TN1
         ),


       PRAM as (
         select distinct  parm.category_code,
                          parm.category_name,
                          concat('0',parm.category_code) as code
         from param_main parm
         order by  parm.category_code )

  select (select vdate from par) as AC_DATE,
       TN2.hbr as br,
       PRAM.code as ITM_NO,
       TN2.ccy,
       case when nvl(TN2.bal, 0) < 0 then (nvl(TN2.bal, 0) * (-1)) else nvl(TN2.bal, 0) end as cddbal ,
       case when nvl(TN2.bal_lak, 0) < 0 then (nvl(TN2.bal_lak, 0) * (-1)) else nvl(TN2.bal_lak, 0) end as cddlak,
       0 as CDCBAL,
       0 as cdclak
  #PRAM.category_code,
  #PRAM.category_name
  from PRAM
  left outer join TN2
  on PRAM.category_code=TN2.category_code where TN2.hbr in (
  select distinct branch_code
  from rpt_branch
  ) ;



`;
