document.addEventListener("DOMContentLoaded", () => {
  console.log("Predikto loaded");

  // Navigation
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

  // Charts
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

  // Leaderboard
  const leaderboardData = [
    { user: "BasedWizard", accuracy: 98.2, forecasts: 1240 },
    { user: "Sir Sandwich", accuracy: 95.7, forecasts: 1100 },
    { user: "John NotDoe", accuracy: 93.1, forecasts: 980 },
    { user: "Captain Foresight", accuracy: 91.4, forecasts: 870 },
    { user: "DataLlama", accuracy: 89.5, forecasts: 802 },
    { user: "Professor YesMan", accuracy: 88.2, forecasts: 777 },
    { user: "CaffeinatedTurtle", accuracy: 86.9, forecasts: 721 },
    { user: "Banana Prophet", accuracy: 84.3, forecasts: 699 },
    { user: "WittyMcBitty", accuracy: 82.7, forecasts: 654 },
    { user: "QuantumMuffin", accuracy: 80.1, forecasts: 623 }
  ];

  const leaderboardGrid = document.querySelector(".leaderboard-grid");
  leaderboardData.forEach((entry, index) => {
    const card = document.createElement("div");
    card.className = "leaderboard-card";
    card.innerHTML = `
      <h3>#${index + 1} ${entry.user}</h3>
      <p>Accuracy: <strong>${entry.accuracy.toFixed(1)}%</strong></p>
      <p>Predictions: ${entry.forecasts}</p>
    `;
    leaderboardGrid.appendChild(card);
  });
});
