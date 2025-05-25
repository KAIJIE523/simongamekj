const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let userSequence = [];
let score = 0;
let clickable = false;

const startBtn = document.getElementById("start-btn");
const scoreEl = document.getElementById("score");
const topScores = document.getElementById("top-scores");

startBtn.addEventListener("click", startGame);

colors.forEach(color => {
  document.getElementById(color).addEventListener("click", () => handleClick(color));
});

function startGame() {
  sequence = [];
  score = 0;
  scoreEl.textContent = "0";
  nextStep();
}

function nextStep() {
  clickable = false;
  userSequence = [];
  const nextColor = colors[Math.floor(Math.random() * 4)];
  sequence.push(nextColor);
  playSequence();
}

function playSequence() {
  let i = 0;
  const interval = setInterval(() => {
    const color = sequence[i];
    flash(color);
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
      clickable = true;
    }
  }, 600);
}

function flash(color) {
  const el = document.getElementById(color);
  el.classList.add("active");
  setTimeout(() => el.classList.remove("active"), 300);
}

function handleClick(color) {
  if (!clickable) return;
  userSequence.push(color);
  flash(color);
  const index = userSequence.length - 1;
  if (userSequence[index] !== sequence[index]) {
    gameOver();
    return;
  }
  if (userSequence.length === sequence.length) {
    score++;
    scoreEl.textContent = score;
    setTimeout(nextStep, 1000);
  }
}

function gameOver() {
  alert("Game Over! Your score: " + score);
  clickable = false;
  saveScore(score);
}

function saveScore(score) {
  fetch("save_score.php", {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `score=${score}`
  }).then(loadTopScores);
}

function loadTopScores() {
  fetch("get_scores.php")
    .then(res => res.json())
    .then(data => {
      topScores.innerHTML = "";
      data.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        topScores.appendChild(li);
      });
    });
}

loadTopScores();
