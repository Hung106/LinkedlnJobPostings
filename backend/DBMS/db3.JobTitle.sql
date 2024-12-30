SELECT TOP 3000 title, location, COUNT(*) AS frequency
FROM posting
WHERE location = 'United States'
GROUP BY title, location
ORDER BY frequency DESC;