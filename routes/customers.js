const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Customer tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { full_name, email, phone, address } = req.body;
    const result = await pool.query(
      'INSERT INTO customers (full_name, email, phone, address) VALUES ($1,$2,$3,$4) RETURNING *',
      [full_name, email, phone, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { full_name, email, phone, address } = req.body;
    const result = await pool.query(
      'UPDATE customers SET full_name=$1, email=$2, phone=$3, address=$4 WHERE id=$5 RETURNING *',
      [full_name, email, phone, address, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Customer tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM customers WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Customer tidak ditemukan' });
    res.json({ message: 'Customer berhasil dihapus', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;