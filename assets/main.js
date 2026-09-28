(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!header || !toggle || !nav) return;

  const links = [...nav.querySelectorAll('a[href^="#"]')];

  // Mobile menu
  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  links.forEach((a) => a.addEventListener("click", () => setOpen(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("nav-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (header.classList.contains("nav-open") && !header.contains(e.target)) setOpen(false);
  });

  window.matchMedia("(min-width: 880px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });

  // Border under the header once the page has scrolled
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  requestAnimationFrame(onScroll); // after first layout, so reading scrollY doesn't force a reflow
  window.addEventListener("scroll", onScroll, { passive: true });

  // Highlight the nav link for the section in view
  if ("IntersectionObserver" in window) {
    const linkFor = new Map(links.map((a) => [a.hash.slice(1), a]));
    const targets = [document.querySelector(".hero"), ...[...linkFor.keys()].map((id) => document.getElementById(id))].filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.removeAttribute("aria-current"));
          linkFor.get(entry.target.id)?.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    targets.forEach((t) => observer.observe(t));
  }

  // Keep the footer year current
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
