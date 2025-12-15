// Simple in-memory + localStorage state for demo market + users
const LOCAL_STORAGE_KEY = "predikto_demo_state_v1";
const INITIAL_FAKE_BALANCE = 1000;

// Market configuration for the 4 hard-coded cards
const MARKET_CONFIG = [
  {
    id: "agi",
    chartId: "chart1",
    question: "Will AI reach AGI by 2027?",
    yesPercent: 32,
    noPercent: 68,
  },
  {
    id: "bitcoin",
    chartId: "chart2",
    question: "Bitcoin above $100K by end of 2025?",
    yesPercent: 67,
    noPercent: 33,
  },
  {
    id: "climate",
    chartId: "chart3",
    question: "Global climate agreement in 2025?",
    yesPercent: 45,
    noPercent: 55,
  },
  {
    id: "sports",
    chartId: "chart4",
    question: "Team X wins championship 2025?",
    yesPercent: 58,
    noPercent: 42,
  },
];

// Application runtime state
const appState = {
  markets: {}, // id -> { yesStake, noStake, chart, yesValueEl, noValueEl, resolved, outcome }
  user: null, // currently connected user { address, balance, bets: [...] }
};

// Navigation + app init
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  // Navigation click handler
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      navLinks.forEach((l) => l.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      link.classList.add("active");

      const sectionId = link.getAttribute("data-section");
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add("active");
      }
    });
  });

  // Initialize markets + charts, modal, MetaMask, and admin controls
  initializeCharts();
  setupModal();
  setupMetamask();
  setupAdminResolutionControls();

  // If there is a previously connected user, hydrate UI
  const lastAddress = window.localStorage.getItem("predikto_last_address");
  if (lastAddress) {
    const state = loadGlobalState();
    if (state.users && state.users[lastAddress]) {
      appState.user = state.users[lastAddress];
      updateBalanceUI();
      renderMyForecasts(appState.user);
    }
  }
});

// ---------- Persistence helpers ----------

function loadGlobalState() {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return { users: {} };
    }
    const parsed = JSON.parse(raw);
    if (!parsed.users) {
      parsed.users = {};
    }
    return parsed;
  } catch (err) {
    console.error("Failed to load state", err);
    return { users: {} };
  }
}

function saveGlobalState(state) {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save state", err);
  }
}

function saveUserData(user) {
  const state = loadGlobalState();
  if (!state.users) {
    state.users = {};
  }
  state.users[user.address] = user;
  saveGlobalState(state);
}

// ---------- Market initialization (Group 4: crowdsourced MM) ----------

function initializeCharts() {
  MARKET_CONFIG.forEach((cfg) => {
    // Use initial percentages as starting "liquidity" for the crowdsourced market
    const yesStake = cfg.yesPercent;
    const noStake = cfg.noPercent;

    const market = {
      id: cfg.id,
      question: cfg.question,
      yesStake,
      noStake,
      resolved: false,
      outcome: null,
      chart: null,
      yesValueEl: document.querySelector(
        `.forecast-stat-value.yes-value[data-market-id="${cfg.id}"]`
      ),
      noValueEl: document.querySelector(
        `.forecast-stat-value.no-value[data-market-id="${cfg.id}"]`
      ),
    };

    const ctx = document.getElementById(cfg.chartId);
    if (ctx && typeof Chart !== "undefined") {
      const total = yesStake + noStake;
      const yesPct = (yesStake / total) * 100;
      const noPct = 100 - yesPct;

      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["YES", "NO"],
          datasets: [
            {
              data: [yesPct, noPct],
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
                label: (context) =>
                  context.label + ": " + context.parsed.toFixed(1) + "%",
              },
            },
          },
        },
      });

      market.chart = chart;
    }

    // Initialize static text percentages from starting stakes
    if (market.yesValueEl && market.noValueEl) {
      const total = yesStake + noStake;
      const yesPct = (yesStake / total) * 100;
      const noPct = 100 - yesPct;
      market.yesValueEl.textContent = yesPct.toFixed(1) + "%";
      market.noValueEl.textContent = noPct.toFixed(1) + "%";
    }

    appState.markets[market.id] = market;
  });
}

