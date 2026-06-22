-- 2-operations.sql
-- DML operations for Library Management System
USE library_management_system;

-- 1. Insert Publishers
INSERT INTO Publisher (pub_id, pub_name, address) VALUES 
(1, 'Penguin Random House', '1745 Broadway, New York, NY'),
(2, 'HarperCollins', '195 Broadway, New York, NY'),
(3, 'O''Reilly Media', '1005 Gravenstein Highway North, Sebastopol, CA');

-- 2. Insert Categories
INSERT INTO Category (category_id, category_name) VALUES 
(1, 'Fiction'),
(2, 'Non-Fiction'),
(3, 'Science & Technology');

-- 3. Insert Authors
INSERT INTO Author (author_id, author_name, country) VALUES 
(1, 'F. Scott Fitzgerald', 'USA'),
(2, 'George Orwell', 'UK'),
(3, 'Martin Kleppmann', 'UK'),
(4, 'Alan Beaulieu', 'USA');

-- 4. Insert Books
-- Columns: book_id, title, author, price, available_copies, pub_id, category_id
INSERT INTO Books (book_id, title, author, price, available_copies, pub_id, category_id) VALUES 
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 15.99, 5, 1, 1),
(2, '1984', 'George Orwell', 12.50, 2, 2, 1),
(3, 'Designing Data-Intensive Applications', 'Martin Kleppmann', 45.00, 1, 3, 3),
(4, 'Learning SQL', 'Alan Beaulieu', 35.00, 3, 3, 3);

-- 5. Insert Book_Author (Junction)
INSERT INTO Book_Author (book_id, author_id) VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4);

-- 6. Insert Members
INSERT INTO Member (memb_id, name, address, memb_type, memb_date, expiry_date) VALUES 
(1, 'Alice Smith', '123 Apple St, NY', 'Student', '2023-01-15', '2024-01-15'),
(2, 'Bob Johnson', '456 Banana Rd, CA', 'Faculty', '2022-05-20', '2025-05-20'),
(3, 'Charlie Brown', '789 Cherry Blvd, TX', 'Student', '2023-08-10', '2024-08-10');

-- 7. Insert Librarians
INSERT INTO Librarian (librarian_id, librarian_name, email, phone) VALUES 
(1, 'Sarah Connor', 'sarah.lib@example.com', '555-0101'),
(2, 'John Smith', 'john.smith@example.com', '555-0102');

-- 8. Insert Borrows
-- Alice borrows '1984'
INSERT INTO Borrows (memb_id, book_id, issue_date, due_date, return_date, librarian_id) VALUES 
(1, 2, '2023-10-01', '2023-10-15', '2023-10-10', 1);

-- Bob borrows 'Learning SQL' (currently active)
INSERT INTO Borrows (memb_id, book_id, issue_date, due_date, return_date, librarian_id) VALUES 
(2, 4, '2023-10-25', '2023-11-08', NULL, 2);

-- Charlie borrows 'Designing Data-Intensive Applications' (currently active, overdue)
INSERT INTO Borrows (memb_id, book_id, issue_date, due_date, return_date, librarian_id) VALUES 
(3, 3, '2023-09-01', '2023-09-15', NULL, 1);

-- 9. Insert Fines
-- Charlie is overdue, let's add a fine. borrow_id = 3
INSERT INTO Fine (fine_id, borrow_id, amount, status) VALUES 
(1, 3, 10.50, 'Unpaid');
