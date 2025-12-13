const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); 

// GET /api/trivia
router.get('/', async (req, res) => {
    try {
        // Get query params, defaulting to 10 questions, category 9 (General Knowledge)
        const amount = req.query.amount || 10;
        const category = req.query.category || 9; 
        const difficulty = req.query.difficulty || 'easy';
        const type = req.query.type || 'multiple';

        const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.response_code !== 0) {
            return res.status(500).json({ error: 'Failed to fetch questions from Trivia API' });
        }

        // Format questions to match frontend format
        const questions = data.results.map(q => {
            // shuffle choices
            const choices = [...q.incorrect_answers, q.correct_answer]
                .map(ans => decodeHTML(ans))
                .sort(() => Math.random() - 0.5);
            
            return {
                question: decodeHTML(q.question),
                A: choices[0],
                B: choices[1],
                C: choices[2],
                D: choices[3],
                answer: ['A','B','C','D'][choices.indexOf(decodeHTML(q.correct_answer))]
            };
        });

        res.json({ questions });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


function decodeHTML(html) {
    return html.replace(/&quot;/g, '"')
               .replace(/&#039;/g, "'")
               .replace(/&amp;/g, "&")
               .replace(/&eacute;/g, "é")
               .replace(/&ouml;/g, "ö");
}

module.exports = router;