// Update market UI (chart + yes/no % text) after trades
function updateMarketUI(marketId) {
  const market = appState.markets[marketId];
  if (!market) return;

  const total = market.yesStake + market.noStake;
  if (total <= 0) return;

  const yesPct = (market.yesStake / total) * 100;
  const noPct = 100 - yesPct;

  if (market.chart) {
    market.chart.data.datasets[0].data = [yesPct, noPct];
    market.chart.update();
  }

  if (market.yesValueEl) {
    market.yesValueEl.textContent = yesPct.toFixed(1) + "%";
  }
  if (market.noValueEl) {
    market.noValueEl.textContent = noPct.toFixed(1) + "%";
  }
}

// ---------- Betting + market maker (crowdsourced) ----------

// Core "crowdsourced" market maker:
// Price is the fraction of total stake on each side.
// yesPrice = yesStake / (yesStake + noStake)
// noPrice  = noStake  / (yesStake + noStake)
function getCurrentPrices(market) {
  let yesStake = market.yesStake;
  let noStake = market.noStake;

  if (yesStake + noStake <= 0) {
    yesStake = 1;
    noStake = 1;
  }

  const total = yesStake + noStake;
  return {
    yesPrice: yesStake / total,
    noPrice: noStake / total,
  };
}

function placeBet({ marketId, side, stake, confidence }) {
  const market = appState.markets[marketId];
  if (!market) {
    throw new Error("Unknown market.");
  }
  if (market.resolved) {
    throw new Error("This market has already been resolved.");
  }
  if (!appState.user) {
    throw new Error("Please connect MetaMask first to receive a demo balance.");
  }
  if (stake <= 0) {
    throw new Error("Stake must be greater than zero.");
  }
  if (appState.user.balance < stake) {
    throw new Error("Insufficient demo balance.");
  }

  const prices = getCurrentPrices(market);
  let price;
  if (side === "yes") {
    price = prices.yesPrice;
  } else if (side === "no") {
    price = prices.noPrice;
  } else {
    throw new Error("Invalid side selected.");
  }

  if (price <= 0 || price >= 1) {
    throw new Error("Market is locked; no fair price is available.");
  }

  // Shares priced so that each winning share later pays 1 demo ETH
  const shares = stake / price;

  // Deduct stake from user's demo balance
  appState.user.balance -= stake;

  // Update market-level stakes (crowdsourced pricing)
  if (side === "yes") {
    market.yesStake += stake;
  } else {
    market.noStake += stake;
  }

  // Persist bet & balance
  const global = loadGlobalState();
  const existingUser = global.users[appState.user.address] || {
    address: appState.user.address,
    balance: 0,
    bets: [],
  };
  existingUser.balance = appState.user.balance;

  const bet = {
    id: "bet-" + Date.now() + "-" + Math.random().toString(36).slice(2),
    marketId,
    side,
    stake,
    price,
    shares,
    confidence,
    timestamp: Date.now(),
    settled: false,
    payout: 0,
  };
  if (!Array.isArray(existingUser.bets)) {
    existingUser.bets = [];
  }
  existingUser.bets.push(bet);
  global.users[existingUser.address] = existingUser;
  saveGlobalState(global);
  appState.user = existingUser;

  // Update UI
  updateMarketUI(marketId);
  updateBalanceUI();
  renderMyForecasts(existingUser);
}

