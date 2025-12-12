// routes/api/questions.js
const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');

const DATA_PATH = path.join(__dirname, '../../data/questions.json');

// helper to shuffle array
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

router.get('/', async (req, res) => {
  try {
    const count = parseInt(req.query.count, 10) || 10;
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
   
    // pick random `count` items without exact duplicates
    const shuffled = shuffle([...data]);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    res.json({ source: 'local', questions: selected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Could not load questions' });
  }
});


module.exports = router;
