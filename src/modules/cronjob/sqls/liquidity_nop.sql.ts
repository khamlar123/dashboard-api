export const liquidityNop = () => `
  with par as (select ? as vdate from dual),

       rates as (select eff_dt, ccy, buy from r_bpttqph where exr_typ = 'SMR' and eff_dt = (select vdate from par)),

       asset01 as (select parm.category_code,
                          parm.category_name,
                          hmst.ccy,
                          hmst.br,
                          case
                            when parm.dc_sign = 'C'
                              then parm.bal_sign * ifnull(hmst.cdcbal, 0)
                            when parm.dc_sign = 'D'
                              then parm.bal_sign * ifnull(hmst.cddbal, 0)
                            end bal,
                          parm.itm_no
                   from report.R_AI_PROD_ITM_PARM parm
                          left join ods.AITHMST hmst
                                    on length(hmst.itm_no) = 10
                                      and hmst.gl_book_flg = 'BK002'
                                      and parm.itm_no = substr(hmst.itm_no, 1, length(trim(parm.itm_no)))
                   where parm.rpt_id = 'AI_D_503'
                     and parm.category_code in (
                                                '0101', '0102', '0103', '0201', '0202', '0203', '0204', '0302', '0303',
                                                '0304',
                                                '0401', '0402', '0403', '0404', '0501', '0711', '0712', '0713', '0740',
                                                '0406'
                     )
                     and parm.itm_no not in ('1197', '1297', '14971', '1397')
                     and hmst.ac_date = (select vdate from par)),

       asset02 as (select '0499' as                                             category_code,
                          case
                            when substr(hmst.ITM_NO, 1, 4) in ('1191', '1192', '1291', '1292')
                              then '9.Substandard and Doubtful'
                            else '10.Provision on Substandard and Doubtful' end category_name,
                          hmst.ccy,
                          hmst.br,
                          case
                            when substr(hmst.ITM_NO, 1, 4) in ('1191', '1192', '1291', '1292')
                              then (-1) * ifnull(hmst.cddbal, 0)
                            else
                              (-1) * ifnull(hmst.cdcbal, 0)
                            end                                                 bal,
                          hmst.itm_no
                   from ods.AITHMST hmst
                   where length(hmst.itm_no) = 10
                     and (substr(hmst.ITM_NO, 1, 4) in ('1191', '1192', '1291', '1292') OR
                          substr(hmst.ITM_NO, 1, 5) in ('11991', '11992', '12991', '12992'))
                     and hmst.AC_DATE = (select vdate from par)),

       asset as (SELECT substr(category_code, 1, 2)    as category_code,
                        ccy,
                        concat(substr(BR, 1, 4), '00') as br,
                        nvl(sum(bal), 0)               as bal
                 FROM asset01
                 group by substr(category_code, 1, 2), ccy, concat(substr(BR, 1, 4), '00')
                 UNION ALL
                 SELECT substr(category_code, 1, 2)    as category_code,
                        ccy,
                        concat(substr(BR, 1, 4), '00') as br,
                        nvl(sum(bal), 0)               as bal
                 FROM asset02
                 group by substr(category_code, 1, 2), ccy, concat(substr(BR, 1, 4), '00')),

       liability01 as (select parm.category_code,
                              parm.category_name,
                              hmst.ccy,
                              hmst.br,
                              case
                                when parm.dc_sign = 'C'
                                  then parm.bal_sign * ifnull(hmst.cdcbal, 0)
                                when parm.dc_sign = 'D'
                                  then parm.bal_sign * ifnull(hmst.cddbal, 0)
                                end bal,
                              parm.itm_no
                       from report.R_AI_PROD_ITM_PARM parm
                              left join ods.AITHMST hmst
                                        on length(hmst.itm_no) = 10
                                          and hmst.gl_book_flg = 'BK002'
                                          and parm.itm_no = substr(hmst.itm_no, 1, length(trim(parm.itm_no)))
                       where parm.rpt_id = 'AI_D_501'
                         and parm.category_code in (
                                                    '0101', '0102', '0103', '0104', '0105', '0201', '0202', '0311',
                                                    '0312', '0313', '0321', '0322', '0323', '0401', '0501', '0502',
                                                    '0504', '0505', '0506', '0507', '0508'
                         )
                         and hmst.ac_date = (select vdate from par)),

       liability02 as (select '0599' as                                         category_code,
                              case
                                when substr(hmst.ITM_NO, 1, 5) in ('23885')
                                  then '9.Other Account for Regularisation' end category_name,
                              hmst.ccy,
                              hmst.br,
                              case
                                when substr(hmst.ITM_NO, 1, 5) in ('23885')
                                  then (-1) * ifnull(hmst.cdcbal, 0)
                                else 0
                                end                                             bal,
                              hmst.itm_no
                       from ods.AITHMST hmst
                       where length(hmst.itm_no) = 10
                         and substr(hmst.ITM_NO, 1, 5) in ('23885')
                         and hmst.AC_DATE = (select vdate from par)),

       liability as (SELECT substr(category_code, 1, 2)    as category_code,
                            ccy,
                            concat(substr(BR, 1, 4), '00') as br,
                            nvl(sum(bal), 0)               as bal
                     FROM liability01
                     group by substr(category_code, 1, 2), ccy, concat(substr(BR, 1, 4), '00')
                     UNION ALL
                     SELECT substr(category_code, 1, 2)    as category_code,
                            ccy,
                            concat(substr(BR, 1, 4), '00') as br,
                            nvl(sum(bal), 0)               as bal
                     FROM liability02
                     group by substr(category_code, 1, 2), ccy, concat(substr(BR, 1, 4), '00')),

       capital01 as (select '0399'                       as category_code,
                            case
                              when substr(hmst.ITM_NO, 1, 3) in ('310') then 'ທຶນຈົດທະບຽນ'
                              when substr(hmst.ITM_NO, 1, 4) in ('3201') then 'ສ່ວນເພີ່ມມູນຄ່າທີ່ຕິດພັນກັບທຶນ'
                              when substr(hmst.ITM_NO, 1, 4) in ('3202', '3204', '3205', '3208')
                                then 'ສ່ວນເພີ່ມມູນຄ່າທີ່ຕິດພັນກັບທຶນ'
                              when substr(hmst.ITM_NO, 1, 4) in ('3203') then 'ຄັງຂະຫຍາຍທຸລະກິດ'
                              when substr(hmst.ITM_NO, 1, 3) in ('380') then 'ທຶນຈົດທະບຽນ'
                              end                           category_name,
                            hmst.ccy,
                            hmst.br,
                            (1) * ifnull(hmst.cdcbal, 0) as bal,
                            hmst.itm_no
                     from ods.AITHMST hmst
                     where length(hmst.itm_no) = 10
                       and (substr(hmst.ITM_NO, 1, 3) in ('310', '380') or
                            substr(hmst.ITM_NO, 1, 4) in ('3201', '3202', '3204', '3205', '3208', '3203', '3203')
                       or substr(hmst.ITM_NO, 1, 7) in ('3108100', '3108200'))
                       and hmst.AC_DATE = (select vdate from par)),

       capital_minus as (select '0399'                       as category_code,
                                case
                                  when (substr(hmst.ITM_NO, 1, 3) in ('142') or
                                        substr(hmst.ITM_NO, 1, 4) in ('1411', '1412', '1413', '1414', '1415', '1418'))
                                    then ' ເງິນລົງທຶນ ແລະ ເງິນລົງທຶນໃນວິສາຫະກິດ'
                                  end                           category_name,
                                hmst.ccy,
                                hmst.br,
                                (1) * ifnull(hmst.CDDBAL, 0) as bal,
                                hmst.itm_no
                         from ods.AITHMST hmst
                         where length(hmst.itm_no) = 10
                           and (substr(hmst.ITM_NO, 1, 3) in ('142') or
                                substr(hmst.ITM_NO, 1, 4) in ('1411', '1412', '1413', '1414', '1415', '1418'))
                           and hmst.AC_DATE = (select vdate from par)),

       capital as (SELECT substr(category_code, 1, 2)    as category_code,
                          ccy,
                          concat(substr(BR, 1, 4), '00') as br,
                          nvl(sum(bal), 0)               as bal
                   FROM capital01
                   group by substr(category_code, 1, 2), ccy, concat(substr(BR, 1, 4), '00')
                   UNION ALL
                   SELECT substr(category_code, 1, 2)    as category_code,
                          ccy,
                          concat(substr(BR, 1, 4), '00') as br,
                          nvl(sum(bal), 0)               as bal
                   FROM capital_minus
                   group by substr(category_code, 1, 2), ccy, concat(substr(BR, 1, 4), '00'))

  SELECT a.br,
         a.ccy,
         sum(a.bal) as                       bal,
         'asset'    as                       type,
         case
           when b.buy > 0 then round(nvl(sum(a.bal), 0) * nvl(b.buy, 0), 2)
           else nvl(sum(a.bal), 0) * (1) end ballak,
         (select vdate from par) as date
  FROM asset a
    left outer join rates b
  on a.CCY=b.ccy
  group by a.br, a.ccy
  union all
  SELECT c.br,
         c.ccy,
         sum(c.bal)  as                      bal,
         'liability' as                      type,
         case
           when b.buy > 0 then round(nvl(sum(c.bal), 0) * nvl(b.buy, 0), 2)
           else nvl(sum(c.bal), 0) * (1) end ballak,
         (select vdate from par) as date
  FROM liability c
    left outer join rates b
  on c.CCY=b.ccy
  group by c.br, c.ccy
  union all
  SELECT d.br,
         d.ccy,
         sum(d.bal) as                       bal,
         'capital'  as                       type,
         case
           when b.buy > 0 then round(nvl(sum(d.bal), 0) * nvl(b.buy, 0), 2)
           else nvl(sum(d.bal), 0) * (1) end ballak,
         (select vdate from par) as date
  FROM capital d
    left outer join rates b
  on d.CCY=b.ccy
  group by d.br, d.ccy;
`;
