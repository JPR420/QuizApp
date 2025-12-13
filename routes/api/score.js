// routes/api/score.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../../middleware/auth');
const user = require('../../models/user'); // use User model

// Save a score
router.post('/save', requireAuth, async (req, res) => {
  try {
    const { score, totalQuestions, details } = req.body;


    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    // Push new score into user's scores array
    req.user.scores.push({
      score,
      total: totalQuestions,
      details: details 
    });

    await req.user.save();

    res.json({ message: 'Score saved', scores: req.user.scores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save score' });
  }
});

module.exports = router;
