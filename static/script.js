import { Chart } from "@/components/ui/chart"
// Navigation
const navLinks = document.querySelectorAll(".nav-link")
const sections = document.querySelectorAll(".section")

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()

    // Remove active class from all links and sections
    navLinks.forEach((l) => l.classList.remove("active"))
    sections.forEach((s) => s.classList.remove("active"))

    // Add active class to clicked link
    link.classList.add("active")

    // Show corresponding section
    const sectionId = link.dataset.section
    document.getElementById(sectionId).classList.add("active")
  })
})

// Modal
const modal = document.getElementById("createForecastModal")
const createBtns = document.querySelectorAll(".create-forecast-btn")
const closeBtn = document.querySelector(".close-btn")
const cancelBtn = document.querySelector(".cancel-btn")

createBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.add("active")
  })
})

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active")
})

cancelBtn.addEventListener("click", () => {
  modal.classList.remove("active")
})

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active")
  }
})

// Prediction buttons
const predictionBtns = document.querySelectorAll(".prediction-btn")
const predictionInput = document.getElementById("forecastPrediction")

predictionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    predictionBtns.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")
    predictionInput.value = btn.dataset.prediction
  })
})

// Confidence slider
const confidenceSlider = document.getElementById("forecastConfidence")
const confidenceValue = document.getElementById("confidenceValue")

confidenceSlider.addEventListener("input", (e) => {
  confidenceValue.textContent = e.target.value
})

// Form submission
const forecastForm = document.getElementById("forecastForm")

forecastForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = {
    title: document.getElementById("forecastTitle").value,
    description: document.getElementById("forecastDescription").value,
    category: document.getElementById("forecastCategory").value,
    deadline: document.getElementById("forecastDeadline").value,
    prediction: document.getElementById("forecastPrediction").value,
    confidence: document.getElementById("forecastConfidence").value,
  }

  console.log("Forecast submitted:", formData)

  // Show success message (you can replace this with actual API call)
  alert("Forecast created successfully! 🎉")

  // Reset form and close modal
  forecastForm.reset()
  predictionBtns.forEach((b) => b.classList.remove("active"))
  modal.classList.remove("active")
})

// Leaderboard filters
const filterBtns = document.querySelectorAll(".filter-btn")

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")
    // Here you would filter the leaderboard data
    console.log("Filter:", btn.textContent)
  })
})

// Initialize Charts
function initCharts() {
  const chartConfig = {
    type: "line",
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(19, 19, 24, 0.9)",
          titleColor: "#e0e0e8",
          bodyColor: "#a0a0b0",
          borderColor: "#ff00ff",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
        line: {
          tension: 0.4,
        },
      },
    },
  }

  // Chart 1 - AGI Prediction
  const ctx1 = document.getElementById("chart1").getContext("2d")
  new Chart(ctx1, {
    ...chartConfig,
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [45, 42, 38, 35, 34, 34],
          borderColor: "#ff00ff",
          backgroundColor: "rgba(255, 0, 255, 0.1)",
          fill: true,
          borderWidth: 2,
        },
      ],
    },
  })

  // Chart 2 - Bitcoin Prediction
  const ctx2 = document.getElementById("chart2").getContext("2d")
  new Chart(ctx2, {
    ...chartConfig,
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [65, 68, 70, 71, 72, 72],
          borderColor: "#00ffff",
          backgroundColor: "rgba(0, 255, 255, 0.1)",
          fill: true,
          borderWidth: 2,
        },
      ],
    },
  })

  // Chart 3 - Climate Agreement
  const ctx3 = document.getElementById("chart3").getContext("2d")
  new Chart(ctx3, {
    ...chartConfig,
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [52, 54, 56, 57, 58, 58],
          borderColor: "#00ff88",
          backgroundColor: "rgba(0, 255, 136, 0.1)",
          fill: true,
          borderWidth: 2,
        },
      ],
    },
  })

  // Chart 4 - Sports Prediction
  const ctx4 = document.getElementById("chart4").getContext("2d")
  new Chart(ctx4, {
    ...chartConfig,
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [48, 47, 46, 45, 45, 45],
          borderColor: "#ff0066",
          backgroundColor: "rgba(255, 0, 102, 0.1)",
          fill: true,
          borderWidth: 2,
        },
      ],
    },
  })
}

// Initialize charts when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initCharts()
})

