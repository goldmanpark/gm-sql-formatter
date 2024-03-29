select 'AAA' AS X, 1 AS Y,  (select sysdate from dual) AS Z  from dual where 1=1 and 2=2 and 3 <> 4;

    SELECT  (   SELECT  sysdate
                    ,   1
                    ,   'AS'
                  FROM  DUAL
            ) AS X
        ,   'AAA' AS Y
        ,   1313 AS Z
      FROM  DUAL
     WHERE  1 = 1
       AND  2 = 2
       AND  3 <> 4;

    SELECT  X.*
      FROM  (   SELECT  sysdate
                    ,   'AAA'
                  FROM  DUAL
            ) AS X, Y, Z, (select 1) AS ZZ;

    SELECT  E.EMPID
        ,   C.CCC
        ,   J.X
      FROM  Employee E
INNER JOIN  Customer C
        ON  C.EMPID = E.EMPID
INNER JOIN  ( SELECT  A.X, A.Y FROM TEMP A
                LEFT JOIN  TEMP B
                on  B.X = A.X
                where A.aaa = A.bbb + 1 ) AS J
        ON  J.X = C.X
        AND J.XX > 100 + C.XX
     WHERE  1 = 1
     and 1 = 1 + 0;

select 
case when 1=1 then X.a
when 1 is null then 10
when 1 is null then 'xxx'
when 1 < 2 then X.b + Y.B
else X.b % 10 end
  from (
    select X.A, Y.B
    from TABLE_X AS X
    join TABLE_Y AS Y on Y.A = X.A and 1=1
    join (select 1 AS aaa from K) K on K.aaa = X.B
    where 1=1 and 'a' <> 'b'
  );

--https://www.complexsql.com/complex-sql-queries-examples-with-answers/
Select E.id, E.name as ENAME from Employee E where Rowid= (select min(Rowid) from Employee);

--https://www.complexsql.com/complex-sql-queries-examples-with-answers/*/
Select * from Employee e where rownum <=5

union

select * from (Select * from Employee e order by rowid desc) where rownum <=5;

--https://mode.com/sql-tutorial/sql-sub-queries/
SELECT COUNT(*) AS total_rows
  FROM (
        SELECT *
          FROM tutorial.crunchbase_investments_part1

         UNION ALL

        SELECT *
          FROM tutorial.crunchbase_investments_part2
       ) sub

--https://www.sqlshack.com/learn-sql-how-to-write-a-complex-select-query/
SELECT 
	country.country_name_eng,
	SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls,
	AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
FROM country 
LEFT JOIN city ON city.country_id = country.id
LEFT JOIN customer ON city.id = customer.city_id
LEFT JOIN callx ON callx.customer_id = customer.id
GROUP BY 
	country.id,
	country.country_name_eng
HAVING AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) > (SELECT AVG(DATEDIFF(SECOND, call.start_time, call.end_time)) FROM callx)
AND callx.start_time > getdate()
ORDER BY calls DESC, country.id ASC;


  select  getdate() AS dt
  ,       ISNULL(NULLIF(SUB.s, 0), 'N/A') as RESULT
  from    MAIN AS M
  join    (select sub.id, sum(CASE WHEN sub.id % 2 = 0 THEN 1 ELSE 0 END) s from SUB where sub.id > 10 group by sub.id) as SUB
  on  sub.id = M.id
  order by sub.id;

  select * from X where x.dt between '2022.01.01' and '2022.12.31';

--https://www.w3schools.com/sql/sql_exists.asp
SELECT SupplierName
FROM Suppliers
WHERE EXISTS (SELECT ProductName FROM Products WHERE Products.SupplierID = Suppliers.supplierID AND Price < 20)
and 1=1 or null is null;

SELECT SupplierName
FROM Suppliers
WHERE NOT EXISTS (SELECT ProductName FROM Products WHERE Products.SupplierID = Suppliers.supplierID AND Price < 20);

select top 4 xxx from x