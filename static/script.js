// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------
  // NAVIGATION: Switch between Dashboard, Leaderboard, My Forecasts
  // -------------------------------
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Update active link
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Show corresponding section
      const target = link.getAttribute("data-section");
      sections.forEach((s) => s.classList.remove("active"));
      document.getElementById(target).classList.add("active");
    });
  });

  // -------------------------------
  // MODAL: View Forecast Details
  // -------------------------------
  const detailsModal = document.getElementById("forecastDetailsModal");
  const closeBtns = document.querySelectorAll(".close-btn");

  document.querySelectorAll(".view-details-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".forecast-card");
      const title = card.querySelector(".forecast-title").textContent;
      const desc = card.querySelector(".forecast-description").textContent;

      // Fill modal dynamically
      detailsModal.querySelector("h2").textContent = title;
      detailsModal.querySelector("#forecastDescription").textContent = desc;

      detailsModal.style.display = "flex";
    });
  });

  // Close modal (both modals)
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".modal").style.display = "none";
    });
  });

  // Close modal by clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  });

  // -------------------------------
  // MODAL: Create New Forecast
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
  // LEADERBOARD FILTER BUTTONS
  // -------------------------------
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Placeholder for filtering logic
      const period = btn.textContent.trim();
      console.log(`Leaderboard filter selected: ${period}`);
    });
  });

  // -------------------------------
  // FORECAST CONFIDENCE SLIDER
  // -------------------------------
  const confidenceSlider = document.getElementById("forecastConfidence");
  const confidenceValue = document.getElementById("confidenceValue");

  if (confidenceSlider && confidenceValue) {
    confidenceSlider.addEventListener("input", () => {
      confidenceValue.textContent = confidenceSlider.value;
    });
  }

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
              borderWidth: 0,
            },
          ],
        },
        options: {
          cutout: "75%",
          plugins: { legend: { display: false } },
        },
      });
    }
  });

});
