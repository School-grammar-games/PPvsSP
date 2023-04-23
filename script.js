const gameObject = document.querySelector('.game-object');
const yesButton = document.querySelector('.yes-button');
const noButton = document.querySelector('.no-button');
const speechBubble = document.querySelector('.speech-bubble');
const newCharacter = document.querySelector('.new-character');
const gameOverImage = document.getElementById('gameOverImage');
let positionX = 0;
const moveSpeed = 3;
const gameContainerWidth = document.querySelector('.game-container').clientWidth;
const gameObjectWidth = gameObject.clientWidth;
const stopPositionX = gameContainerWidth * 0.6;

let hasClickedYes = false;
let currentSpeechBubble;
let score = 0;
let selectedCharacter;

const speechBubbles = {
  'I __________ to England last summer.': 'yes-button',
  'I __________to England recently.': 'no-button',
  'He __________ breakfast already': 'yes-button',
  'He __________ breakfast this morning': 'no-button',
};

const buttonLabels = {
  'I __________ to England last summer.': ['traveled', 'have traveled'],
  'I __________to England recently.': ['traveled', 'have traveled'],
  'He __________ breakfast already': ['has eaten', 'ate'],
  'He __________ breakfast this morning': ['has eaten', 'ate'],
};

function startGame(character) {
    const characterSelection = document.getElementById('characterSelection');
    characterSelection.style.display = 'none';
    gameObject.style.backgroundImage = `url('Character_images/${character}.png')`;
    gameObject.style.backgroundSize = 'cover';
    document.querySelector('.new-character').style.display = 'block';
    document.querySelector('.speech-bubble').style.display = 'none';
    yesButton.style.display = 'none';
    noButton.style.display = 'none';
    selectedCharacter = character;
    gameLoop();
  }
  
document.querySelectorAll('.character-option').forEach(option => {
  option.addEventListener('click', () => {
    const selectedCharacter = option.dataset.character;
    startGame(selectedCharacter);
  });
});

yesButton.addEventListener('click', () => {
  if (!hasClickedYes) {
    hasClickedYes = true;
    currentSpeechBubble = 'I __________ to England last summer.';
    speechBubble.textContent = currentSpeechBubble;
    yesButton.textContent = buttonLabels[currentSpeechBubble][0];
    noButton.textContent = buttonLabels[currentSpeechBubble][1];
  } else {
    checkAnswer('yes-button');
  }
});

noButton.addEventListener('click', () => {
  if (!hasClickedYes) {
    speechBubble.textContent = 'Okay, study the grammar rules again, maybe you can beat your old high score!';
    yesButton.style.display = 'none';
    noButton.textContent = 'Continue';
  } else {
    checkAnswer('no-button');
  }
});

function getNextSpeechBubble(current) {
  const keys = Object.keys(speechBubbles);
  const index = keys.indexOf(current);
  if (index < keys.length - 1) {
    return keys[index + 1];
  }
  return null;
}

function updateScoreDisplay() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = 'Score: ' + score;
}

function checkAnswer(clickedButton) {
  if (speechBubbles[currentSpeechBubble] === clickedButton) {
    score += 100;
    updateScoreDisplay();

    speechBubble.textContent = 'Correct!';
    currentSpeechBubble = getNextSpeechBubble(currentSpeechBubble);
    if (currentSpeechBubble) {
      setTimeout(() => {
        speechBubble.textContent = currentSpeechBubble;
        yesButton.textContent = buttonLabels[currentSpeechBubble][0];
        noButton.textContent = buttonLabels[currentSpeechBubble][1];
    }, 1500);
} else {
  // Display "Game Over" or other final message here
  speechBubble.textContent = 'Congratulations, you have completed the game!';
  yesButton.style.display = 'none';
  noButton.style.display = 'none';
}
} else {
speechBubble.textContent = 'Incorrect! Game Over.';
// Display "Game Over" or other final message here
yesButton.style.display = 'none';
noButton.style.display = 'none';
showGameOverImage();
}
}

function showGameOverImage() {
    const gameOverImage = document.createElement('img');
    gameOverImage.setAttribute('id', 'gameOverImage');
  
    if (selectedCharacter === 'F_char') {
      gameOverImage.setAttribute('src', 'Finish_images/F_char_GAME.png');
    } else if (selectedCharacter === 'M_char') {
      gameOverImage.setAttribute('src', 'Finish_images/M_char_GAME.png');
    }
  
    document.querySelector('.game-container').appendChild(gameOverImage);
  }

function gameLoop() {
positionX += moveSpeed;

if (positionX > stopPositionX) {
positionX = stopPositionX;
document.querySelector('.speech-bubble').style.display = 'block';
yesButton.style.display = 'block';
noButton.style.display = 'block';
}

gameObject.style.left = positionX + 'px';
gameObject.style.bottom = '5%';
requestAnimationFrame(gameLoop);
}