// Market resolution + payout distribution
function resolveMarket(marketId, outcome) {
  const market = appState.markets[marketId];
  if (!market) {
    alert("Unknown market.");
    return;
  }

  if (market.resolved) {
    alert("This market has already been resolved.");
    return;
  }

  if (outcome !== "yes" && outcome !== "no") {
    alert("Invalid outcome.");
    return;
  }

  market.resolved = true;
  market.outcome = outcome;

  updateMarketResolutionUI(marketId, outcome);

  if (!appState.user) {
    alert(
      "Market resolved. Connect MetaMask to view demo payouts for your account."
    );
    return;
  }

  const global = loadGlobalState();
  const user = global.users[appState.user.address];
  if (!user || !Array.isArray(user.bets)) {
    alert("No saved positions for this user.");
    return;
  }

  let totalPayout = 0;

  user.bets.forEach((bet) => {
    if (bet.marketId === marketId && !bet.settled) {
      if (bet.side === outcome) {
        // Each winning share pays 1 demo ETH
        const payout = bet.shares;
        bet.payout = payout;
        totalPayout += payout;
      }
      bet.settled = true;
    }
  });

  if (totalPayout > 0) {
    user.balance += totalPayout;
  }

  global.users[user.address] = user;
  saveGlobalState(global);
  appState.user = user;

  updateBalanceUI();
  renderMyForecasts(user);

  if (totalPayout > 0) {
    alert(
      `Market resolved as ${outcome.toUpperCase()}. You received ${totalPayout.toFixed(
        2
      )} demo ETH in payouts.`
    );
  } else {
    alert(
      `Market resolved as ${outcome.toUpperCase()}. You had no winning positions on this market.`
    );
  }
}

function updateMarketResolutionUI(marketId, outcome) {
  const card = document.querySelector(
    `.forecast-card[data-market-id="${marketId}"]`
  );
  if (!card) return;

  card.classList.remove("resolved-yes", "resolved-no");
  if (outcome === "yes") {
    card.classList.add("resolved-yes");
  } else if (outcome === "no") {
    card.classList.add("resolved-no");
  }
}

// ---------- Modal setup (placing a prediction) ----------

function setupModal() {
  const modal = document.getElementById("newForecastModal");
  if (!modal) return;

  const openButtons = document.querySelectorAll(
    ".create-forecast-btn, .cta-btn"
  );
  const closeButton = modal.querySelector(".modal-close");
  const cancelButton = modal.querySelector(".cancel-btn");
  const overlay = modal.querySelector(".modal-overlay");
  const submitButton = modal.querySelector(".submit-forecast-btn");
  const form = document.getElementById("forecastForm");

  const toggleButtons = modal.querySelectorAll(".toggle-btn");
  const slider = document.getElementById("confidenceSlider");
  const confidenceValue = document.getElementById("confidenceValue");
  const eventSelect = document.getElementById("eventSelect");
  const stakeInput = document.getElementById("stakeInput");

  let selectedChoice = null;

  // Toggle YES/NO buttons
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedChoice = btn.getAttribute("data-choice");
    });
  });

  // Confidence slider
  if (slider && confidenceValue) {
    slider.addEventListener("input", (e) => {
      confidenceValue.textContent = e.target.value;
    });
  }

  // Open modal
  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.classList.add("active");
      if (form) form.reset();
      toggleButtons.forEach((b) => b.classList.remove("active"));
      selectedChoice = null;
      if (confidenceValue) confidenceValue.textContent = "50";
      if (slider) slider.value = 50;
      if (stakeInput) stakeInput.value = 10;
    });
  });

  // Close helpers
  const closeModal = () => {
    modal.classList.remove("active");
  };

  if (closeButton) closeButton.addEventListener("click", closeModal);
  if (cancelButton) cancelButton.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);

  // Submit forecast (turns into a bet)
  if (submitButton) {
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();

      if (!eventSelect || !eventSelect.value) {
        alert("Please select an event.");
        return;
      }

      if (!selectedChoice) {
        alert("Please select YES or NO.");
        return;
      }

      const confidence = slider ? Number(slider.value) : 50;
      const stake = stakeInput ? Number(stakeInput.value) : 0;

      try {
        placeBet({
          marketId: eventSelect.value,
          side: selectedChoice,
          stake,
          confidence,
        });
        alert("Prediction submitted! Your demo balance has been updated.");
        closeModal();
      } catch (err) {
        console.error(err);
        alert(
          err.message ||
            "Could not place bet. Please check the console for details."
        );
      }
    });
  }
}

// ---------- My Forecasts rendering ----------

