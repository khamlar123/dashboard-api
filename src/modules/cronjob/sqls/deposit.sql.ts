export const deposit = () => `
  with par as (select ? as vdate from dual),

       brn as (select distinct substr(branch_code, 1, 4) as branch_code from rpt_branch),

       rates as (select eff_dt, ccy, buy from r_bpttqph where exr_typ = 'SMR' and eff_dt = (select vdate from par)),

       AITHM as (select AC_DATE,
                        br,
                        ITM_NO,
                        CCY,
                        CDDBAL,
                        CDCBAL
                 from AITHMST
                 WHERE LENGTH(ITM_NO) = '10'
                   AND SUBSTR(ITM_NO, 1, 5) in (
                                                '22011',
                                                '22021',
                                                '22031',
                                                '22032',
                                                '22033',
                                                '22041',
                                                '22012',
                                                '22013',
                                                '22014',
                                                '22015',
                                                '22017',
                                                #---
                                                  '21311',
                                                '21312',
                                                '21318',
                                                #---
                                                  '21212',
                                                '21214',
                                                '21313',
                                                '21314',
                                                '21315',
                                                '21316',
                                                '21317',
                                                '21213'
                   )
                   and AC_DATE = (select vdate from par)),

       AITHM_PERSO as (select ac_date,
                              concat(substr(br, 1, 4), '00') as branch,
                              ccy,
                              ITM_NO,
                              case
                                when (substr(ITM_NO, 1, 5) in ('22011') or substr(ITM_NO, 1, 6) in (
                                                                                                    '220211',
                                                                                                    '220311',
                                                                                                    '220321',
                                                                                                    '220331',
                                                                                                    '220411'
                                  )) then 'DEPTY_002'
                                when (substr(ITM_NO, 1, 5) in ('22013')) then 'DEPTY_001'
                                when (substr(ITM_NO, 1, 5) in ('22015') or substr(ITM_NO, 1, 7) in (
                                                                                                    '2201511',
                                                                                                    '2201512',
                                                                                                    '2201513',
                                                                                                    '2201521',
                                                                                                    '2201522',
                                                                                                    '2201523'
                                  )) then 'DEPTY_003'
                                when (substr(ITM_NO, 1, 5) in ('22014')) then 'DEPTY_004'
                                when (substr(ITM_NO, 1, 5) in ('22017')) then 'DEPTY_005'
                                else 'DEPTY_006' end         as Dep_type,
                              # 22012
CDDBAL, CDCBAL,
                              'DEP_001'                      as ID
                       from AITHM
                       where (
                               SUBSTR(ITM_NO, 1, 5) in (
                                                        '22011',
                                                        '22013',
                                                        '22015',
                                                        '22014',
                                                        '22017',
                                                        '22012'
                                 ) or substr(ITM_NO, 1, 6) in (
                                                               '220211',
                                                               '220311',
                                                               '220321',
                                                               '220331',
                                                               '220411'
                                 ) or substr(ITM_NO, 1, 7) in (
                                                               '2201511',
                                                               '2201512',
                                                               '2201513',
                                                               '2201521',
                                                               '2201522',
                                                               '2201523'
                                 )
                               )),

       AITHM_BANK as (select ac_date,
                             concat(substr(br, 1, 4), '00') as branch,
                             ccy,
                             ITM_NO,
                             case
                               when (substr(ITM_NO, 1, 6) in (
                                                              '213111',
                                                              '213121'
                                 )) then 'DEPTY_002'
                               when (substr(ITM_NO, 1, 6) in ('213113', '213123')) then 'DEPTY_001'
                               when (substr(ITM_NO, 1, 6) in ('213115', '213125') or substr(ITM_NO, 1, 7) in (
                                                                                                              '2131151',
                                                                                                              '2131251',
                                                                                                              '2131152',
                                                                                                              '2131252'
                                 )) then 'DEPTY_003'
                               when (substr(ITM_NO, 1, 6) in ('213114', '213124')) then 'DEPTY_004'
                               when (substr(ITM_NO, 1, 6) in ('213181')) then 'DEPTY_005'
                               else 'DEPTY_006' end         as Dep_type,
                             CDDBAL,
                             CDCBAL,
                             'DEP_002'                      as ID
                      from AITHM
                      where (
                              SUBSTR(ITM_NO, 1, 5) in (
                                '21312'
                                ) or substr(ITM_NO, 1, 6) in (
                                                              '213111',
                                                              '213121',
                                                              '213113',
                                                              '213123',
                                                              '213115',
                                                              '213125',
                                                              '213114',
                                                              '213124',
                                                              '213181'
                                ) or substr(ITM_NO, 1, 7) in (
                                                              '2131151',
                                                              '2131251',
                                                              '2131152',
                                                              '2131252'
                                )
                              )),

       AITHM_FINAN as (select ac_date,
                              concat(substr(br, 1, 4), '00') as branch,
                              ccy,
                              ITM_NO,
                              case
                                when (substr(ITM_NO, 1, 6) in (
                                                               '212121',
                                                               '212141',
                                                               '213141',
                                                               '213151',
                                                               '213161',
                                                               '213166',
                                                               '213173'
                                  ) or substr(ITM_NO, 1, 7) in (
                                                                '2131311',
                                                                '2131321'
                                  )) then 'DEPTY_002'
                                when (substr(ITM_NO, 1, 6) in ('212123',
                                                               '212143',
                                                               '213143',
                                                               '213153',
                                                               '213163',
                                                               '213173'
                                  ) or substr(ITM_NO, 1, 7) in (
                                                                '2131160',
                                                                '2131313',
                                                                '2131323'
                                  )) then 'DEPTY_001'
                                when (substr(ITM_NO, 1, 6) in ('212125',
                                                               '212145'
                                  ) or substr(ITM_NO, 1, 7) in (
                                                                '2131315',
                                                                '2131325',
                                                                '2121251',
                                                                '2121451',
                                                                '2131315',
                                                                '2131325',
                                                                '2131451',
                                                                '2131551',
                                                                '2131651',
                                                                '2131751',
                                                                '2121252',
                                                                '2121452',
                                                                '2131452',
                                                                '2131552',
                                                                '2131652',
                                                                '2131752'
                                  )) then 'DEPTY_003'
                                when (substr(ITM_NO, 1, 6) in ('213144',
                                                               '213154',
                                                               '213164',
                                                               '213174'
                                  ) or substr(ITM_NO, 1, 7) in (
                                                                '2131314',
                                                                '2131324'
                                  )) then 'DEPTY_004'
                                when (substr(ITM_NO, 1, 6) in ('213182')) then 'DEPTY_005'
                                else 'DEPTY_006' end         as Dep_type,
                              #21213
                                                                CDDBAL,
                              CDCBAL,
                              'DEP_003'                      as ID
                       from AITHM
                       where (
                               SUBSTR(ITM_NO, 1, 5) in (
                                                        '21212',
                                                        '21214',
                                                        '21313',
                                                        '21314',
                                                        '21315',
                                                        '21316',
                                                        '21317',
                                                        '21213'
                                 ) or substr(ITM_NO, 1, 6) in (
                                                               '212121',
                                                               '212141',
                                                               '213141',
                                                               '213151',
                                                               '213161',
                                                               '213166',
                                                               '213173',
                                                               '212123',
                                                               '212143',
                                                               '213143',
                                                               '213153',
                                                               '213163',
                                                               '213173',
                                                               '212125',
                                                               '212145',
                                                               '213144',
                                                               '213154',
                                                               '213164',
                                                               '213174',
                                                               '213182'
                                 ) or substr(ITM_NO, 1, 7) in (
                                                               '2131311',
                                                               '2131321',
                                                               '2131160',
                                                               '2131313',
                                                               '2131323',
                                                               '2131315',
                                                               '2131325',
                                                               '2121251',
                                                               '2121451',
                                                               '2131315',
                                                               '2131325',
                                                               '2131451',
                                                               '2131551',
                                                               '2131651',
                                                               '2131751',
                                                               '2121252',
                                                               '2121452',
                                                               '2131452',
                                                               '2131552',
                                                               '2131652',
                                                               '2131752',
                                                               '2131314',
                                                               '2131324'
                                 )
                               )),

       ALLs as (SELECT *
                FROM AITHM_PERSO
                union all
                SELECT *
                FROM AITHM_BANK
                union all
                SELECT *
                FROM AITHM_FINAN)

  select a.AC_DATE,
         a.branch,
         a.CCY,
         nvl(sum(a.CDDBAL), 0) as                 CDDBAL,
         case
           when r.buy > 0 then round((nvl(sum(a.CDDBAL), 0) * nvl(r.buy, 0)), 2)
           else (nvl(sum(a.CDDBAL), 0) * (1)) end CDDBALLAK,
         nvl(sum(a.CDCBAL), 0) as                 CDCBAL,
         case
           when r.buy > 0 then round((nvl(sum(a.CDCBAL), 0) * nvl(r.buy, 0)), 2)
           else (nvl(sum(a.CDCBAL), 0) * (1)) end CDCBALLAK,
         a.id                  as                 dep_id,
         a.Dep_type
  from ALLs a
         left join rates r on a.CCY = r.ccy
  group by a.AC_DATE, a.branch, a.ccy, a.ID, a.Dep_type

`;
