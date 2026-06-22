SELECT 
    m.Name, 
    m.Email, 
    b.Title, 
    br.Due_date, 
    DATEDIFF(CURDATE(), br.Due_date) AS Days_Overdue
FROM Member m
JOIN Borrows br ON m.Memb_id = br.Memb_id
JOIN Books b ON br.Book_id = b.Book_id
WHERE br.Return_date IS NULL 
  AND br.Due_date < CURDATE();

-- Subquery: Find books that have a price higher than the average price of all books
SELECT 
    Title, 
    Price 
FROM Books 
WHERE Price > (SELECT AVG(Price) FROM Books);

--  View Usage: Query the active borrowings view we created in schema.sql
SELECT * FROM Active_Borrowings;

--  Window Function (Advanced): Rank members by the total number of times they have borrowed books
SELECT 
    m.Name, 
    COUNT(br.Borrow_id) AS Total_Borrows,
    RANK() OVER (ORDER BY COUNT(br.Borrow_id) DESC) AS Borrow_Rank
FROM Member m
LEFT JOIN Borrows br ON m.Memb_id = br.Memb_id
GROUP BY m.Memb_id, m.Name
