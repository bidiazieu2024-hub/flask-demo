document.addEventListener("DOMContentLoaded", () => {
  console.log("Predikto loaded");

  // Navigation
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const targetSection = link.getAttribute("data-section");

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach(section => {
        section.classList.remove("active");
        if (section.id === targetSection) section.classList.add("active");
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Charts
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
      options: { cutout: "75%", plugins: { legend: { display: false } } }
    });
  });

  // MetaMask
  const connectWalletBtn = document.getElementById("connectWalletBtn");
  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        alert(`Connected: ${accounts[0]}`);
        connectWalletBtn.textContent = "Connected";
        connectWalletBtn.disabled = true;
      } catch (err) {
        alert("Connection rejected");
      }
    } else {
      window.open("https://metamask.io/download/", "_blank");
    }
  }
  if (connectWalletBtn) connectWalletBtn.addEventListener("click", connectWallet);

  // Prediction Modal
  const modal = document.getElementById("predictionModal");
  const openBtn = document.getElementById("openPredictionModal");
  const closeBtn = document.getElementById("closePredictionModal");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const eventSelect = document.getElementById("eventSelect");

  if (openBtn) openBtn.addEventListener("click", () => modal.style.display = "flex");
  if (closeBtn) closeBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  if (yesBtn && noBtn && eventSelect) {
    yesBtn.addEventListener("click", () => {
      if (!eventSelect.value) return alert("Please select an event first!");
      alert(`Prediction submitted:\n${eventSelect.value}\nAnswer: YES`);
      modal.style.display = "none";
    });
    noBtn.addEventListener("click", () => {
      if (!eventSelect.value) return alert("Please select an event first!");
      alert(`Prediction submitted:\n${eventSelect.value}\nAnswer: NO`);
      modal.style.display = "none";
    });
  }
});
