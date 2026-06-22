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
  db.query('SELECT * FROM Publisher', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM Category', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/librarians', (req, res) => {
  db.query('SELECT * FROM Librarian', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/authors', (req, res) => {
  db.query('SELECT * FROM Author', (err, results) => {
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
      const { title, author_id, price, available_copies, pub_id, category_id } = req.body;
      const newId = await generateId('Books', 'book_id');
      
      db.query('SELECT author_name FROM Author WHERE author_id = ?', [author_id], (err, authorResults) => {
          if (err || authorResults.length === 0) return res.status(400).json({ error: 'Author not found' });
          const author_name = authorResults[0].author_name;
          
          const query = 'INSERT INTO Books (book_id, title, author, price, available_copies, pub_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
          db.query(query, [newId, title, author_name, price, available_copies, pub_id, category_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            db.query('INSERT INTO Book_Author (book_id, author_id) VALUES (?, ?)', [newId, author_id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Book added successfully', id: newId });
            });
          });
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

// Publishers CRUD
app.post('/api/publishers', async (req, res) => {
  try {
      const { pub_name, address } = req.body;
      const newId = await generateId('Publisher', 'pub_id');
      db.query('INSERT INTO Publisher (pub_id, pub_name, address) VALUES (?, ?, ?)', [newId, pub_name, address], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Publisher added successfully' });
      });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/publishers/:id', (req, res) => {
  db.query('DELETE FROM Publisher WHERE pub_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Publisher deleted' });
  });
});

// Categories CRUD
app.post('/api/categories', async (req, res) => {
  try {
      const { category_name } = req.body;
      const newId = await generateId('Category', 'category_id');
      db.query('INSERT INTO Category (category_id, category_name) VALUES (?, ?)', [newId, category_name], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Category added successfully' });
      });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/categories/:id', (req, res) => {
  db.query('DELETE FROM Category WHERE category_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Category deleted' });
  });
});

// Authors CRUD
app.post('/api/authors', async (req, res) => {
  try {
      const { author_name, country } = req.body;
      const newId = await generateId('Author', 'author_id');
      db.query('INSERT INTO Author (author_id, author_name, country) VALUES (?, ?, ?)', [newId, author_name, country], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Author added successfully' });
      });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/authors/:id', (req, res) => {
  db.query('DELETE FROM Author WHERE author_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Author deleted' });
  });
});

// Librarians CRUD
app.post('/api/librarians', async (req, res) => {
  try {
      const { librarian_name, email, phone } = req.body;
      const newId = await generateId('Librarian', 'librarian_id');
      db.query('INSERT INTO Librarian (librarian_id, librarian_name, email, phone) VALUES (?, ?, ?, ?)', [newId, librarian_name, email, phone], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Librarian added successfully' });
      });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/librarians/:id', (req, res) => {
  db.query('DELETE FROM Librarian WHERE librarian_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Librarian deleted' });
  });
});

// Fines CRUD
app.post('/api/fines', async (req, res) => {
  try {
      const { borrow_id, amount, status } = req.body;
      const newId = await generateId('Fine', 'fine_id');
      db.query('INSERT INTO Fine (fine_id, borrow_id, amount, status) VALUES (?, ?, ?, ?)', [newId, borrow_id, amount, status], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Fine added successfully' });
      });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/fines/:id', (req, res) => {
  db.query('DELETE FROM Fine WHERE fine_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Fine deleted' });
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
