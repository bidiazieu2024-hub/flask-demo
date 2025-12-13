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
    btn.addEventListener(
