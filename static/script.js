document.addEventListener("DOMContentLoaded", () => {
  console.log("Predikto loaded");

  // Navigation switching
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const target = link.getAttribute("data-section");
      sections.forEach(s => s.classList.remove("active"));
      document.getElementById(target).classList.add("active");
    });
  });

  // Leaderboard data
  window.addEventListener("load", () => {
    const leaderboardData = [
      { rank: 1, user: "Sir Guacamole", accuracy: 98.2, predictions: 1421, points: 35000 },
      { rank: 2, user: "NotACatIRL", accuracy: 95.6, predictions: 1120, points: 32500 },
      { rank: 3, user: "BreadDealer69", accuracy: 93.1, predictions: 985, points: 30100 },
      { rank: 4, user: "QuantumPotato", accuracy: 90.8, predictions: 876, points: 28900 },
      { rank: 5, user: "CaptainObvious", accuracy: 88.5, predictions: 811, points: 27500 },
      { rank: 6, user: "DefinitelyHuman", accuracy: 85.4, predictions: 700, points: 26000 },
      { rank: 7, user: "ElonMusketeer", accuracy: 83.7, predictions: 642, points: 24100 },
      { rank: 8, user: "DarthTrader", accuracy: 81.2, predictions: 598, points: 22800 },
      { rank: 9, user: "MemeInvestor", accuracy: 78.9, predictions: 553, points: 21250 },
      { rank: 10, user: "CryptoBard", accuracy: 76.3, predictions: 498, points: 19900 }
    ];

    const leaderboardTable = document.querySelector(".leaderboard-table");
    leaderboardData.forEach(entry => {
      const row = document.createElement("div");
      row.className = "table-row";
      row.innerHTML = `
        <div>${entry.rank}</div>
        <div class="user">
          <div class="user-avatar">${entry.user.substring(0,2).toUpperCase()}</div>
          <span>${entry.user}</span>
        </div>
        <div>${entry.accuracy.toFixed(1)}%</div>
        <div>${entry.predictions}</div>
        <div>${entry.points.toLocaleString()}</div>
      `;
      leaderboardTable.appendChild(row);
    });
  });

  // Simple sample charts
  const charts = [
    { id: "chart1", yes: 34, no: 66 },
    { id: "chart2", yes: 72, no: 28 }
  ];

  charts.forEach(cfg => {
    const ctx = document.getElementById(cfg.id);
    if (ctx) {
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["YES", "NO"],
          datasets: [{ data: [cfg.yes, cfg.no], backgroundColor: ["#00ffff", "#ff00ff"], borderWidth: 0 }]
        },
        options: { cutout: "75%", plugins: { legend: { display: false } } }
      });
    }
  });
});
