// Wait until page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Predikto dashboard loaded");

  // -------------------------------
  // NAVIGATION: Switch between Dashboard, Leaderboard, My Forecasts
  // -------------------------------
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      const target = link.getAttribute("data-section");
      sections.forEach((s) => s.classList.remove("active"));
      document.getElementById(target).classList.add("active");
    });
  });

  // -------------------------------
  // FORECAST DETAILS MODAL
  // -------------------------------
  const detailsModal = document.getElementById("forecastDetailsModal");
  const closeBtns = document.querySelectorAll(".close-btn");

  document.querySelectorAll(".view-details-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".forecast-card");
      const title = card.querySelector(".forecast-title").textContent;
      const desc = card.querySelector(".forecast-description").textContent;

      detailsModal.querySelector("h2").textContent = title;
      detailsModal.querySelector("#forecastDescription").textContent = desc;
      detailsModal.style.display = "flex";
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".modal").style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  });

  // -------------------------------
  // NEW FORECAST MODAL
  // -------------------------------
  const createModal = document.getElementById("createForecastModal");
  const newForecastBtns = document.querySelectorAll(".create-forecast-btn");
  const cancelBtn = createModal.querySelector(".cancel-btn");

  newForecastBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      createModal.style.display = "flex";
    });
  });

  cancelBtn.addEventListener("click", () => {
    createModal.style.display = "none";
  });

  // -------------------------------
  // CONFIDENCE SLIDER
  // -------------------------------
  const confidenceSlider = document.getElementById("forecastConfidence");
  const confidenceValue = document.getElementById("confidenceValue");

  if (confidenceSlider && confidenceValue) {
    confidenceSlider.addEventListener("input", () => {
      confidenceValue.textContent = confidenceSlider.value;
    });
  }

  // -------------------------------
  // LEADERBOARD DATA (Funny Cyberpunk Names)
  // -------------------------------
  const leaderboardData = [
    { rank: 1, user: "NeonFalcon", accuracy: 92.4, predictions: 1204, points: 32890 },
    { rank: 2, user: "TacoProphet", accuracy: 89.7, predictions: 988, points: 29420 },
    { rank: 3, user: "SynthGuru", accuracy: 87.1, predictions: 864, points: 25610 },
    { rank: 4, user: "BinaryBandit", accuracy: 84.3, predictions: 775, points: 21890 },
    { rank: 5, user: "GlitchSeer", accuracy: 82.9, predictions: 702, points: 19430 },
    { rank: 6, user: "CyberDruid", accuracy: 81.4, predictions: 665, points: 17840 },
    { rank: 7, user: "OracleMech", accuracy: 80.2, predictions: 623, points: 15990 },
    { rank: 8, user: "DataShaman", accuracy: 78.8, predictions: 589, points: 14210 },
    { rank: 9, user: "VaporSignal", accuracy: 76.9, predictions: 553, points: 12860 },
    { rank: 10, user: "PixelProphet", accuracy: 75.5, predictions: 498, points: 11340 }
  ];

  const leaderboardTable = document.querySelector(".leaderboard-table");

  if (leaderboardTable) {
    leaderboardData.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "table-row";
      row.innerHTML = `
        <div class="table-cell rank">${entry.rank}</div>
        <div class="table-cell user">
          <div class="user-avatar">${entry.user.substring(0,2).toUpperCase()}</div>
          <div class="user-info">
            <div class="user-name">${entry.user}</div>
          </div>
        </div>
        <div class="table-cell"><span class="accuracy-text">${entry.accuracy.toFixed(1)}%</span></div>
        <div class="table-cell">${entry.predictions}</div>
        <div class="table-cell points">${entry.points.toLocaleString()}</div>
      `;
      leaderboardTable.appendChild(row);
    });
  }

  // -------------------------------
  // LEADERBOARD FILTER BUTTONS
  // -------------------------------
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const period = btn.textContent.trim();
      console.log(`Leaderboard filter selected: ${period}`);
    });
  });

  // -------------------------------
  // SAMPLE CHARTS (Chart.js)
  // -------------------------------
  const chartConfigs = [
    { id: "chart1", yes: 34, no: 66 },
    { id: "chart2", yes: 72, no: 28 },
    { id: "chart3", yes: 58, no: 42 },
    { id: "chart4", yes: 45, no: 55 }
  ];

  chartConfigs.forEach((cfg) => {
    const ctx = document.getElementById(cfg.id);
    if (ctx) {
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["YES", "NO"],
          datasets: [
            {
              data: [cfg.yes, cfg.no],
              backgroundColor: ["#00ffff", "#ff00ff"],
              borderWidth: 0
            }
          ]
        },
        options: {
          cutout: "75%",
          plugins: { legend: { display: false } }
        }
      });
    }
  });

});
