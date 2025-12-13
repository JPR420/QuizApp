async function loadLeaderboard() {
    const res = await fetch('/api/leaderboard');
    if (!res.ok) {
      console.error('Failed to fetch leaderboard');
      return;
    }
  
    const data = await res.json();
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
  
    data.leaderboard.forEach((user, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.username}</td>
        <td>${user.averageScore}</td>
        <td>${user.quizzesCount}</td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Load leaderboard when page is ready
  window.addEventListener('DOMContentLoaded', loadLeaderboard);
  