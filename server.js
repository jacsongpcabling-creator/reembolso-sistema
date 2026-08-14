const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./reembolso.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    valor_km REAL DEFAULT 1.00,
    origem TEXT DEFAULT ''
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS nfs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT,
    estabelecimento TEXT,
    destino TEXT,
    data TEXT,
    km REAL,
    valor REAL,
    obs TEXT
  )`);
  db.run(`INSERT OR IGNORE INTO config (id, valor_km, origem) VALUES (1, 1.00, 'R. Fabiano Alves, 105 - Vila Prudente, São Paulo - SP, 03139-010')`);
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/config', (req, res) => {
  db.get('SELECT * FROM config WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.put('/api/config', (req, res) => {
  const { valor_km, origem } = req.body;
  db.run('UPDATE config SET valor_km = ?, origem = ? WHERE id = 1',
    [valor_km, origem], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});

app.get('/api/nfs', (req, res) => {
  db.all('SELECT * FROM nfs ORDER BY id', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/nfs', (req, res) => {
  const { numero, estabelecimento, destino, data, km, valor, obs } = req.body;
  db.run(
    'INSERT INTO nfs (numero, estabelecimento, destino, data, km, valor, obs) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [numero, estabelecimento, destino, data, km, valor, obs],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, success: true });
    }
  );
});

app.delete('/api/nfs/:id', (req, res) => {
  db.run('DELETE FROM nfs WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Sistema rodando em http://localhost:${PORT}`);
});