function renderMyForecasts(user) {
  const listEl = document.getElementById("myForecastsList");
  const emptyStateEl = document.getElementById("myForecastsEmptyState");
  if (!listEl || !emptyStateEl) return;

  listEl.innerHTML = "";

  if (!user || !user.bets || user.bets.length === 0) {
    emptyStateEl.style.display = "block";
    listEl.style.display = "none";
    return;
  }

  emptyStateEl.style.display = "none";
  listEl.style.display = "flex";
  listEl.style.flexDirection = "column";

  const sorted = user.bets.slice().sort((a, b) => b.timestamp - a.timestamp);

  sorted.forEach((bet) => {
    const market = appState.markets[bet.marketId];
    const statusHtml = getBetStatusText(bet, market);

    const item = document.createElement("div");
    item.className = "my-forecast-item";
    item.innerHTML = `
      <div class="my-forecast-main">
        <div class="my-forecast-question">
          ${market && market.question ? market.question : bet.marketId}
        </div>
        <div class="my-forecast-meta">
          <span class="pill pill-${bet.side}">${bet.side.toUpperCase()}</span>
          <span class="pill pill-stake">${bet.stake.toFixed(
            2
          )} demo ETH</span>
          <span class="pill pill-confidence">${bet.confidence}% confidence</span>
        </div>
      </div>
      <div class="my-forecast-status">
        ${statusHtml}
      </div>
    `;
    listEl.appendChild(item);
  });
}

function getBetStatusText(bet, market) {
  if (!market || !market.resolved) {
    return '<span class="status-pill status-open">Open</span>';
  }
  if (!bet.settled) {
    return '<span class="status-pill status-pending">Pending payout</span>';
  }
  if (bet.payout > 0) {
    return `<span class="status-pill status-win">Won +${bet.payout.toFixed(
      2
    )}</span>`;
  }
  return '<span class="status-pill status-lose">Lost</span>';
}

// ---------- MetaMask connect + first-time credit ----------

function setupMetamask() {
  const btn = document.getElementById("connectMetamaskBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not detected. Please install MetaMask and try again.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts && accounts[0];
      if (!account) {
        alert("No MetaMask account returned.");
        return;
      }

      console.log("Connected MetaMask account:", account);

      const global = loadGlobalState();
      if (!global.users[account]) {
        // First-time login: credit demo tokens (platform balance only)
        global.users[account] = {
          address: account,
          balance: INITIAL_FAKE_BALANCE,
          bets: [],
        };
        saveGlobalState(global);
        alert(
          `Welcome to Predikto! We have credited your demo account with ${INITIAL_FAKE_BALANCE} fake ETH (platform-only).`
        );
      }

      appState.user = global.users[account];
      window.localStorage.setItem("predikto_last_address", account);

      btn.textContent = "Connected";
      btn.classList.add("connected");

      updateBalanceUI();
      renderMyForecasts(appState.user);
    } catch (err) {
      console.error("MetaMask connection error:", err);
      if (err && err.code === 4001) {
        alert("Connection request was rejected.");
      } else {
        alert("Failed to connect to MetaMask. Check the console for details.");
      }
    }
  });
}

function updateBalanceUI() {
  const balanceWrapper = document.getElementById("demoBalance");
  const balanceSpan = document.getElementById("demoBalanceAmount");
  if (!balanceWrapper || !balanceSpan) return;

  if (!appState.user) {
    balanceSpan.textContent = "—";
    return;
  }
  balanceSpan.textContent = appState.user.balance.toFixed(2);
}

// ---------- Admin resolution controls (for instructor/demo) ----------

function setupAdminResolutionControls() {
  const select = document.getElementById("adminMarketSelect");
  const buttons = document.querySelectorAll(".admin-resolve-btn");
  if (!select || buttons.length === 0) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const marketId = select.value;
      const outcome = btn.getAttribute("data-outcome");
      if (!marketId) {
        alert("Select a market to resolve.");
        return;
      }
      if (!outcome) return;

      const confirmed = window.confirm(
        `Resolve market "${marketId}" as ${outcome.toUpperCase()}? This will trigger payouts for all bets on this account.`
      );
      if (!confirmed) return;

      resolveMarket(marketId, outcome);
    });
  });
}
