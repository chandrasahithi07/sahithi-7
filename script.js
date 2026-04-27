let array = [];
let isPaused = false;
let isSorting = false;
let comparisons = 0;
let swaps = 0;

const barsContainer = document.getElementById("bars");
const speedSlider = document.getElementById("speed");

function getSpeed() {
  return 510 - speedSlider.value;
}

function sleep() {
  return new Promise(resolve => setTimeout(resolve, getSpeed()));
}

async function checkPause() {
  while (isPaused) {
    await new Promise(r => setTimeout(r, 100));
  }
}

/* ARRAY FUNCTIONS */
function generateArray() {
  if (isSorting) return;
  array = [];
  for (let i = 0; i < 20; i++) {
    array.push(Math.floor(Math.random() * 100) + 1);
  }
  drawBars();
}

function useInput() {
  if (isSorting) return;
  let input = document.getElementById("userInput").value;
  array = input.split(",").map(Number);
  drawBars();
}

/* DRAW */
function drawBars() {
  barsContainer.innerHTML = "";
  array.forEach(val => {
    let bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = val * 2 + "px";

    let label = document.createElement("span");
    label.innerText = val;

    bar.appendChild(label);
    barsContainer.appendChild(bar);
  });
}

/* CONTROLS */
function pauseSort() {
  isPaused = true;
}

async function startSort() {
  if (isSorting) return;

  isSorting = true;
  isPaused = false;
  comparisons = 0;
  swaps = 0;
  updateStats();

  let algo = document.getElementById("algorithm").value;
  let startTime = performance.now();

  if (algo === "bubble") {
    document.getElementById("complexity").innerText = "O(n²)";
    showCode("bubble");
    await bubbleSort();
  }
  else if (algo === "selection") {
    document.getElementById("complexity").innerText = "O(n²)";
    showCode("selection");
    await selectionSort();
  }
  else {
    document.getElementById("complexity").innerText = "O(n²)";
    showCode("insertion");
    await insertionSort();
  }

  finish(startTime);
  isSorting = false;
}

/* SORTING */
async function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {

      await checkPause();

      comparisons++;
      updateStats();

      if (array[j] > array[j + 1]) {
        swaps++;
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        drawBars();
        await sleep();
      }
    }
  }
}

async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let min = i;

    for (let j = i + 1; j < array.length; j++) {

      await checkPause();

      comparisons++;
      updateStats();

      if (array[j] < array[min]) {
        min = j;
      }
    }

    swaps++;
    [array[i], array[min]] = [array[min], array[i]];
    drawBars();
    await sleep();
  }
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {

      await checkPause();

      comparisons++;
      swaps++;

      array[j + 1] = array[j];
      j--;

      drawBars();
      updateStats();
      await sleep();
    }

    array[j + 1] = key;
  }
}

/* STATS */
function updateStats() {
  document.getElementById("comp").innerText = comparisons;
  document.getElementById("swap").innerText = swaps;
}

function finish(startTime) {
  let endTime = performance.now();
  document.getElementById("time").innerText =
    (endTime - startTime).toFixed(2);
}

/* CODE DISPLAY */
function showCode(type) {
  let code = "";

  if (type === "bubble") {
    code = `for i = 0 to n-1
  for j = 0 to n-i-2
    if arr[j] > arr[j+1]
      swap(arr[j], arr[j+1])`;
  }
  else if (type === "selection") {
    code = `for i = 0 to n-1
  min = i
  for j = i+1 to n
    if arr[j] < arr[min]
      min = j
  swap(arr[i], arr[min])`;
  }
  else {
    code = `for i = 1 to n-1
  key = arr[i]
  j = i-1
  while j>=0 && arr[j]>key
    arr[j+1] = arr[j]
    j--
  arr[j+1] = key`;
  }

  document.getElementById("code").innerText = code;
}

/* BACKGROUND ANIMATION */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    value: Math.floor(Math.random() * 100),
    speed: Math.random() * 1.5 + 0.5
  });
}

function animateBG() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#8b5cf6";
  ctx.font = "14px monospace";

  particles.forEach(p => {
    ctx.fillText(p.value, p.x, p.y);
    p.y += p.speed;

    if (p.y > canvas.height) {
      p.y = 0;
      p.x = Math.random() * canvas.width;
      p.value = Math.floor(Math.random() * 100);
    }
  });

  requestAnimationFrame(animateBG);
}

animateBG();

/* INIT */
generateArray();