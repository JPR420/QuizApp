// routes/api/leaderboard.js
const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// GET /api/leaderboard
router.get('/', async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find({}, 'username scores');

        // Calculate average of last 10 quizzes
        const leaderboard = users.map(user => {
            const sortedScores = user.scores
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
                .slice(0, 10); // last 10 quizzes

            const totalScore = sortedScores.reduce((sum, quiz) => sum + quiz.score, 0);
            const totalMax = sortedScores.reduce((sum, quiz) => sum + quiz.total, 0);

            const average = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

            return {
                username: user.username,
                averageScore: average.toFixed(2), // percentage
                quizzesCount: sortedScores.length
            };
        });

        // Sort descending by averageScore
        leaderboard.sort((a, b) => b.averageScore - a.averageScore);

        // Take top 10
        const top10 = leaderboard.slice(0, 10);

        res.json({ leaderboard: top10 });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
