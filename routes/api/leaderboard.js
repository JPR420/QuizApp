// routes/api/leaderboard.js
const express = require('express');
const pool = require('../../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        u.username,
        ROUND(
          (SUM(s.score)::numeric / NULLIF(SUM(s.total), 0)) * 100,
          2
        ) AS "averageScore",
        COUNT(*) AS "quizzesCount"
      FROM users u
      JOIN scores s ON s.user_id = u.id
      GROUP BY u.username
      ORDER BY "averageScore" DESC
      LIMIT 10;
    `);

    res.json({ leaderboard: rows });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
