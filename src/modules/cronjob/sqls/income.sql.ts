export const income = () => `
  with par as (select ? as vdate from dual),

       types as (select 'IN001' id, 'Interest Income' descip
                 from dual
                 union all
                 select 'IN002' id, 'commission and Fee' descip
                 from dual
                 union all
                 select 'IN003' id, 'Gain From FX' descip
                 from dual
                 union all
                 select 'IN004' id, 'Reverse provision' descip
                 from dual
                 union all
                 select 'IN005' id, 'Gain Loss trading Derivatives' descip
                 from dual
                 union all
                 select 'IN006' id, 'Income ordinary lease' descip
                 from dual
                 union all
                 select 'IN007' id, 'Others' descip
                 from dual),

       brn as (select substr(a.branch_code, 1, 4) branch_code, t.id, t.descip
               from (select distinct branch_code
                     from rpt_branch) a
                      left join types as t on 1 = 1),

       ic1 as (select 'IN001'              id,
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
                 and length(itm_no) = '10'
                 and (
                 substr(itm_no, 1, 6) in
                 ('510712', '510722', '510331', '510332', '410332', '410342', '510711', '510721')
                   or substr(itm_no, 1, 5) in
                      ('51012', '51013', '51014', '51016', '51051', '51021', '51023', '51024', '51026',
                       '51052',
                       '51029', '51022', '51031', '51034', '51036', '51037 ')
                 )),
       ic2 as (select 'IN002'              id,
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
                 and length(itm_no) = '10'
                 and (substr(itm_no, 1, 5) in
                      ('51018', '51028', '51038', '51068', '51078') or
                      substr(itm_no, 1, 6) = '510747' or
                      substr(itm_no, 1, 4) in ('5108')
                 )),
       ic3 as (select 'IN003'              id,
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
                 and length(itm_no) = '10'
                 and substr(itm_no, 1, 5) in
                     ('51061', '41061')),
       ic4 as (select 'IN004'              id,
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
                 and length(itm_no) = '10'
                 and (substr(itm_no, 1, 5) in
                      ('57011', '57012', '57018', '57028', '57032', '57034') or
                      substr(itm_no, 1, 6) in ('570131') or
                      substr(itm_no, 1, 4) in ('5705')
                 )),
       ic5 as (select 'IN005'              id,
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
                 and length(itm_no) = '10'
                 and substr(itm_no, 1, 6) in
                     ('510741', '510742', '510746', '410741', '410742', '410746')),
       ic6 as (select 'IN006'              id,
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
                 and length(itm_no) = '10'
                 and (substr(itm_no, 1, 5) in
                      ('51042') or
                      substr(itm_no, 1, 6) in
                      ('510492'))),
       ic7 as (select 'IN007'              id,
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
                 and length(itm_no) = '10'
                 and (substr(itm_no, 1, 5) in
                      ('55061', '55062', '57031', '57038') or
                      substr(itm_no, 1, 6) in ('510731') or
                      substr(itm_no, 1, 4) in ('5508', '5704', '5109', '5501', '5502', '5503', '5504', '5507') or
                      substr(itm_no, 1, 3) in ('580') or
                      substr(itm_no, 1, 7) in ('5107380')
                 )),
       all_ic as (select AC_DATE,
                         id,
                         substr(br, 1, 4)    as br,
                         nvl(sum(CDDBAL), 0) as CDDBAL,
                         nvl(sum(CDCBAL), 0) as CDCBAL
                  from ic1
                  group by AC_DATE, id, substr(br, 1, 4)
                  union
                  select AC_DATE,
                         id,
                         substr(br, 1, 4)    as br,
                         nvl(sum(CDDBAL), 0) as CDDBAL,
                         nvl(sum(CDCBAL), 0) as CDCBAL
                  from ic2
                  group by AC_DATE, id, substr(br, 1, 4)
                  union
                  select AC_DATE,
                         id,
                         substr(br, 1, 4)    as br,
                         nvl(sum(CDDBAL), 0) as CDDBAL,
                         nvl(sum(CDCBAL), 0) as CDCBAL
                  from ic3
                  group by AC_DATE, id, substr(br, 1, 4)
                  union
                  select AC_DATE,
                         id,
                         substr(br, 1, 4)    as br,
                         nvl(sum(CDDBAL), 0) as CDDBAL,
                         nvl(sum(CDCBAL), 0) as CDCBAL
                  from ic4
                  group by AC_DATE, id, substr(br, 1, 4)
                  union
                  select AC_DATE,
                         id,
                         substr(br, 1, 4)    as br,
                         nvl(sum(CDDBAL), 0) as CDDBAL,
                         nvl(sum(CDCBAL), 0) as CDCBAL
                  from ic5
                  group by AC_DATE, id, substr(br, 1, 4)
                  union
                  select AC_DATE,
                         id,
                         substr(br, 1, 4)    as br,
                         nvl(sum(CDDBAL), 0) as CDDBAL,
                         nvl(sum(CDCBAL), 0) as CDCBAL
                  from ic6
                  group by AC_DATE, id, substr(br, 1, 4)
                  union
                  select AC_DATE,
                         id,
                         substr(br, 1, 4)    as br,
                         nvl(sum(CDDBAL), 0) as CDDBAL,
                         nvl(sum(CDCBAL), 0) as CDCBAL
                  from ic7
                  group by AC_DATE, id, substr(br, 1, 4))

  select b.branch_code
       , ifnull((select vdate from par), a.ac_date)                           ac_date
       , round(nvl(a.CDCBAL, 0) + nvl(a.CDDBAL, 0), 2)                     as bal
       , round(round(nvl(a.CDCBAL, 0) + nvl(a.CDDBAL, 0), 2) / 1000000, 2) as balM
       , b.id
       , b.descip
  from brn b
         left join all_ic a
                   on b.id = a.id and b.branch_code = a.br
  order by 1, 5
`;
