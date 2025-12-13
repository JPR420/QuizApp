async function loadProfile() {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) {
        window.location.href = '/login.html';
        return;
    }

    const data = await res.json();
    document.getElementById('username').innerText = data.user.username;

    const tbody = document.getElementById('historyBody');
    tbody.innerHTML = '';

    if (!data.user.scores || !data.user.scores.length) return;

    // Group scores by date (yyyy-mm-dd)
    const grouped = {};
    data.user.scores.forEach(score => {
        const dateKey = new Date(score.date).toISOString().split('T')[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(score);
    });

    // Create rows for each date
    Object.keys(grouped).sort().reverse().forEach(dateKey => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td >${new Date(dateKey).toLocaleDateString()}</td>
            
            <td class="reportButtonDiv" ><button class="quizapp-btn" data-date="${dateKey}">See Report</button></td>
         
        `;
        tbody.appendChild(row);
    });

    // Attach listeners
    document.querySelectorAll('[data-date]').forEach(btn => {
        btn.addEventListener('click', () => openReport(btn.dataset.date, grouped[btn.dataset.date]));
    });
}



// ------------------------------
// MODAL #1 — LIST OF QUIZZES FOR THAT DAY
// ------------------------------

function openReport(dateKey, quizzes) {
    const modal = document.getElementById('reportModal');
    const modalDate = document.getElementById('modalDate');
    const modalReports = document.getElementById('modalReports');

    modalDate.textContent = new Date(dateKey).toLocaleDateString();
    modalReports.innerHTML = '';

    // Group quizzes by (score + total)
    const quizGroups = {};
    quizzes.forEach(q => {
        const key = `${q.score}/${q.total}`;
        if (!quizGroups[key]) quizGroups[key] = [];
        quizGroups[key].push(q);
    });

    // Create a card per grouped quiz
    Object.keys(quizGroups).forEach((key, index) => {
        const group = quizGroups[key];

        const div = document.createElement('div');
        div.classList.add('report-card');
        div.innerHTML = `
            <h4>Quiz #${index + 1}</h4>
            <p><strong>Score:</strong> ${group[0].score} / ${group[0].total}</p>
            <button class="quizapp-btn view-quiz-btn" data-group="${key}">View Questions</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            openQuestionModal(group);
        });

        modalReports.appendChild(div);
    });

    modal.style.display = 'block';
}



// ------------------------------
// MODAL #2 — FULL QUESTION/ANSWER VIEW
// ------------------------------

function openQuestionModal(group) {
    const modal = document.getElementById("questionModal");
    const modalContent = document.getElementById("questionModalContent");
    modalContent.innerHTML = "";

    group.forEach((quiz, i) => {
        let detailsArr = [];

        // ALWAYS parse your format: details = ["[ {...}, {...} ]"]
        if (Array.isArray(quiz.details) && typeof quiz.details[0] === "string") {
            try {
                detailsArr = JSON.parse(quiz.details[0]);
            } catch (err) {
                console.error("Failed to parse details:", err);
                detailsArr = [];
            }
        }

        const quizDiv = document.createElement("div");
        quizDiv.classList.add("question-card");
        quizDiv.innerHTML = `
            <h4>Quiz Part #${i + 1}</h4>
            ${detailsArr
                .map(d => `
                    <div class="detail-item">
                        <strong class="theQuestion" >${d.question}</strong><br>
                        Your answer: ${d.selected}<br>
                        Correct: ${d.correct}
                    </div>
                `)
                .join("")}
        `;

        modalContent.appendChild(quizDiv);
    });

    modal.style.display = "block";
}





// CLOSE MODALS
document.getElementById('closeModal').onclick = () => {
    document.getElementById('reportModal').style.display = 'none';
};

document.getElementById('closeQuestionModal').onclick = () => {
    document.getElementById('questionModal').style.display = 'none';
};


// LOGOUT
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login.html';
});

loadProfile();
