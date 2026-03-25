/* ==========================================
   PARTICLE BACKGROUND
   ========================================== */
(function initParticles() {
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            const colors = [
                "#ff6b9d",
                "#c44dff",
                "#58a6ff",
                "#3fb950",
                "#39d2c0",
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = particles[i].color;
                    ctx.globalAlpha = 0.05 * (1 - dist / 150);
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
})();

/* ==========================================
   COUNTDOWN TIMER
   ========================================== */
(function initCountdown() {
    const weddingDate = new Date("April 12, 2026 09:00:00").getTime();

    // For progress bar: assume engagement announcement ~6 months before
    const announcementDate = new Date("2025-10-12").getTime();
    const totalDuration = weddingDate - announcementDate;

    function update() {
        const now = Date.now();
        const remaining = weddingDate - now;

        if (remaining <= 0) {
            document.getElementById("days").textContent = "000";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
            document.getElementById("progressFill").style.width = "100%";
            document.getElementById("progressPercent").textContent =
                "100% — DEPLOYED! 🎉";
            return;
        }

        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
            (remaining % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = String(days).padStart(
            3,
            "0",
        );
        document.getElementById("hours").textContent = String(hours).padStart(
            2,
            "0",
        );
        document.getElementById("minutes").textContent = String(
            minutes,
        ).padStart(2, "0");
        document.getElementById("seconds").textContent = String(
            seconds,
        ).padStart(2, "0");

        // Progress bar
        const elapsed = now - announcementDate;
        const progress = Math.min(
            Math.max((elapsed / totalDuration) * 100, 0),
            100,
        );
        document.getElementById("progressFill").style.width =
            progress.toFixed(1) + "%";
        document.getElementById("progressPercent").textContent =
            progress.toFixed(1) + "% compiled";
    }

    update();
    setInterval(update, 1000);
})();

/* ==========================================
   SCROLL REVEAL
   ========================================== */
(function initReveal() {
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger animations
                    setTimeout(() => {
                        entry.target.classList.add("visible");
                    }, i * 100);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px",
        },
    );

    revealElements.forEach((el) => observer.observe(el));
})();

/* ==========================================
   HEART SVG — FILL AFTER DRAW
   ========================================== */
(function initHeart() {
    const heartPath = document.querySelector(".heart-path");
    if (heartPath) {
        heartPath.addEventListener("animationend", () => {
            heartPath.classList.add("drawn");
        });
        // Fallback: fill after 6.5s regardless
        setTimeout(() => {
            heartPath.classList.add("drawn");
        }, 6500);
    }
})();

/* ==========================================
   RSVP RESPONSE
   ========================================== */
function rsvpResponse(type) {
    const output = document.getElementById("rsvpOutput");
    if (type === "accepted") {
        output.innerHTML = `
      <p style="color: var(--accent-green);">
        <span class="prompt">$</span> echo "Response saved!"<br/>
        <span style="padding-left:20px; display:inline-block;">
          🎉 Thank you! Your attendance has been <strong>committed</strong> to our hearts.<br/>
          See you at the wedding! <strong>git push origin happiness</strong>
        </span>
      </p>
    `;
        launchConfetti();
    } else {
        output.innerHTML = `
      <p style="color: var(--accent-pink);">
        <span class="prompt">$</span> echo "Response saved!"<br/>
        <span style="padding-left:20px; display:inline-block;">
          😢 We'll miss you! Your love is still <strong>merged</strong> with us.<br/>
          <strong>git stash pop</strong> anytime you change your mind! 💛
        </span>
      </p>
    `;
    }
}

/* ==========================================
   CONFETTI BURST
   ========================================== */
function launchConfetti() {
    const colors = [
        "#ff6b9d",
        "#c44dff",
        "#58a6ff",
        "#3fb950",
        "#ffd700",
        "#39d2c0",
        "#f0883e",
    ];
    const confettiCount = 150;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.style.cssText = `
      position: fixed;
      top: -10px;
      left: ${Math.random() * 100}vw;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
      z-index: 9999;
      pointer-events: none;
      animation: confettiFall ${Math.random() * 3 + 2}s ease-out forwards;
      animation-delay: ${Math.random() * 0.5}s;
      transform: rotate(${Math.random() * 360}deg);
    `;
        document.body.appendChild(confetti);

        // Clean up after animation
        setTimeout(() => confetti.remove(), 4000);
    }

    // Inject confetti keyframes if not already present
    if (!document.getElementById("confetti-style")) {
        const style = document.createElement("style");
        style.id = "confetti-style";
        style.textContent = `
      @keyframes confettiFall {
        0% {
          transform: translateY(0) rotate(0deg) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(${720 + Math.random() * 360}deg) scale(0.3);
          opacity: 0;
        }
      }
    `;
        document.head.appendChild(style);
    }
}

/* ==========================================
   EASTER EGG — KONAMI CODE
   ========================================== */
(function initEasterEgg() {
    const konamiCode = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a",
    ];
    let konamiIndex = 0;

    document.addEventListener("keydown", (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                launchConfetti();
                // Show secret message
                const msg = document.createElement("div");
                msg.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--bg-card);
          border: 2px solid var(--accent-pink);
          border-radius: 16px;
          padding: 40px;
          z-index: 10000;
          text-align: center;
          font-family: 'Fira Code', monospace;
          box-shadow: var(--glow-pink);
          animation: fadeInUp 0.5s ease;
        `;
                msg.innerHTML = `
          <p style="font-size: 2rem; margin-bottom: 12px;">🎮 Achievement Unlocked!</p>
          <p style="color: var(--accent-cyan);">You found the easter egg!</p>
          <p style="color: var(--text-dim); margin-top: 8px;">console.log("G + V = ❤️ forever")</p>
          <button onclick="this.parentElement.remove()" style="
            margin-top: 20px;
            padding: 10px 24px;
            background: var(--accent-pink);
            border: none;
            border-radius: 8px;
            color: white;
            font-family: 'Fira Code', monospace;
            cursor: pointer;
          ">close()</button>
        `;
                document.body.appendChild(msg);
            }
        } else {
            konamiIndex = 0;
        }
    });
})();

/* ==========================================
   CONSOLE MESSAGE
   ========================================== */
console.log(
    "%c💍 Gnanasekaran & Vaibhava 💍",
    "font-size: 24px; color: #ff6b9d; font-weight: bold;",
);
console.log("%cApril 12, 2026", "font-size: 16px; color: #c44dff;");
console.log(
    "%cwhile(alive) { love++; }",
    "font-size: 14px; color: #3fb950; font-family: monospace;",
);
console.log(
    "%c// No bugs in this relationship!",
    "font-size: 12px; color: #8b949e; font-style: italic;",
);
