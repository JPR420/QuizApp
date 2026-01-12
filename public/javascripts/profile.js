//public\javascripts\profile.js

async function loadProfilePage() {
  const loader = document.getElementById("loadingScreen");

  try {
    // Run both requests in parallel
    const [historyRes, userRes] = await Promise.all([
      fetch("/api/history", { credentials: "include" }),
      fetch("/api/auth/me", { credentials: "include" }),
    ]);

    // If auth fails, redirect
    if (!userRes.ok) {
      window.location.href = "/login.html";
      return;
    }

    const history = await historyRes.json();
    const { user } = await userRes.json();

    // ---- Set username ----
    document.getElementById("username").textContent = user.username;

    // ---- Render history ----
    renderHistory(history);
  } catch (err) {
    console.error("Profile load failed:", err);
    alert("Failed to load profile");
  } finally {
    // Hide loader
    loader.style.display = "none";
  }
}

loadProfilePage();

function renderHistory(history) {
  const tbody = document.getElementById("historyBody");
  tbody.innerHTML = "";

  if (!Array.isArray(history)) return;

  // Group quizzes by date
  const byDate = {};
  history.forEach((h) => {
    const day = new Date(h.created_at).toDateString();
    if (!byDate[day]) byDate[day] = [];
    byDate[day].push(h);
  });

  Object.keys(byDate).forEach((dateKey) => {
    const tr = document.createElement("tr");

    const dateTd = document.createElement("td");
    dateTd.classList.add("dateTd");
    dateTd.textContent = new Date(dateKey).toLocaleDateString();

    const reportTd = document.createElement("td");
    reportTd.classList.add("reportTd");

    const btn = document.createElement("button");
    btn.classList.add("viewQuizbtn");

    btn.textContent = "View";
    btn.onclick = () => openReport(dateKey, byDate[dateKey]);

    reportTd.appendChild(btn);

    tr.appendChild(dateTd);
    tr.appendChild(reportTd);
    tbody.appendChild(tr);
  });
}

// ------------------------------
// MODAL #1 — LIST OF QUIZZES FOR THAT DAY
// ------------------------------

function openReport(dateKey, quizzes) {
  const modal = document.getElementById("reportModal");
  const modalDate = document.getElementById("modalDate");
  const modalReports = document.getElementById("modalReports");

  modalDate.textContent = new Date(dateKey).toLocaleDateString();
  modalReports.innerHTML = "";

  // Group quizzes by (score + total)
  const quizGroups = {};
  quizzes.forEach((q) => {
    const key = `${q.score}/${q.total}`;
    if (!quizGroups[key]) quizGroups[key] = [];
    quizGroups[key].push(q);
  });

  // Create a card per grouped quiz
  Object.keys(quizGroups).forEach((key, index) => {
    const group = quizGroups[key];

    const div = document.createElement("div");
    div.classList.add("report-card");
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

  modal.style.display = "block";
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

    if (Array.isArray(quiz.details)) {
      detailsArr = quiz.details;
    } else if (typeof quiz.details === "string") {
      try {
        detailsArr = JSON.parse(quiz.details);
      } catch (err) {
        console.error("Failed to parse details:", err);
      }
    }

    const quizDiv = document.createElement("div");
    quizDiv.classList.add("question-card");
    quizDiv.innerHTML = `
            <h4>Quiz Part #${i + 1}</h4>
            ${detailsArr
              .map(
                (d) => `
                <div class="detail-item">
                    <strong class="theQuestion">${d.question}</strong><br>
                    Your answer: ${d.selected}<br>
                    Correct: ${d.correct}
                </div>
            `
              )
              .join("")}
        `;

    modalContent.appendChild(quizDiv);
  });

  modal.style.display = "block";
}

// CLOSE MODALS
document.getElementById("closeModal").onclick = () => {
  document.getElementById("reportModal").style.display = "none";
};

document.getElementById("closeQuestionModal").onclick = () => {
  document.getElementById("questionModal").style.display = "none";
};

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  window.location.href = "/index.html";
});

loadProfile();
