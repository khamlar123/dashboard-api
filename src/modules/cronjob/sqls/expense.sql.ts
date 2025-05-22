import * as moment from 'moment';

const dateDeleteOneDay: string = moment().add(-1, 'day').format('YYYYMMDD');
export const expense = `
    with par as (select ${dateDeleteOneDay} as vdate from dual),
         types as (select 'EXP001' id, 'Interest' descip
                   from dual
                   union all
                   select 'EXP002' id, 'commission and Fee' descip
                   from dual
                   union all
                   select 'EXP003' id, 'Provision NPL' descip
                   from dual
                   union all
                   select 'EXP004' id, 'Gain Loss trading available' descip
                   from dual
                   union all
                   select 'EXP005' id, 'Others' descip
                   from dual
                   union all
                   select 'EXP006' id, 'Salary and Wages' descip
                   from dual
                   union all
                   select 'EXP007' id, 'Admin expenses' descip
                   from dual
                   union all
                   select 'EXP008' id, 'Depreciation' descip
                   from dual
                   union all
                   select 'EXP009' id, 'Profit tax' descip
                   from dual),

         brn as (select substr(a.branch_code, 1, 4) branch_code, t.id, t.descip
                 from (select distinct branch_code
                       from rpt_branch) a
                          left join types as t on 1 = 1),

         ic1 as (select 'EX001'              id,
                        ac_date,
                        br,
                        itm_no,
                        substr(itm_no, 1, 6) l6,
                        substr(itm_no, 1, 5) l5,
                        substr(itm_no, 1, 4) l4,
                        ccy,
                        cddbal,
                        cdcbal
                 from AITHMST
                 where AC_DATE = (select vdate from par)
        #and br = '400100'
        and length (itm_no) = '7'
        and (
        substr(itm_no, 1, 6) in
        ('410711', '410721', '410712', '410722')
        or substr(itm_no, 1, 5) in
        ('41012', '41013', '41014', '41016', '41051', '41021', '41023', '41024', '41026', '41052', '41031', '41022', '41036', '51011', '41011')
        )), ic2 as (
    select 'EX002' id, ac_date, br, itm_no, substr(itm_no, 1, 6) l6, substr(itm_no, 1, 5) l5, substr(itm_no, 1, 4) l4, ccy, cddbal, cdcbal
    from AITHMST
    where AC_DATE = (select vdate from par) #and br = '400100'
      and length (itm_no) = '7'
      and (substr(itm_no
        , 1
        , 5) in
        ('41018'
        , '41028'
        , '41038'
        , '41068'
        , '41078')
       or
        substr(itm_no
        , 1
        , 6) = '410748'
       or
        substr(itm_no
        , 1
        , 4) in ('4108')
        ))
        , ic3 as (
    select 'EX003' id, ac_date, br, itm_no, substr(itm_no, 1, 6) l6, substr(itm_no, 1, 5) l5, substr(itm_no, 1, 4) l4, ccy, cddbal, cdcbal
    from AITHMST
    where AC_DATE = (select vdate from par) #and br = '400100'
      and length (itm_no) = '7'
      and (substr(itm_no
        , 1
        , 5) in
        ('47011'
        , '47012'
        , '47018'
        , '47028'
        , '47032'
        , '47034')
       or
        substr(itm_no
        , 1
        , 6) in ('470131')
       or
        substr(itm_no
        , 1
        , 4) in ('4705')))
        , ic4 as (
    select 'Ex004' id, ac_date, br, itm_no, substr(itm_no, 1, 6) l6, substr(itm_no, 1, 5) l5, substr(itm_no, 1, 4) l4, ccy, cddbal, cdcbal
    from AITHMST
    where AC_DATE = (select vdate from par) #and br = '400100'
      and length (itm_no) = '7'
      and (substr(itm_no
        , 1
        , 5) in
        ('57021'
        , '47021')
       or
        substr(itm_no
        , 1
        , 6) in ('510336'
        , '570133'
        , '410336'
        , '470133')
        ))
        , ic5 as (
    select 'EX005' id, ac_date, br, itm_no, substr(itm_no, 1, 6) l6, substr(itm_no, 1, 5) l5, substr(itm_no, 1, 4) l4, ccy, cddbal, cdcbal
    from AITHMST
    where AC_DATE = (select vdate from par) #and br = '400100'
      and length (itm_no) = '7'
      and (substr(itm_no
        , 1
        , 6) in
        ('410331'
        , '410341'
        , '410731')
       or
        substr(itm_no
        , 1
        , 5) in ('41058'
        , '41078'
        , '45061'
        , '45062'
        , '47031'
        , '47038')
       or
        substr(itm_no
        , 1
        , 4) in ('4109'
        , '4501'
        , '4502'
        , '4503'
        , '4504'
        , '4508'
        , '4704')
       or
        substr(itm_no
        , 1
        , 3) in ('480')))
        , ic6 as (
    select 'EX006' id, ac_date, br, itm_no, substr(itm_no, 1, 6) l6, substr(itm_no, 1, 5) l5, substr(itm_no, 1, 4) l4, ccy, cddbal, cdcbal
    from AITHMST
    where AC_DATE = (select vdate from par) #and br like '4017%'
      and length (itm_no) = '7'
      and substr(itm_no
        , 1
        , 3) in
        ('420'))
        , ic7 as (
    select 'EX007' id, ac_date, br, itm_no, substr(itm_no, 1, 6) l6, substr(itm_no, 1, 5) l5, substr(itm_no, 1, 4) l4, ccy, cddbal, cdcbal
    from AITHMST
    where AC_DATE = (select vdate from par) #and br = '400100'
      and length (itm_no) = '7'
      and substr(itm_no
        , 1
        , 3) in
        ('430'
        , '440'))
        , ic8 as (
    select 'EX008' id, ac_date, br, itm_no, substr(itm_no, 1, 6) l6, substr(itm_no, 1, 5) l5, substr(itm_no, 1, 4) l4, ccy, cddbal, cdcbal
    from AITHMST
    where AC_DATE = (select vdate from par) #and br = '400100'
      and length (itm_no) = '7'
      and substr(itm_no
        , 1
        , 3) in
        ('460'
        , '560'))
        , ic9 as (
    select 'EX009' id, ac_date, br, itm_no, substr(itm_no, 1, 6) l6, substr(itm_no, 1, 5) l5, substr(itm_no, 1, 4) l4, ccy, cddbal, cdcbal
    from AITHMST
    where AC_DATE = (select vdate from par) #and br = '400100'
      and length (itm_no) = '7'
      and substr(itm_no
        , 1
        , 3) in
        ('490'))
        , all_ic as (
    select AC_DATE, id, substr(br, 1, 4) as br, nvl(sum (CDDBAL), 0) as CDDBAL, nvl(sum (CDCBAL), 0) as CDCBAL
    from ic1
    group by AC_DATE, id, substr(br, 1, 4)
    union

    select AC_DATE, id, substr(br, 1, 4) as br, nvl(sum (CDDBAL), 0) as CDDBAL, nvl(sum (CDCBAL), 0) as CDCBAL
    from ic2
    group by AC_DATE, id, substr(br, 1, 4)
    union

    select AC_DATE, id, substr(br, 1, 4) as br, nvl(sum (CDDBAL), 0) as CDDBAL, nvl(sum (CDCBAL), 0) as CDCBAL
    from ic3
    group by AC_DATE, id, substr(br, 1, 4)
    union

    select AC_DATE, id, substr(br, 1, 4) as br, nvl(sum (CDDBAL), 0) as CDDBAL, nvl(sum (CDCBAL), 0) as CDCBAL
    from ic4
    group by AC_DATE, id, substr(br, 1, 4)
    union

    select AC_DATE, id, substr(br, 1, 4) as br, nvl(sum (CDDBAL), 0) as CDDBAL, nvl(sum (CDCBAL), 0) as CDCBAL
    from ic5
    group by AC_DATE, id, substr(br, 1, 4)
    union

    select AC_DATE, id, substr(br, 1, 4) as br, nvl(sum (CDDBAL), 0) as CDDBAL, nvl(sum (CDCBAL), 0) as CDCBAL
    from ic6
    group by AC_DATE, id, substr(br, 1, 4)
    union

    select AC_DATE, id, substr(br, 1, 4) as br, nvl(sum (CDDBAL), 0) as CDDBAL, nvl(sum (CDCBAL), 0) as CDCBAL
    from ic7
    group by AC_DATE, id, substr(br, 1, 4)

    union

    select AC_DATE, id, substr(br, 1, 4) as br, nvl(sum (CDDBAL), 0) as CDDBAL, nvl(sum (CDCBAL), 0) as CDCBAL
    from ic8
    group by AC_DATE, id, substr(br, 1, 4)

    union

    select AC_DATE, id, substr(br, 1, 4) as br, nvl(sum (CDDBAL), 0) as CDDBAL, nvl(sum (CDCBAL), 0) as CDCBAL
    from ic9
    group by AC_DATE, id, substr(br, 1, 4))

    select b.branch_code
         , ifnull((select vdate from par), a.ac_date)                                    ac_date
         , round((nvl(a.CDDBAL, 0) - nvl(a.CDCBAL, 0)) * (-1), 2)                     as bal
         , round(round((nvl(a.CDDBAL, 0) - nvl(a.CDCBAL, 0)) * (-1), 2) / 1000000, 2) as balM
         , b.id
         , b.descip
    from brn b
             left join all_ic a
                       on b.id = a.id and b.branch_code = a.br
    order by 2, 1, 5

`;
