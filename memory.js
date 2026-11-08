// Selecting HTML Elements

const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

const gameContainer = document.querySelector(".game-container");

const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");


// Game Variables

let cards = [];

let firstCard = null;
let secondCard = null;

let firstCardValue = "";
let lockBoard = false;

let interval = null;
let mismatchTimeout = null;

let seconds = 0;
let minutes = 0;

let movesCount = 0;
let winCount = 0;

let isGameRunning = false;


// Images Array

const items = [
  
  { name: "bee", image: "bee.png" },
  
  { name: "crocodile", image: "crocodile.png" },
  
  { name: "macaw", image: "macaw.png" },
  
  { name: "gorilla", image: "gorilla.png" },
  
  { name: "tiger", image: "tiger.png" },
  
  { name: "monkey", image: "monkey.png" },
  
  { name: "chamaleon", image: "chameleon.png" },
  
  { name: "pirhana", image: "pirhana.png" },
  
  { name: "anaconda", image: "anaconda.png" },
  
  { name: "sloth", image: "sloth.png" },
  
  { name: "cockatoo", image: "cockatoo.png" },
  
  { name: "toucan", image: "toucan.png" }
  
];


// Random Shuffle Function

const shuffleArray = (array) => {
  
  for (let i = array.length - 1; i > 0; i--) {
    
    const randomIndex = Math.floor(Math.random() * (i + 1));
    
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    
  }
  
  return array;
  
};


// Generate Random Cards

const generateRandom = (size = 4) => {
  
  const pairCount = (size * size) / 2;
  
  const shuffledItems = shuffleArray([...items]);
  
  return shuffledItems.slice(0, pairCount);
  
};


// Timer Function

const timeGenerator = () => {
  
  seconds++;
  
  if (seconds === 60) {
    
    minutes++;
    
    seconds = 0;
    
  }
  
  const secondValue =
    seconds < 10 ? `0${seconds}` : seconds;
  
  const minuteValue =
    minutes < 10 ? `0${minutes}` : minutes;
  
  timeValue.innerHTML =
    `<span>Time:</span> ${minuteValue}:${secondValue}`;
  
};


// Move Counter

const movesCounter = () => {
  
  movesCount++;
  
  moves.innerHTML =
    `<span>Moves:</span> ${movesCount}`;
  
};


// Create Game Cards

const matrixGenerator = (cardValues, size = 4) => {
  
  gameContainer.innerHTML = "";
  
  // Duplicate cards to create matching pairs
  
  const allCards = [...cardValues, ...cardValues];
  
  // Shuffle all cards
  
  shuffleArray(allCards);
  
  
  // Generate individual cards
  
  allCards.forEach((item) => {
    
    const card = document.createElement("div");
    
    card.classList.add("card-container");
    
    card.dataset.cardValue = item.name;
    
    
    const cardBefore = document.createElement("div");
    
    cardBefore.classList.add("card-before");
    
    cardBefore.textContent = "?";
    
    
    const cardAfter = document.createElement("div");
    
    cardAfter.classList.add("card-after");
    
    
    const image = document.createElement("img");
    
    image.src = item.image;
    
    image.alt = item.name;
    
    image.draggable = false;
    
    
    cardAfter.appendChild(image);
    
    card.appendChild(cardBefore);
    
    card.appendChild(cardAfter);
    
    gameContainer.appendChild(card);
    
  });
  
  
  // Set Grid Columns
  
  gameContainer.style.gridTemplateColumns =
    `repeat(${size}, minmax(0, 1fr))`;
  
  
  // Select Generated Cards
  
  cards = document.querySelectorAll(".card-container");
  
  
  // Add Click Events
  
  cards.forEach((card) => {
    
    card.addEventListener("click", () => {
      
      cardClick(card);
      
    });
    
  });
  
};


// Card Click Function

const cardClick = (card) => {
  
  // Prevent unwanted clicks
  
  if (
    !isGameRunning ||
    lockBoard ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    
    return;
    
  }
  
  
  // Flip Selected Card
  
  card.classList.add("flipped");
  
  
  // First Card Selection
  
  if (!firstCard) {
    
    firstCard = card;
    
    firstCardValue = card.dataset.cardValue;
    
    return;
    
  }
  
  
  // Second Card Selection
  
  secondCard = card;
  
  movesCounter();
  
  
  const secondCardValue = secondCard.dataset.cardValue;
  
  
  // Check Matching
  
  if (firstCardValue === secondCardValue) {
    
    firstCard.classList.add("matched");
    
    secondCard.classList.add("matched");
    
    winCount++;
    
    
    // Reset Selected Cards
    
    resetCards();
    
    
    // Check Winning Condition
    
    if (winCount === cards.length / 2) {
      
      clearInterval(interval);
      
      isGameRunning = false;
      
      result.innerHTML = `
        <h2>You Won!</h2>
        <h4>Moves: ${movesCount}</h4>
        <h4>Time: ${timeValue.textContent.replace("Time:", "").trim()}</h4>
      `;
      
      controls.classList.remove("hide");
      
      stopButton.classList.add("hide");
      
    }
    
  }
  
  else {
    
    // Prevent Clicking Other Cards
    
    lockBoard = true;
    
    
    // Store Selected Cards
    
    const tempFirst = firstCard;
    
    const tempSecond = secondCard;
    
    
    // Flip Back After Delay
    
    mismatchTimeout = setTimeout(() => {
      
      tempFirst.classList.remove("flipped");
      
      tempSecond.classList.remove("flipped");
      
      resetCards();
      
      mismatchTimeout = null;
      
    }, 900);
    
  }
  
};


// Reset Selected Cards

const resetCards = () => {
  
  firstCard = null;
  
  secondCard = null;
  
  firstCardValue = "";
  
  lockBoard = false;
  
};


// Initialize Game

const initializer = () => {
  
  result.innerHTML = "";
  
  movesCount = 0;
  
  winCount = 0;
  
  seconds = 0;
  
  minutes = 0;
  
  resetCards();
  
  
  // Reset Statistics
  
  moves.innerHTML = `<span>Moves:</span> 0`;
  
  timeValue.innerHTML = `<span>Time:</span> 00:00`;
  
  
  // Generate Random Cards
  
  const cardValues = generateRandom();
  
  matrixGenerator(cardValues);
  
};


// Start Game

const startGame = () => {
  
  // Clear Previous Timers
  
  clearInterval(interval);
  
  clearTimeout(mismatchTimeout);
  
  mismatchTimeout = null;
  
  
  // Initialize Game
  
  initializer();
  
  
  // Update Game State
  
  isGameRunning = true;
  
  controls.classList.add("hide");
  
  stopButton.classList.remove("hide");
  
  
  // Start Timer
  
  interval = setInterval(timeGenerator, 1000);
  
};


// Stop Game

const stopGame = () => {
  
  // Stop Timer
  
  clearInterval(interval);
  
  clearTimeout(mismatchTimeout);
  
  interval = null;
  
  mismatchTimeout = null;
  
  
  // Reset Game State
  
  isGameRunning = false;
  
  lockBoard = false;
  
  resetCards();
  
  
  // Show Start Screen
  
  controls.classList.remove("hide");
  
  stopButton.classList.add("hide");
  
  result.innerHTML = `
    <h2>Game Stopped</h2>
    <h4>Try Again!</h4>
  `;
  
};


// Button Events

startButton.addEventListener("click", startGame);

stopButton.addEventListener("click", stopGame);
