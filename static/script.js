import { Chart } from "@/components/ui/chart"
// Navigation
document.addEventListener("DOMContentLoaded", () => {
  // Get all nav links and sections
  const navLinks = document.querySelectorAll(".nav-link")
  const sections = document.querySelectorAll(".section")

  // Navigation click handler
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      // Remove active class from all links and sections
      navLinks.forEach((l) => l.classList.remove("active"))
      sections.forEach((s) => s.classList.remove("active"))

      // Add active class to clicked link
      link.classList.add("active")

      // Show corresponding section
      const sectionId = link.getAttribute("data-section")
      const targetSection = document.getElementById(sectionId)
      if (targetSection) {
        targetSection.classList.add("active")
      }
    })
  })

  // Initialize Charts
  initializeCharts()

  // Modal functionality
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
    if (ctx) {
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
    }
  })
}

// Modal setup
function setupModal() {
  const modal = document.getElementById("newForecastModal")
  const openButtons = document.querySelectorAll(".create-forecast-btn, .cta-btn")
  const closeButton = document.querySelector(".modal-close")
  const cancelButton = document.querySelector(".cancel-btn")
  const overlay = document.querySelector(".modal-overlay")
  const submitButton = document.querySelector(".submit-forecast-btn")
  const form = document.getElementById("forecastForm")

  // Toggle buttons for YES/NO
  const toggleButtons = document.querySelectorAll(".toggle-btn")
  let selectedChoice = null

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleButtons.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      selectedChoice = btn.getAttribute("data-choice")
    })
  })

  // Confidence slider
  const slider = document.getElementById("confidenceSlider")
  const confidenceValue = document.getElementById("confidenceValue")

  slider.addEventListener("input", (e) => {
    confidenceValue.textContent = e.target.value
  })

  // Open modal
  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.classList.add("active")
      // Reset form
      form.reset()
      toggleButtons.forEach((b) => b.classList.remove("active"))
      selectedChoice = null
      confidenceValue.textContent = "50"
    })
  })

  // Close modal functions
  const closeModal = () => {
    modal.classList.remove("active")
  }

  closeButton.addEventListener("click", closeModal)
  cancelButton.addEventListener("click", closeModal)
  overlay.addEventListener("click", closeModal)

  // Submit forecast
  submitButton.addEventListener("click", (e) => {
    e.preventDefault()

    const eventSelect = document.getElementById("eventSelect")

    // Validation
    if (!eventSelect.value) {
      alert("Please select an event.")
      return
    }

    if (!selectedChoice) {
      alert("Please select YES or NO.")
      return
    }

    const confidence = slider.value

    // Show success message (demo only)
    console.log("[v0] Forecast submitted:", {
      event: eventSelect.value,
      choice: selectedChoice,
      confidence: confidence,
    })

    alert("Prediction submitted! This is a demo only.")
    closeModal()
  })
}
