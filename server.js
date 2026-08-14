const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ====== CONEXÃO POSTGRESQL (SUPABASE) ======
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ====== CRIAR TABELAS (executa no primeiro boot) ======
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      valor_km REAL DEFAULT 1.00,
      origem TEXT DEFAULT ''
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS nfs (
      id SERIAL PRIMARY KEY,
      numero TEXT,
      estabelecimento TEXT,
      destino TEXT,
      data TEXT,
      km REAL,
      valor REAL,
      obs TEXT
    )
  `);
  await pool.query(`
    INSERT INTO config (id, valor_km, origem)
    VALUES (1, 1.00, 'R. Fabiano Alves, 105 - Vila Prudente, São Paulo - SP, 03139-010')
    ON CONFLICT (id) DO NOTHING
  `);
}

// ====== MIDDLEWARE ======
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ====== ROTAS DA API ======

// Configuração
app.get('/api/config', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM config WHERE id = 1');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/config', async (req, res) => {
  const { valor_km, origem } = req.body;
  try {
    await pool.query('UPDATE config SET valor_km = $1, origem = $2 WHERE id = 1', [valor_km, origem]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar NFs
app.get('/api/nfs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM nfs ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adicionar NF
app.post('/api/nfs', async (req, res) => {
  const { numero, estabelecimento, destino, data, km, valor, obs } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO nfs (numero, estabelecimento, destino, data, km, valor, obs) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [numero, estabelecimento, destino, data, km, valor, obs]
    );
    res.json({ id: result.rows[0].id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remover NF
app.delete('/api/nfs/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM nfs WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====== INICIAR SERVIDOR ======
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Sistema rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar no banco:', err.message);
    process.exit(1);
  });
