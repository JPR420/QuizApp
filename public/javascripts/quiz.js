let questions = [], cur = 0, score = 0;
let details = []; 






async function load() {


  var count = 10 ;
  localStorage.setItem('lastCount', count);

  const res = await fetch(`/api/questions?count=${count}`);
  const data = await res.json();

  if (!data.questions || !data.questions.length) {
    document.getElementById('container').innerHTML = 'No questions available';
    return;
  }

  questions = data.questions.map(q => {
    const choices = [q.A, q.B, q.C, q.D];
    const correct = 'ABCD'.indexOf(q.answer);
    return { question: q.question, choices, correct };
  });

  render();
}

function render() {
  const c = document.getElementById('container');

  if (cur >= questions.length) {
    // user finished quiz — save results
    localStorage.setItem('lastScore', score);
    localStorage.setItem('lastTotal', questions.length);
    localStorage.setItem('lastDetails', JSON.stringify(details));


    const token = localStorage.getItem('token');


    if (token) {
        console.log('Saving details:', details);

        fetch('/api/score/save', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            credentials: 'include', 
            body: JSON.stringify({ 
                score, 
                totalQuestions: questions.length,
                details
             })
          }).catch(()=>{});

    console.log('Answerd saved')
    }

    window.location.href = '/result.html';
    return;
  }
  
  const q = questions[cur];
  const choicesHtml = q.choices.map((ch, i) =>
    `<button onclick="choose(${i})">${ch}</button>`).join('<br/>');

  c.innerHTML = `<div><strong>Q${cur+1}.</strong> ${q.question}</div>
                 <div>${choicesHtml}</div>
                 <div>Progress: ${cur+1}/${questions.length}</div>`;

}


function choose(index) {
    const q = questions[cur];
    
    // Save the user's answer in details
    details.push({
      question: q.question,
      selected: q.choices[index],
      correct: q.choices[q.correct]
    });
  
    if (index === q.correct) score++;
    cur++;
    render();
  }

  async function checkLogin() {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) {
        alert('You must be logged in to play the quiz.');
        window.location.href = '/login.html';
        throw new Error('Not logged in'); // stops further code
    }
}

async function init() {
    await checkLogin(); // wait for login check
    load(); // only load quiz if logged in
}

init();
