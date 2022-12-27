select (select sysdate from dual) from dual

select sysdate from dual where 1=1 and 2=2 and 3 <> 4;

--https://www.complexsql.com/complex-sql-queries-examples-with-answers/
Select E.id, E.name as ENAME from Employee E where Rowid= (select min(Rowid) from Employee);

--https://www.sqlshack.com/sql-insert-into-select-statement-overview-and-examples/
Insert into Employees (ID, Name) values (1,'raj')
Insert into Employees values (2,'raj')

/*https://www.complexsql.com/complex-sql-queries-examples-with-answers/*/
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
LEFT JOIN call ON call.customer_id = customer.id
GROUP BY 
	country.id,
	country.country_name_eng
HAVING AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) > (SELECT AVG(DATEDIFF(SECOND, call.start_time, call.end_time)) FROM call)
ORDER BY calls DESC, country.id ASC;