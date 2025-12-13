// public/javascripts/result.js

const score = parseInt(localStorage.getItem('lastScore') || 0);
const total = parseInt(localStorage.getItem('lastTotal') || 0);
const details = localStorage.getItem('lastDetails');

const resultEl = document.getElementById('result');
resultEl.innerText = `You scored ${score} out of ${total}!`;


// Only save the score if both values exist
if (score && total) {

  console.log('Saving details:', details);

  fetch('/api/score/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      score, 
      totalQuestions: total, 
      details
    })
  })
    .then(res => res.json())
    .then(data => console.log('Score saved:', data))
    .catch(err => console.error('Could not save score:', err));
}

document.getElementById('playAgain').addEventListener('click', () => {
  window.location.href = '/quiz.html';

});
