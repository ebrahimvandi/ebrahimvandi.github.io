(() => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasIO = "IntersectionObserver" in window;
  if (!header || !toggle || !nav) return;

  const links = [...nav.querySelectorAll('a[href^="#"]')];

  // Header: transparent over the top of the hero. Once the page scrolls it turns solid
  // (dark or light to match the section beneath), hides while scrolling down, and comes
  // back on scroll up, so it never sits over what you're reading.
  const darkZones = [...document.querySelectorAll(".hero, .section-dark, .contact, .site-footer")];
  let zones = [];
  let headerHeight = 64;
  let lastY = 0;
  let queued = false;

  const measure = () => {
    headerHeight = header.offsetHeight;
    zones = darkZones.map((el) => {
      const r = el.getBoundingClientRect();
      return [r.top + window.scrollY, r.bottom + window.scrollY];
    });
  };

  const updateHeader = () => {
    queued = false;
    const y = Math.max(window.scrollY, 0);
    const open = header.classList.contains("nav-open");
    const probe = y + headerHeight / 2;
    const overDark = zones.some(([top, bottom]) => probe >= top && probe < bottom);
    const solid = open || y > 8;
    header.classList.toggle("is-solid", solid);
    header.classList.toggle("on-light", solid && !overDark);
    if (open) {
      header.classList.remove("is-hidden");
    } else if (Math.abs(y - lastY) > 6) {
      header.classList.toggle("is-hidden", y > lastY && y > headerHeight * 2);
      lastY = y;
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(updateHeader);
    },
    { passive: true }
  );

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      updateHeader();
    }, 150);
  });

  // Keyboard users tabbing into a hidden header bring it back
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));

  // Mobile menu
  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    updateHeader();
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

  if (hasIO) {
    // Highlight the nav link for the section in view
    const linkFor = new Map(links.map((a) => [a.hash.slice(1), a]));
    const spyTargets = [document.getElementById("top"), ...[...linkFor.keys()].map((id) => document.getElementById(id))].filter(Boolean);
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.removeAttribute("aria-current"));
          linkFor.get(entry.target.id)?.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    spyTargets.forEach((t) => spy.observe(t));

    // Pause ambient animation while its section is off screen
    const ambient = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle("is-paused", !e.isIntersecting));
    });
    document.querySelectorAll(".hero, .contact").forEach((s) => ambient.observe(s));
  }

  const animate = hasIO && !reduceMotion;
  const items = animate ? [...document.querySelectorAll(".reveal")] : [];
  const counters = animate ? [...document.querySelectorAll("[data-count]")] : [];

  // Start-up runs after the first paint and reads layout before writing, so it never forces a reflow
  const afterFirstPaint = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));
  afterFirstPaint(() => {
    measure();
    const vh = window.innerHeight;
    const onScreen = items.map((el) => el.getBoundingClientRect().top < vh * 0.9);
    lastY = window.scrollY;

    updateHeader();
    if (!animate) return;

    // Reveal content as it scrolls into view. Anything already on screen stays put.
    items.forEach((el, i) => onScreen[i] && el.classList.add("is-in"));
    root.classList.add("reveal-ready");

    const reveal = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((entry, i) => {
            reveal.unobserve(entry.target);
            setTimeout(() => entry.target.classList.add("is-in"), i * 90);
          });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    items.filter((el) => !el.classList.contains("is-in")).forEach((el) => reveal.observe(el));

    // Count the headline figures up when they come into view.
    // The real value stays in the DOM; the animation is drawn by CSS from data-display.
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1600);
        el.dataset.display = (target * (1 - Math.pow(1 - p, 4))).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
        else delete el.dataset.display;
      };
      requestAnimationFrame(tick);
    };
    const count = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          count.unobserve(e.target);
          run(e.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => {
      el.dataset.display = (0).toFixed(parseInt(el.dataset.decimals || "0", 10));
      count.observe(el);
    });
  });

  // Web fonts can shift section heights slightly; re-measure once they're in
  document.fonts?.ready.then(() =>
    afterFirstPaint(() => {
      measure();
      updateHeader();
    })
  );

  // Soft spotlight that follows the pointer across cards
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".spot").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  // Keep the footer year current
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
