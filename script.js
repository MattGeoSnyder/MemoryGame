const gameContainer = document.getElementById("game");
let cardQuery = [];
let matchedCards = [];
let flipCount = 0;
let score = 0;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function checkMatch(card1, card2) {
    score++;
    updateScore();
    if (card1.nextElementSibling.style.backgroundColor === card2.nextElementSibling.style.backgroundColor){
      card1.removeEventListener("click", handleCardClick);
      card2.removeEventListener("click", handleCardClick);
      matchedCards.push(cardQuery.pop());
      matchedCards.push(cardQuery.pop());
      flipCount = 0;
      setTimeout(checkEndGame, 1000);
    } else {
      setTimeout(function(){

        card1.parentElement.classList.remove("flipped");
        card2.parentElement.classList.remove("flipped");
        cardQuery = [];
        flipCount = 0;
  
      }, 1000);
    }
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    let newDiv = document.createElement("div");
    newDiv.classList.add(color, "card-container");

    let front = document.createElement("div");
    front.classList.add("front-face");
    front.style.backgroundColor = color;

    let back = document.createElement("div");
    back.classList.add("back-face");

    newDiv.appendChild(back);
    newDiv.appendChild(front);

    // call a function handleCardClick when a div is clicked on
    back.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function updateScore() {
  scoreBoard = document.querySelector("#score");
  scoreBoard.innerText = "Score: " + `${score}`;
}

function getBest() {
  let bestBoard = document.querySelector("#best");
  let best = localStorage.getItem('best');
  if (typeof best !== 'undefined' && best !== null){
    bestBoard.innerText = "Best: " + best;
  } else {
    bestBoard.innerText = "Best: ";
  }
}

function updateBest() {
  bestBoard = document.querySelector("#best");
  let best = localStorage.getItem('best');

  if (typeof best === 'undefined' || best === null){
    bestBoard.innerText = "Best: " + `${score}`;
    localStorage.setItem('best', score);
  } else {
    if (score < parseInt(best)){
      bestBoard.innerText = "Best: " + `${score}`;
      localStorage.setItem('best', score);
    }
  }
}

function reset() {
  let cards = document.querySelectorAll(".card-container");
  let colorIndex = 0;
  let newSC = shuffle(shuffledColors);

  for (let card of cards) {
    card.classList.remove("flipped");
    color = card.classList[0];
    card.classList[0] = newSC[colorIndex];
    card.children[0].addEventListener("click", handleCardClick);
    card.children[1].style.backgroundColor = newSC[colorIndex];
    colorIndex++;
  }

  let playAgain = document.querySelector("#play-again");
  playAgain.style.opacity = 0;
  score = 0;
  matchedCards = [];
  updateScore();
}

function checkEndGame() {
    if (matchedCards.length === COLORS.length){
      let playAgain = document.querySelector("#play-again");
      playAgain.style.opacity = "1";
      playAgain.addEventListener("click", reset);
      updateBest();
    }
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked

  if (flipCount === 0){
    event.target.parentElement.classList.add("flipped");
    cardQuery.push(event.target);
    flipCount++;
  } else if (flipCount === 1) {

    if (cardQuery[0] !== event.target) {
      event.target.parentElement.classList.add("flipped");
      cardQuery.push(event.target);
      flipCount++;
      checkMatch(cardQuery[0], cardQuery[1]);
    }

  } else {
    return;
  }
  
}

// when the DOM loads
let game = document.querySelector("#game");
let start = document.querySelector("#start-box");
addEventListener('DOMContentLoaded', getBest);

start.addEventListener("click", function() {
  start.style.bottom = "800px";
  game.style.top = "0px";
  createDivsForColors(shuffledColors);
});

