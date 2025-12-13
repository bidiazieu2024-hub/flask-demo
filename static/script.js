document.addEventListener("DOMContentLoaded", () => {
  console.log("Predikto loaded");

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

  // Funny Leaderboard
  const leaderboard = [
    "BasedWizard", "BananaProphet", "SirGuacamole", "CaptainObvious",
    "QuantumMuffin", "CaffeinatedTurtle", "WittyMcBitty", "DataLlama",
    "CryptoBard", "DefinitelyHuman"
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

// --------------------------
// MetaMask Connection
// --------------------------
const connectWalletBtn = document.getElementById('connectWalletBtn');

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];
      alert(`Connected to MetaMask!\nWallet: ${walletAddress}`);
      connectWalletBtn.textContent = `Connected`;
      connectWalletBtn.disabled = true;
      connectWalletBtn.style.opacity = '0.7';
    } catch (error) {
      console.error(error);
      alert('Connection request was rejected.');
    }
  } else {
    alert('MetaMask is not installed. Please install it to continue.');
    window.open('https://metamask.io/download/', '_blank');
  }
}

if (connectWalletBtn) {
  connectWalletBtn.addEventListener('click', connectWallet);
}
