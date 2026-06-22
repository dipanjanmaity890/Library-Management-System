
-- ALTER operations (Demonstrating ALTER as required)
-- Let's add an email constraint or similar to the Member table.

-- ANUSHKA
ALTER TABLE Member ADD COLUMN Email VARCHAR(100) UNIQUE;

-- Create Indexes to optimize queries
CREATE INDEX idx_books_title ON Books(Title);
CREATE INDEX idx_borrows_memb_id ON Borrows(Memb_id);
CREATE INDEX idx_borrows_book_id ON Borrows(Book_id);

-- Create a View for Active Borrowings (Books currently borrowed and not returned)
CREATE VIEW Active_Borrowings AS
SELECT 
    b.Borrow_id, 
    m.Name AS Member_Name, 
    bk.Title AS Book_Title, 
    b.Issue_date, 
    b.Due_date 
FROM Borrows b
JOIN Member m ON b.Memb_id = m.Memb_id
JOIN Books bk ON b.Book_id = bk.Book_id
WHERE b.Return_date IS NULL;
