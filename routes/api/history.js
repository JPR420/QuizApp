// routes/api/history.js
const express = require('express');
const requireAuth = require('../../middleware/auth');
const db = require('../../db'); // pg Pool

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await db.query(
      `
      SELECT
        id,
        score,
        total,
        details,
        created_at
      FROM scores
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ message: 'Failed to fetch quiz history' });
  }
});

module.exports = router;
