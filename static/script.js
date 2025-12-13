// Navigation + app init
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link")
  const sections = document.querySelectorAll(".section")

  // Navigation click handler
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      navLinks.forEach((l) => l.classList.remove("active"))
      sections.forEach((s) => s.classList.remove("active"))

      link.classList.add("active")

      const sectionId = link.getAttribute("data-section")
      const targetSection = document.getElementById(sectionId)
      if (targetSection) {
        targetSection.classList.add("active")
      }
    })
  })

  // Charts + modal
  initializeCharts()
  setupModal()
})

// Chart initialization
function initializeCharts() {
  const chartData = [
    { id: "chart1", yes: 32, no: 68 },
    { id: "chart2", yes: 67, no: 33 },
    { id: "chart3", yes: 45, no: 55 },
    { id: "chart4", yes: 58, no: 42 },
  ]

  chartData.forEach((data) => {
    const ctx = document.getElementById(data.id)
    if (!ctx) return

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["YES", "NO"],
        datasets: [
          {
            data: [data.yes, data.no],
            backgroundColor: ["#ff00ff", "#00fff0"],
            borderWidth: 0,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "70%",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(13, 13, 21, 0.95)",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            borderColor: "#ff00ff",
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => context.label + ": " + context.parsed + "%",
            },
          },
        },
      },
    })
  })
}

// Modal setup
function setupModal() {
  const modal = document.getElementById("newForecastModal")
  if (!modal) return

  const openButtons = document.querySelectorAll(".create-forecast-btn, .cta-btn")
  const closeButton = modal.querySelector(".modal-close")
  const cancelButton = modal.querySelector(".cancel-btn")
  const overlay = modal.querySelector(".modal-overlay")
  const submitButton = modal.querySelector(".submit-forecast-btn")
  const form = document.getElementById("forecastForm")

  const toggleButtons = modal.querySelectorAll(".toggle-btn")
  const slider = document.getElementById("confidenceSlider")
  const confidenceValue = document.getElementById("confidenceValue")
  const eventSelect = document.getElementById("eventSelect")

  let selectedChoice = null

  // Toggle YES/NO
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleButtons.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      selectedChoice = btn.getAttribute("data-choice")
    })
  })

  // Confidence slider
  if (slider && confidenceValue) {
    slider.addEventListener("input", (e) => {
      confidenceValue.textContent = e.target.value
    })
  }

  // Open modal
  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.classList.add("active")
      if (form) form.reset()
      toggleButtons.forEach((b) => b.classList.remove("active"))
      selectedChoice = null
      if (confidenceValue) confidenceValue.textContent = "50"
      if (slider) slider.value = 50
    })
  })

  // Close helpers
  const closeModal = () => {
    modal.classList.remove("active")
  }

  if (closeButton) closeButton.addEventListener("click", closeModal)
  if (cancelButton) cancelButton.addEventListener("click", closeModal)
  if (overlay) overlay.addEventListener("click", closeModal)

  // Submit forecast (demo only)
  if (submitButton) {
    submitButton.addEventListener("click", (e) => {
      e.preventDefault()

      if (!eventSelect || !eventSelect.value) {
        alert("Please select an event.")
        return
      }

      if (!selectedChoice) {
        alert("Please select YES or NO.")
        return
      }

      const confidence = slider ? slider.value : "50"

      console.log("Forecast submitted:", {
        event: eventSelect.value,
        choice: selectedChoice,
        confidence,
      })

      alert("Prediction submitted! (demo only, not saved)")
      closeModal()
    })
  }
}
