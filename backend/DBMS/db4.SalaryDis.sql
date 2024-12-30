SELECT location, pay_period, 
       AVG(min_salary) AS avg_min_salary, 
       AVG(med_salary) AS avg_med_salary, 
       AVG(max_salary) AS avg_max_salary
FROM posting
GROUP BY location, pay_period;