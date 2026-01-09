// routes/api/score.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../../middleware/auth');
const pool = require('../../db');

// Save a score
router.post('/save', requireAuth, async (req, res) => {
  try {
    const { score, totalQuestions, details } = req.body;

    if (!score || !totalQuestions) {
      return res.status(400).json({ message: 'Missing score or totalQuestions' });
    }

    const userId = req.user.id;

    const { rows } = await pool.query(
      `
      INSERT INTO scores (user_id, score, total, details)
      VALUES ($1, $2, $3, $4)
      RETURNING id, score, total, details, created_at
      `,
      [userId, score, totalQuestions, details || []]
    );

    res.json({
      message: 'Score saved',
      score: rows[0]
    });
  } catch (err) {
    console.error('Save score error:', err);
    res.status(500).json({ message: 'Could not save score' });
  }
});

module.exports = router;
