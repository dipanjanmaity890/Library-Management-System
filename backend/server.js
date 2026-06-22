require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection using Pool for serverless resilience
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library_management_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
db.query('SELECT 1', (err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database via Pool');
  }
});

// Utility to generate IDs (since schema doesn't have AUTO_INCREMENT for most tables)
const generateId = (table, idColumn) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT MAX(${idColumn}) AS maxId FROM ${table}`, (err, results) => {
            if (err) return reject(err);
            resolve((results[0].maxId || 0) + 1);
        });
    });
};

// API Routes
app.get('/api/status', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) {
      return res.json({ status: 'disconnected', error: err.message });
    }
    res.json({ status: 'connected' });
  });
});

app.get('/api/books', (req, res) => {
  const query = `
    SELECT b.book_id, b.title, b.author, b.price, b.available_copies, 
           p.pub_name AS publisher, c.category_name AS category
    FROM Books b
    LEFT JOIN Publisher p ON b.pub_id = p.pub_id
    LEFT JOIN Category c ON b.category_id = c.category_id
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
    SELECT br.borrow_id, m.name AS member_name, b.title AS book_title, 
           br.issue_date, br.due_date, br.return_date, l.librarian_name
    FROM Borrows br
    JOIN Member m ON br.memb_id = m.memb_id
    JOIN Books b ON br.book_id = b.book_id
    LEFT JOIN Librarian l ON br.librarian_id = l.librarian_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Dropdown Endpoints
app.get('/api/publishers', (req, res) => {
  db.query('SELECT pub_id, pub_name FROM Publisher', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/categories', (req, res) => {
  db.query('SELECT category_id, category_name FROM Category', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/librarians', (req, res) => {
  db.query('SELECT librarian_id, librarian_name FROM Librarian', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/fines', (req, res) => {
  db.query('SELECT * FROM Fine', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create Endpoints
app.post('/api/books', async (req, res) => {
  try {
      const { title, author, price, available_copies, pub_id, category_id } = req.body;
      const newId = await generateId('Books', 'book_id');
      const query = 'INSERT INTO Books (book_id, title, author, price, available_copies, pub_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [newId, title, author, price, available_copies, pub_id, category_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Book added successfully', id: newId });
      });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/members', async (req, res) => {
  try {
      const { name, address, memb_type } = req.body;
      const newId = await generateId('Member', 'memb_id');
      const memb_date = new Date().toISOString().split('T')[0];
      const expiry_date = new Date();
      expiry_date.setFullYear(expiry_date.getFullYear() + 1);
      const formattedExpiry = expiry_date.toISOString().split('T')[0];

      const query = 'INSERT INTO Member (memb_id, name, address, memb_type, memb_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(query, [newId, name, address, memb_type, memb_date, formattedExpiry], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Member added successfully', id: newId });
      });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/borrows', (req, res) => {
  const { memb_id, book_id, librarian_id } = req.body;
  const issue_date = new Date().toISOString().split('T')[0];
  const due_date = new Date();
  due_date.setDate(due_date.getDate() + 14);
  const formattedDueDate = due_date.toISOString().split('T')[0];

  // borrow_id is AUTO_INCREMENT
  const borrowQuery = 'INSERT INTO Borrows (memb_id, book_id, issue_date, due_date, librarian_id) VALUES (?, ?, ?, ?, ?)';
  db.query(borrowQuery, [memb_id, book_id, issue_date, formattedDueDate, librarian_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Decrement copies
    const updateBookQuery = 'UPDATE Books SET available_copies = available_copies - 1 WHERE book_id = ? AND available_copies > 0';
    db.query(updateBookQuery, [book_id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Borrowing transaction successful' });
    });
  });
});

app.put('/api/borrows/:id/return', (req, res) => {
  const { id } = req.params; // borrow_id
  const { book_id } = req.body;
  const return_date = new Date().toISOString().split('T')[0];

  const returnQuery = 'UPDATE Borrows SET return_date = ? WHERE borrow_id = ?';
  db.query(returnQuery, [return_date, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Increment copies
    const updateBookQuery = 'UPDATE Books SET available_copies = available_copies + 1 WHERE book_id = ?';
    db.query(updateBookQuery, [book_id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Book returned successfully' });
    });
  });
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Books WHERE book_id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Book deleted successfully' });
  });
});

app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Member WHERE memb_id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Member deleted successfully' });
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
