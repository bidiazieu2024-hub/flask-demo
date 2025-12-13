document.addEventListener("DOMContentLoaded", () => {
  console.log("Predikto loaded");

  // Navigation
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const targetSection = link.getAttribute("data-section");

      // Update active nav link
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      // Switch visible section
      sections.forEach(section => {
        if (section.id === targetSection) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });

      // Ensure "Create Your First Forecast" area shows again when entering My Forecasts
      if (targetSection === "my-forecasts") {
        const emptyState = document.querySelector("#my-forecasts .empty-state");
        if (emptyState) {
          emptyState.style.display = "block";
          emptyState.style.opacity = "1";
        }
      }

      // Scroll to top for smooth transition
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
  });

  // MetaMask Connection
  const connectWalletBtn = document.getElementById("connectWalletBtn");
  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const walletAddress = accounts[0];
        alert(`Connected to MetaMask!\nWallet: ${walletAddress}`);
        connectWalletBtn.textContent = "Connected";
        connectWalletBtn.disabled = true;
        connectWalletBtn.style.opacity = "0.7";
      } catch (error) {
        console.error(error);
        alert("Connection request was rejected.");
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
      window.open("https://metamask.io/download/", "_blank");
    }
  }
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener("click", connectWallet);
  }
});


// --------------------------
// Create Prediction Modal
// --------------------------
const openModalBtn = document.getElementById('openPredictionModal');
const closeModalBtn = document.getElementById('closePredictionModal');
const modal = document.getElementById('predictionModal');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const eventSelect = document.getElementById('eventSelect');

if (openModalBtn) {
  openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

if (yesBtn && noBtn && eventSelect) {
  yesBtn.addEventListener('click', () => {
    if (!eventSelect.value) {
      alert('Please select an event first!');
    } else {
      alert(`Prediction submitted:\nEvent: ${eventSelect.value}\nAnswer: YES`);
      modal.style.display = 'none';
    }
  });

  noBtn.addEventListener('click', () => {
    if (!eventSelect.value) {
      alert('Please select an event first!');
    } else {
      alert(`Prediction submitted:\nEvent: ${eventSelect.value}\nAnswer: NO`);
      modal.style.display = 'none';
    }
  });
}
