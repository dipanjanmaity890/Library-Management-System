const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
  host: '34.63.32.231',
  user: 'root',
  password: 'library_root_password',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
  console.log('Connected to Cloud SQL!');

  const schemaSql = fs.readFileSync(path.join(__dirname, '1-schema.sql'), 'utf8');
  const opsSql = fs.readFileSync(path.join(__dirname, '2-operations.sql'), 'utf8');

  console.log('Dropping old database if exists...');
  connection.query('DROP DATABASE IF EXISTS LibraryManagementSystem;', (err) => {
      if(err) console.error(err);

      console.log('Running 1-schema.sql...');
      connection.query(schemaSql, (err, results) => {
        if (err) {
          console.error('Error running schema:', err);
          process.exit(1);
        }
        console.log('Schema executed.');

        console.log('Running 2-operations.sql...');
        connection.query(opsSql, (err, results) => {
          if (err) {
            console.error('Error running operations:', err);
            process.exit(1);
          }
          console.log('Operations executed.');
          console.log('Database successfully migrated!');
          connection.end();
        });
      });
  });
});
