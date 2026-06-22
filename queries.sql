-- queries.sql
-- Advanced SQL Query Demonstrations for Library Management System

-- DIPANJAN
USE LibraryManagementSystem;

-- 1. Basic JOIN Query: Get all books along with their publisher names
SELECT 
    b.Title, 
    b.Author, 
    p.Name AS Publisher_Name 
FROM Books b
JOIN Publisher p ON b.Pub_ID = p.Pub_ID;

-- 2. Aggregation & GROUP BY: Count the number of books published by each publisher
SELECT 
    p.Name AS Publisher_Name, 
    COUNT(b.Book_id) AS Number_of_Books
FROM Publisher p
LEFT JOIN Books b ON p.Pub_ID = b.Pub_ID
GROUP BY p.Pub_ID, p.Name;

-- 3. Complex JOIN with filtering: Find all members who currently have a book overdue

-- SURYANJALI
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

-- 4. Subquery: Find books that have a price higher than the average price of all books
SELECT 
    Title, 
    Price 
FROM Books 
WHERE Price > (SELECT AVG(Price) FROM Books);

-- 5. View Usage: Query the active borrowings view we created in schema.sql
SELECT * FROM Active_Borrowings;

-- 6. Window Function (Advanced): Rank members by the total number of times they have borrowed books
SELECT 
    m.Name, 
    COUNT(br.Borrow_id) AS Total_Borrows,
    RANK() OVER (ORDER BY COUNT(br.Borrow_id) DESC) AS Borrow_Rank
FROM Member m
LEFT JOIN Borrows br ON m.Memb_id = br.Memb_id
GROUP BY m.Memb_id, m.Name;
