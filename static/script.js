document.addEventListener("DOMContentLoaded", () => {

  // Navigation switching
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-section");

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach(s => {
        if (s.id === target) s.classList.add("active");
        else s.classList.remove("active");
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Charts for forecast cards
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
      options: {
        cutout: "75%",
        plugins: { legend: { display: false } }
      }
    });
  });

});
