(() => {
  const logoUrl =
    "https://taxidumole.com/wp-content/uploads/2025/10/Logo-Mascote-Taxi-du-Mole-Image-8-oct.-2025-a-15_52_01.png";
  const gold = "#ffb600";

  const setupHeroLogo = (hero) => {
    const content = hero.querySelector(".z-10");
    if (!content || content.querySelector(".hero-brand-logo")) return;

    const logo = document.createElement("img");
    logo.className = "hero-brand-logo";
    logo.src = logoUrl;
    logo.alt = "Logo mascotte Taxi du Môle";
    logo.decoding = "async";
    logo.loading = "eager";
    content.prepend(logo);
  };

  const setupPartyEffect = (hero) => {
    if (hero.querySelector(".hero-party-canvas")) return;

    const canvas = document.createElement("canvas");
    canvas.className = "hero-party-canvas";
    canvas.setAttribute("aria-hidden", "true");
    hero.append(canvas);

    const context = canvas.getContext("2d");
    let particles = [];
    let frame = 0;

    const random = (min, max) => Math.random() * (max - min) + min;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = window.innerWidth < 700 ? 72 : 130;
      particles = Array.from({ length: count }, (_, index) => {
        const snow = index % 3 === 0;
        return {
          x: random(0, rect.width),
          y: random(-rect.height, rect.height),
          size: snow ? random(1.5, 4.5) : random(3, 9),
          speed: snow ? random(0.25, 0.75) : random(0.65, 1.55),
          drift: random(-0.42, 0.42),
          rotation: random(0, Math.PI * 2),
          rotationSpeed: random(-0.035, 0.035),
          alpha: snow ? random(0.45, 0.85) : random(0.55, 1),
          type: snow ? "snow" : index % 2 === 0 ? "glitter" : "confetti"
        };
      });
    };

    const drawSparkle = (x, y, size) => {
      context.beginPath();
      context.moveTo(x, y - size);
      context.lineTo(x + size * 0.35, y - size * 0.35);
      context.lineTo(x + size, y);
      context.lineTo(x + size * 0.35, y + size * 0.35);
      context.lineTo(x, y + size);
      context.lineTo(x - size * 0.35, y + size * 0.35);
      context.lineTo(x - size, y);
      context.lineTo(x - size * 0.35, y - size * 0.35);
      context.closePath();
      context.fill();
    };

    const draw = () => {
      const rect = hero.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);

      particles.forEach((particle) => {
        particle.y += particle.speed;
        particle.x += particle.drift + Math.sin(particle.y * 0.012) * 0.18;
        particle.rotation += particle.rotationSpeed;

        if (particle.y > rect.height + 24) {
          particle.y = random(-120, -20);
          particle.x = random(0, rect.width);
        }
        if (particle.x < -24) particle.x = rect.width + 24;
        if (particle.x > rect.width + 24) particle.x = -24;

        context.save();
        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.type === "snow" ? "rgba(255, 255, 255, 0.82)" : gold;
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);

        if (particle.type === "snow") {
          context.beginPath();
          context.arc(0, 0, particle.size, 0, Math.PI * 2);
          context.fill();
        } else if (particle.type === "glitter") {
          drawSparkle(0, 0, particle.size);
        } else {
          context.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
        }

        context.restore();
      });

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pagehide", () => window.cancelAnimationFrame(frame));
  };

  const boot = () => {
    const hero = document.querySelector(".hero-shell");
    if (!hero) return;
    setupHeroLogo(hero);
    setupPartyEffect(hero);
  };

  const scheduleBoot = () => {
    boot();
    window.setTimeout(boot, 250);
    window.setTimeout(boot, 900);
    window.setTimeout(boot, 1600);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleBoot, { once: true });
  } else {
    scheduleBoot();
  }

  window.addEventListener("load", scheduleBoot, { once: true });

  const observer = new MutationObserver(() => {
    const hero = document.querySelector(".hero-shell");
    if (!hero) return;
    if (!hero.querySelector(".hero-brand-logo") || !hero.querySelector(".hero-party-canvas")) {
      boot();
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
