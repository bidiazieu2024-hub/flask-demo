document.addEventListener("DOMContentLoaded", () => {
  console.log("Predikto loaded");

 // Navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const targetSection = link.getAttribute('data-section');

    // Update active nav link
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Show only the selected section
    sections.forEach(section => {
      section.classList.remove('active');
      if (section.id === targetSection) {
        section.classList.add('active');
        section.style.display = 'block'; // ensure visible again
      } else {
        section.style.display = 'none'; // hide others cleanly
      }
    });

    // Special case: re-show the "Create Your First Forecast" CTA button
    if (targetSection === 'my-forecasts') {
      const emptyState = document.querySelector('#my-forecasts .empty-state');
      if (emptyState) {
        emptyState.style.display = 'block';
      }
    }

    // Smooth scroll to top for transitions
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
