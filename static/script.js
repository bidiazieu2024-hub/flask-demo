document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const id = link.getAttribute("data-section");
      sections.forEach(s => s.classList.remove("active"));
      document.getElementById(id).classList.add("active");
    });
  });

  // Charts
  const configs = [
    { id: "chart1", yes: 34, no: 66 },
    { id: "chart2", yes: 72, no: 28 }
  ];
  configs.forEach(cfg => {
    const ctx = document.getElementById(cfg.id);
    if (!ctx) return;
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["YES", "NO"],
        datasets: [{
          data: [cfg.yes, cfg.no],
          backgroundColor: ["#00ffff", "#ff00ff"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "75%",
        plugins: { legend: { display: false } }
      }
    });
  });

  // Funny leaderboard
  const leaderboard = [
    "BasedWizard", "BananaProphet", "WittyMcBitty", "QuantumMuffin",
    "ProfessorYesMan", "SirGuacamole", "CaptainObvious", "CaffeinatedTurtle",
    "BreadDealer69", "DefinitelyHuman"
  ];
  const leaderboardTable = document.querySelector(".leaderboard-table");
  leaderboard.forEach((name, i) => {
    const div = document.createElement("div");
    div.className = "leaderboard-entry";
    div.innerHTML = `
      <h3>#${i + 1} ${name}</h3>
      <p>Accuracy: ${(80 + Math.random() * 15).toFixed(1)}%</p>
      <p>Predictions: ${Math.floor(500 + Math.random() * 1000)}</p>
    `;
    leaderboardTable.appendChild(div);
  });
});
