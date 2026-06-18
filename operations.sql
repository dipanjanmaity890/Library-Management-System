-- operations.sql
-- DML operations for Library Management System
USE LibraryManagementSystem;

-- INSERT Operations
-- 1. Insert Publishers
INSERT INTO Publisher (Name, Address) VALUES 
('Penguin Random House', '1745 Broadway, New York, NY'),
('HarperCollins', '195 Broadway, New York, NY'),
('O''Reilly Media', '1005 Gravenstein Highway North, Sebastopol, CA');

-- 2. Insert Members
INSERT INTO Member (Name, Address, Memb_type, Memb_date, Expiry_date, Email) VALUES 
('Alice Smith', '123 Apple St, NY', 'Student', '2023-01-15', '2024-01-15', 'alice@example.com'),
('Bob Johnson', '456 Banana Rd, CA', 'Faculty', '2022-05-20', '2025-05-20', 'bob@example.com'),
('Charlie Brown', '789 Cherry Blvd, TX', 'Student', '2023-08-10', '2024-08-10', 'charlie@example.com');

-- 3. Insert Books
INSERT INTO Books (Title, Price, Available, Author, Pub_ID) VALUES 
('The Great Gatsby', 15.99, TRUE, 'F. Scott Fitzgerald', 1),
('1984', 12.50, TRUE, 'George Orwell', 2),
('Designing Data-Intensive Applications', 45.00, TRUE, 'Martin Kleppmann', 3),
('Learning SQL', 35.00, TRUE, 'Alan Beaulieu', 3);

-- 4. Insert Borrows
-- Alice borrows '1984'
INSERT INTO Borrows (Memb_id, Book_id, Issue_date, Due_date, Return_date) VALUES 
(1, 2, '2023-10-01', '2023-10-15', '2023-10-10');
-- Update book availability (Alice returned it)
UPDATE Books SET Available = TRUE WHERE Book_id = 2;

-- Bob borrows 'Learning SQL' (currently active)
INSERT INTO Borrows (Memb_id, Book_id, Issue_date, Due_date, Return_date) VALUES 
(2, 4, '2023-10-25', '2023-11-08', NULL);
-- Update book availability (Bob has not returned it)
UPDATE Books SET Available = FALSE WHERE Book_id = 4;

-- Charlie borrows 'Designing Data-Intensive Applications' (currently active, overdue)
INSERT INTO Borrows (Memb_id, Book_id, Issue_date, Due_date, Return_date) VALUES 
(3, 3, '2023-09-01', '2023-09-15', NULL);
-- Update book availability (Charlie has not returned it)
UPDATE Books SET Available = FALSE WHERE Book_id = 3;


-- UPDATE Operations
-- Update a member's address
UPDATE Member 
SET Address = '999 New Pine Dr, TX' 
WHERE Name = 'Charlie Brown';

-- Update a book's price
UPDATE Books 
SET Price = 49.99 
WHERE Title = 'Designing Data-Intensive Applications';


-- DELETE Operations
-- Delete a book that was lost (assuming it has no borrowing history, else need to handle FK)
-- For demonstration, let's insert a dummy book and delete it
INSERT INTO Books (Title, Price, Available, Author, Pub_ID) VALUES ('Dummy Book', 5.00, TRUE, 'Nobody', 1);
DELETE FROM Books WHERE Title = 'Dummy Book';

-- Demonstration of Referential Integrity (Cannot delete a publisher with existing books due to ON DELETE RESTRICT)
-- DELETE FROM Publisher WHERE Pub_ID = 1; -- This would fail unless books are deleted or re-assigned first.
