const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pets ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pets WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pet tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customer_id, name, species, breed, birth_date, gender } = req.body;
    const result = await pool.query(
      'INSERT INTO pets (customer_id, name, species, breed, birth_date, gender) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [customer_id, name, species, breed, birth_date, gender]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { customer_id, name, species, breed, birth_date, gender } = req.body;
    const result = await pool.query(
      'UPDATE pets SET customer_id=$1, name=$2, species=$3, breed=$4, birth_date=$5, gender=$6 WHERE id=$7 RETURNING *',
      [customer_id, name, species, breed, birth_date, gender, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pet tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM pets WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pet tidak ditemukan' });
    res.json({ message: 'Pet berhasil dihapus', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;