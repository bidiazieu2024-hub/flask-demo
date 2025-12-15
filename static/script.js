// Simple in-memory + localStorage state for demo market + users
const LOCAL_STORAGE_KEY = "predikto_demo_state_v1";
const INITIAL_FAKE_BALANCE = 100; // <- reset / initial amount

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
  // Reset demo state on every page load
  window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  window.localStorage.removeItem("predikto_last_address");

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

  // No hydration: every refresh is a clean slate
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
