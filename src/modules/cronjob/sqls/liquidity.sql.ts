export const liquidity = () => `
  with par as (select ? as vdate from dual),

       rates as (select eff_dt, ccy, buy from r_bpttqph where exr_typ = 'SMR' and eff_dt = (select vdate from par)),

       Liquiditys as (select ac_date,
                             concat(substr(br, 1, 4), '00')                                                    as br,
                             case
                               when substr(itm_no, 1, 7) in ('1101100', '1101200', '1101600') then 'ເງິນສົດ'
                               when substr(itm_no, 1, 7) in ('1121110') then 'ເງິນຝາກກະແສລາຍວັນ ທຫລ'
                               when substr(itm_no, 1, 7) in ('1131110') then 'ເງິນຝາກກະແສລາຍວັນ ທະນາຄານອື່ນ'
                               when substr(itm_no, 1, 7) in ('1131151') then 'ເງິນຝາກປະຈຳ  ທະນາຄານອື່ນ'
                               when substr(itm_no, 1, 7) in ('1302111') then 'ພັນທະບັດ ທຫລ 7 ວັນ'
                               when substr(itm_no, 1, 7) in ('1131210') then 'ເງິນຝາກທະນາຄານອື່ນ ຕ່າງປະເທດ'
                               else 'OTHER'
                               end                                                                             as type,
                             case
                               when substr(itm_no, 1, 7) in ('1101100', '1101200', '1101600') then 'CASH'
                               when substr(itm_no, 1, 7) in ('1121110') then 'BOL_CURT'
                               when substr(itm_no, 1, 7) in ('1131110') then 'BANK_CURT'
                               when substr(itm_no, 1, 7) in ('1131151') then 'BANK_TD'
                               when substr(itm_no, 1, 7) in ('1302111') then 'BOL_BLOND'
                               when substr(itm_no, 1, 7) in ('1131210') then 'BANK_FORE'
                               else 'OTHER'
                               end                                                                             as typeID,
                             ccy,
                             case
                               when nvl(cddbal, 0) < 0 then (nvl(cddbal, 0) * (-1))
                               else nvl(cddbal, 0) end                                                         as cddbal,
                             cdcbal
                      from AITHMST
                      where AC_DATE = (select vdate from par)
                        and length(itm_no) = '7'
                        and (
                        substr(itm_no, 1, 7) in ('1101100', '1101200', '1101600',
                                                 '1121110',
                                                 '1131110', '1131210',
                                                 '1131151',
                                                 '1302111'
                          )
                        )),

       Liquiditys_all as (select a.AC_DATE,
                                 a.br,
                                 a.type,
                                 a.typeID,
                                 a.ccy,
                                 a.cddbal,
                                 case
                                   when b.buy > 0 then round(nvl(a.CDDBAL, 0) * nvl(b.buy, 0), 2)
                                   else nvl(a.CDDBAL, 0) * (1) end cddlak,
                                 CDCBAL,
                                 case
                                   when b.buy > 0 then round(nvl(a.CDCBAL, 0) * nvl(b.buy, 0), 2)
                                   else nvl(a.CDCBAL, 0) * (1) end cdclak
                          from Liquiditys a
                                 left outer join rates b on a.AC_DATE = b.eff_dt
                            and a.CCY = b.ccy
                          where (a.CDCBAL <> 0 or a.cddbal <> 0))

  select ac_date,
         br,
         type,
         typeID,
         ccy,
         nvl(sum(cddbal), 0) as cddbal,
         nvl(sum(cddlak), 0) as cddlak,
         nvl(sum(cdcbal), 0) as cdcbal,
         nvl(sum(cdclak), 0) as cdclak
  from Liquiditys_all
  group by ac_date, br, type, typeID, ccy;
`;
