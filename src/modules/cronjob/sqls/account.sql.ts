export const account = () => `

with  par as (select ? as vdate from dual),

O_CA as (
select ddtmst.OPEN_DATE,
       concat(substr(ddtmst.OPEN_BR, 1, 4), '00') as branch ,
       ddtmst.PROD_CODE,
       bptpdme.PRDT_NAME,
       count(ac) as count,
       'CASA' as type,
       'OPEN' as con
from ddtmst
left outer join core001.bptpdme on ddtmst.PROD_CODE=bptpdme.PRDT_CODE
where ddtmst.OPEN_DATE = (select vdate from par)
group by ddtmst.OPEN_DATE,
         concat(substr(ddtmst.OPEN_BR, 1, 4), '00'),
         bptpdme.PRDT_NAME ),

O_TD as (
select a.OPEN_DATE,
       concat(substr(a.AC_BR, 1, 4), '00') as branch ,
       a.PROD_CD,
       bptpdme.PRDT_NAME,
       count(ac) as count,
       'TD' as type,
       'OPEN' as con
from tdtsmst a
left outer join core001.bptpdme on a.PROD_CD=bptpdme.PRDT_CODE
where a.OPEN_DATE = (select vdate from par)
group by a.OPEN_DATE,
         concat(substr(a.AC_BR, 1, 4), '00'),
         bptpdme.PRDT_NAME ),


C_CA as (
select ddtmst.CLOSE_DATE,
       concat(substr(ddtmst.OPEN_BR, 1, 4), '00') as branch ,
       ddtmst.PROD_CODE,
       bptpdme.PRDT_NAME,
       count(ac) as count,
       'CASA' as type,
       'CLOSE' as con
from ddtmst
left outer join core001.bptpdme on ddtmst.PROD_CODE=bptpdme.PRDT_CODE
where ddtmst.CLOSE_DATE = (select vdate from par)
group by ddtmst.CLOSE_DATE,
         concat(substr(ddtmst.OPEN_BR, 1, 4), '00'),
         bptpdme.PRDT_NAME ),

C_TD as (
select a.CLO_DATE,
       concat(substr(a.AC_BR, 1, 4), '00') as branch ,
       a.PROD_CD,
       bptpdme.PRDT_NAME,
       count(ac) as count,
       'TD' as type,
       'CLOSE' as con
from tdtsmst a
left outer join core001.bptpdme on a.PROD_CD=bptpdme.PRDT_CODE
where a.CLO_DATE = (select vdate from par)
group by a.CLO_DATE,
         concat(substr(a.AC_BR, 1, 4), '00'),
         bptpdme.PRDT_NAME )

select * from O_CA
union all
select * from O_TD
union all
select * from C_CA
union all
select * from C_TD
`;
