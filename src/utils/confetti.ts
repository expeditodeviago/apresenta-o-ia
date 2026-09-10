import confetti from 'canvas-confetti';

export function fireChalkCelebration() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Chalk colored sparkles
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#4ade80', '#fbbf24', '#38bdf8', '#fb7185', '#c084fc', '#f8fafc'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#4ade80', '#fbbf24', '#38bdf8', '#fb7185', '#c084fc', '#f8fafc'],
    });
  }, 250);
}

export function fireStarBurst(x: number = 0.5, y: number = 0.5) {
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { x, y },
    colors: ['#fbbf24', '#4ade80', '#38bdf8', '#ffffff'],
    zIndex: 9999,
  });
}
