import React, { useRef, useEffect } from "react";

const NeonGridAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let numParticles;
    let lineDistance;
    const colors = ["#00f6ff", "#009dff", "#1a73ff"];

    // Function to adjust settings based on screen size
    const adjustSettings = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (window.innerWidth <= 768) {
        // Mobile
        numParticles = 35; // fewer particles
        lineDistance = 100; // shorter connection distance
      } else if (window.innerWidth <= 1024) {
        // Tablet
        numParticles = 60;
        lineDistance = 130;
      } else {
        // Desktop
        numParticles = 80;
        lineDistance = 150;
      }
    };

    const resizeHandler = () => {
      adjustSettings();
      init();
    };
    window.addEventListener("resize", resizeHandler);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.speedY = (Math.random() - 0.5) * 1.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    }

    function connectLines() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < lineDistance) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0, 174, 255, 0.5)";
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
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
      connectLines();
      requestAnimationFrame(animate);
    }

    adjustSettings();
    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        background: "black",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    ></canvas>
  );
};

export default NeonGridAnimation;
