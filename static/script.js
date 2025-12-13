document.addEventListener("DOMContentLoaded", () => {

  // Navigation switching
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-section");

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach(s => {
        if (s.id === target) s.classList.add("active");
        else s.classList.remove("active");
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Charts for forecast cards
  const configs = [
    { id: "chart1", yes: 34, no: 66 },
    { id: "chart2", yes: 72, no: 28 },
    { id: "chart3", yes: 45, no: 55 },
    { id: "chart4", yes: 58, no: 42 }
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

});

// -------------------- NEW FORECAST MODAL --------------------
document.addEventListener("DOMContentLoaded", () => {
  // Button in the navbar
  const openBtn = document.querySelector(".create-forecast-btn, .new-forecast-btn");
  const modal = document.getElementById("newForecastModal");
  const closeBtn = document.getElementById("closeNewForecast");
  const cancelBtn = document.getElementById("cancelNewForecast");
  const form = document.getElementById("newForecastForm");

  const yesBtn = document.getElementById("yesPredictionBtn");
  const noBtn = document.getElementById("noPredictionBtn");
  const confidenceRange = document.getElementById("confidenceRange");
  const confidenceValue = document.getElementById("confidenceValue");

  if (!openBtn || !modal) return; // safety: if markup is missing, do nothing

  let selectedPrediction = null;

  const openModal = () => {
    modal.classList.add("active");
  };

  const closeModal = () => {
    modal.classList.remove("active");
  };

  // Open
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  // Close buttons
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // Close when clicking the dark overlay
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // YES / NO selection
  const setPrediction = (value) => {
    selectedPrediction = value;
    yesBtn.classList.toggle("active", value === "yes");
    noBtn.classList.toggle("active", value === "no");
  };

  yesBtn.addEventListener("click", () => setPrediction("yes"));
  noBtn.addEventListener("click", () => setPrediction("no"));

  // Confidence slider label
  confidenceRange.addEventListener("input", () => {
    confidenceValue.textContent = confidenceRange.value;
  });

  // Fake submit (no backend wiring, just demo)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const question = document.getElementById("forecastQuestion").value.trim();
    const category = document.getElementById("forecastCategory").value;

    if (!question || !category || !selectedPrediction) {
      alert("Please fill all fields and choose YES or NO.");
      return;
    }

    const confidence = confidenceRange.value;

    console.log("New forecast:", {
      question,
      category,
      prediction: selectedPrediction,
      confidence: `${confidence}%`,
    });

    alert("Prediction submitted! (demo only – not saved to a database)");
    form.reset();
    selectedPrediction = null;
    yesBtn.classList.remove("active");
    noBtn.classList.remove("active");
    confidenceRange.value = 60;
    confidenceValue.textContent = "60";

    closeModal();
  });
});

