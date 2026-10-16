const frame = document.querySelector("#logo-frame");
const display = document.querySelector(".display");
const image = document.querySelector("#brand-logo");
const canvas = document.querySelector("#logo-canvas");
const context = canvas.getContext("2d", { alpha: true });
const interactivePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const CELL_SIZE = 2.5;
const ACTIVITY_RADIUS = 100;
const BEND_RADIUS = 12;
const DROPOUT_RATE = 0.2;
const MAX_FPS = 50;

let cells = [];
let width = 0;
let height = 0;
let pixelRatio = 1;
let animationFrame = 0;
let lastFrame = 0;
let presence = 0;
let targetPresence = 0;
let targetX = -1000;
let targetY = -1000;
let cursorX = -1000;
let cursorY = -1000;

function canAnimate() {
  return (
    interactivePointer.matches && !reducedMotion.matches && context !== null
  );
}

function fitImage() {
  if (!image.naturalWidth || !image.naturalHeight) return;

  const ratio = image.naturalWidth / image.naturalHeight;
  const widthFraction = window.matchMedia("(max-width: 640px)").matches
    ? 0.86
    : 0.76;
  const maxWidth = Math.min(display.clientWidth * widthFraction, 720);
  const maxHeight = Math.max(140, display.clientHeight - 88);
  const fittedWidth = Math.min(maxWidth, maxHeight * ratio);

  frame.style.width = fittedWidth.toFixed(2) + "px";
  frame.style.height = (fittedWidth / ratio).toFixed(2) + "px";
  buildPixels();
}

function buildPixels() {
  if (!image.complete || !image.naturalWidth || !context) return;

  const bounds = image.getBoundingClientRect();
  width = Math.round(bounds.width);
  height = Math.round(bounds.height);
  if (!width || !height) return;

  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const columns = Math.ceil(width / CELL_SIZE);
  const rows = Math.ceil(height / CELL_SIZE);
  const source = document.createElement("canvas");
  source.width = columns;
  source.height = rows;
  const sourceContext = source.getContext("2d", { willReadFrequently: true });
  if (!sourceContext) return;

  sourceContext.drawImage(image, 0, 0, columns, rows);
  const pixels = sourceContext.getImageData(0, 0, columns, rows).data;
  const nextCells = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = (row * columns + column) * 4;
      const alpha = pixels[index + 3] / 255;
      if (alpha < 0.08) continue;

      const seedNoise = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
      const gapNoise = Math.sin(column * 269.5 + row * 183.3) * 43758.5453;
      const seed = seedNoise - Math.floor(seedNoise);
      if (gapNoise - Math.floor(gapNoise) < DROPOUT_RATE) continue;
      nextCells.push({
        x: column * CELL_SIZE + CELL_SIZE / 2,
        y: row * CELL_SIZE + CELL_SIZE / 2,
        color:
          "rgba(" +
          pixels[index] +
          ", " +
          pixels[index + 1] +
          ", " +
          pixels[index + 2] +
          ", " +
          alpha +
          ")",
        seed,
      });
    }
  }

  cells = nextCells;
}

function draw(time) {
  animationFrame = 0;

  if (time - lastFrame < 1000 / MAX_FPS) {
    animationFrame = requestAnimationFrame(draw);
    return;
  }
  lastFrame = time;

  presence += (targetPresence - presence) * 0.08;
  cursorX += (targetX - cursorX) * 0.06;
  cursorY += (targetY - cursorY) * 0.06;
  context.clearRect(0, 0, width, height);

  for (const cell of cells) {
    const dx = cell.x - cursorX;
    const dy = cell.y - cursorY;
    const distanceSquared = dx * dx + dy * dy;
    let x = cell.x;
    let y = cell.y;

    if (presence > 0.001) {
      const bend =
        Math.exp(-distanceSquared / (2 * BEND_RADIUS ** 2)) * presence * 0.21;
      const cosine = Math.cos(bend);
      const sine = Math.sin(bend);
      x = cursorX + dx * cosine - dy * sine;
      y = cursorY + dx * sine + dy * cosine;

      if (distanceSquared < ACTIVITY_RADIUS ** 2) {
        const distance = Math.sqrt(distanceSquared);
        const influence = (1 - distance / ACTIVITY_RADIUS) * presence;
        const orbitRadius = (1.2 + cell.seed * 2.2) * influence;
        const phase =
          time * (0.0026 + cell.seed * 0.0014) +
          cell.seed * Math.PI * 2 -
          distance * 0.025;
        const flutter =
          Math.sin(time * 0.011 + cell.seed * 37) * influence * 0.25;

        x += Math.cos(phase) * orbitRadius + flutter;
        y += Math.sin(phase) * orbitRadius - flutter * 0.4;
      }
    }

    const size = CELL_SIZE * (0.67 + cell.seed * 0.18);

    context.fillStyle = cell.color;
    context.fillRect(x - size / 2, y - size / 2, size, size);
  }

  if (targetPresence > 0 || presence > 0.015) {
    animationFrame = requestAnimationFrame(draw);
  }
}

function startAnimation() {
  if (!animationFrame && canAnimate()) {
    animationFrame = requestAnimationFrame(draw);
  }
}

function resetAnimation() {
  targetPresence = 0;
  frame.classList.remove("is-active");
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
  context?.clearRect(0, 0, width, height);
}

frame.addEventListener("pointerenter", (event) => {
  if (!canAnimate() || !cells.length) return;

  const bounds = frame.getBoundingClientRect();
  targetX = cursorX = event.clientX - bounds.left;
  targetY = cursorY = event.clientY - bounds.top;
  targetPresence = 1;
  frame.classList.add("is-active");
  startAnimation();
});

frame.addEventListener("pointermove", (event) => {
  if (!canAnimate() || !cells.length) return;

  const bounds = frame.getBoundingClientRect();
  targetX = event.clientX - bounds.left;
  targetY = event.clientY - bounds.top;
  targetPresence = 1;
  frame.classList.add("is-active");
  startAnimation();
});

frame.addEventListener("pointerleave", () => {
  targetPresence = 0;
  frame.classList.remove("is-active");
  startAnimation();
});

interactivePointer.addEventListener("change", resetAnimation);
reducedMotion.addEventListener("change", resetAnimation);
image.addEventListener("load", fitImage);
if (image.complete) fitImage();
new ResizeObserver(fitImage).observe(display);
