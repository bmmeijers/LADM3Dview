require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors'); 
const path = require('path');

const app = express();
const port = process.env.PORT || 4547;

app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Binh1234567',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '5432',
  database: process.env.DB_NAME || 'LADMInfor',
};

const client = new Client(dbConfig);

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });

app.options('/query/queryall', cors());

app.get('/api/all', (req, res) => {
  const sqlQuery = 'SELECT * FROM public.t_apartment';
  client.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing SQL query', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json({ rows: result.rows });
    }
  });
});

app.get("/api/:table/:id.json", (req, res) => {
  const params = req.params;
  let table = null, columnName = null;
  let id = params.id;
  switch(params.table) {
    case 'LA_SpatialUnit':
      table = 'LA_SpatialUnit';
      columnName = 'suID';
      break;
    case 'LA_Party':
      table = 'LA_Party';
      columnName = 'Party_id';
      break;
    case 'LA_RRR':
      table = 'LA_RRR';
      columnName = 'rID';
      break;
    case 'LA_BAUnit':
      table = 'LA_BAUnit';
      columnName = 'id';
      break;
    default:
      table = null;
      columnName = null;
      break;
  }
  if (table === null) {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    const query = `SELECT * FROM "${table}" WHERE "${columnName}" = $1`;
    const preparedQuery = {
      text: query,
      values: [id]
    };
    client.query(preparedQuery, (err, result) => {
      if (err) {
        console.error('Error executing SQL query', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json({ rows: result.rows });
      }
    });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
