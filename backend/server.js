require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'LibraryManagementSystem'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    console.log('Please ensure MySQL is running and credentials are correct.');
  } else {
    console.log('Connected to MySQL database');
  }
});

// API Routes
app.get('/api/books', (req, res) => {
  const query = `
    SELECT b.Book_id, b.Title, b.Price, b.Available, b.Author, p.Name AS Publisher
    FROM Books b
    JOIN Publisher p ON b.Pub_ID = p.Pub_ID
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/members', (req, res) => {
  const query = 'SELECT * FROM Member';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/borrows', (req, res) => {
  const query = `
    SELECT br.Borrow_id, m.Name AS Member_Name, b.Title AS Book_Title, br.Issue_date, br.Due_date, br.Return_date
    FROM Borrows br
    JOIN Member m ON br.Memb_id = m.Memb_id
    JOIN Books b ON br.Book_id = b.Book_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/status', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) {
      return res.json({ status: 'disconnected', error: err.message });
    }
    res.json({ status: 'connected' });
  });
});
app.get('/api/publishers', (req, res) => {
  const query = 'SELECT Pub_ID, Name FROM Publisher';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/books', (req, res) => {
  const { Title, Author, Price, Pub_ID } = req.body;
  const query = 'INSERT INTO Books (Title, Author, Price, Pub_ID, Available) VALUES (?, ?, ?, ?, TRUE)';
  db.query(query, [Title, Author, Price, Pub_ID], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Book added successfully', id: results.insertId });
  });
});

app.post('/api/members', (req, res) => {
  const { Name, Address, Memb_type, Email } = req.body;
  const Memb_date = new Date().toISOString().split('T')[0];
  const Expiry_date = new Date();
  Expiry_date.setFullYear(Expiry_date.getFullYear() + 1);
  const formattedExpiry = Expiry_date.toISOString().split('T')[0];

  const query = 'INSERT INTO Member (Name, Address, Memb_type, Email, Memb_date, Expiry_date) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [Name, Address, Memb_type, Email, Memb_date, formattedExpiry], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Member added successfully', id: results.insertId });
  });
});

app.post('/api/borrows', (req, res) => {
  const { Memb_id, Book_id } = req.body;
  const Issue_date = new Date().toISOString().split('T')[0];
  const Due_date = new Date();
  Due_date.setDate(Due_date.getDate() + 14);
  const formattedDueDate = Due_date.toISOString().split('T')[0];

  // Start transaction
  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const borrowQuery = 'INSERT INTO Borrows (Memb_id, Book_id, Issue_date, Due_date) VALUES (?, ?, ?, ?)';
    db.query(borrowQuery, [Memb_id, Book_id, Issue_date, formattedDueDate], (err, results) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ error: err.message }));
      }
      
      const updateBookQuery = 'UPDATE Books SET Available = FALSE WHERE Book_id = ?';
      db.query(updateBookQuery, [Book_id], (err, results) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ error: err.message }));
        }
        
        db.commit((err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ error: err.message }));
          }
          res.json({ message: 'Borrowing transaction successful' });
        });
      });
    });
  });
});

app.post('/api/publishers', (req, res) => {
  const { Name, Address } = req.body;
  const query = 'INSERT INTO Publisher (Name, Address) VALUES (?, ?)';
  db.query(query, [Name, Address], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Publisher added successfully', id: results.insertId });
  });
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Books WHERE Book_id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ error: 'Cannot delete book. It has existing borrowing records.' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Book deleted successfully' });
  });
});

app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Member WHERE Memb_id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Member deleted successfully' });
  });
});

app.put('/api/borrows/:id/return', (req, res) => {
  const { id } = req.params; // Borrow_id
  const { Book_id } = req.body;
  const returnDate = new Date().toISOString().split('T')[0];

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const returnQuery = 'UPDATE Borrows SET Return_date = ? WHERE Borrow_id = ?';
    db.query(returnQuery, [returnDate, id], (err, results) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
      
      const updateBookQuery = 'UPDATE Books SET Available = TRUE WHERE Book_id = ?';
      db.query(updateBookQuery, [Book_id], (err, results) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
        
        db.commit((err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
          res.json({ message: 'Book returned successfully' });
        });
      });
    });
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
