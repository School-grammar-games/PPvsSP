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
let isGameRunning = false;


const speechBubbles = {
  'I __________ to England last summer.': 'yes-button',
  'I __________to England recently.': 'no-button',
  'He __________ breakfast already': 'yes-button',
  'He __________ breakfast this morning': 'no-button',
  'She __________ her bike to school yesterday.': 'no-button',
  'She __________ her bike every day this week.': 'yes-button',
  'He __________ his room yesterday.': 'yes-button',
  'He __________ his room every day this week.': 'no-button',
  'They __________ the movie already.': 'yes-button',
  'They __________ the movie last night.': 'no-button',
  'I __________ my homework an hour ago.': 'yes-button',
  'I __________ my homework every day this week.': 'yes-button',
  'She __________ her dog for a walk yesterday.': 'no-button',
  'She __________ her dog for a walk every day this week.': 'yes-button',
  'She __________ her grandmother yesterday.': 'yes-button',
  'She __________ her grandmother twice this week.': 'yes-button',
  'He __________ his phone in the morning and now cannot call his parents.': 'no-button',
  'He __________ his phone every day this week.': 'yes-button',
  'They __________ each other for 5 years.': 'yes-button',
  'They __________ each other when they were children.': 'yes-button',
  'I __________ a new book last week.':  'no-button',
  'I __________ 3 books this month.': 'no-button',
  'She __________ her coffee already.': 'yes-button',
  'She __________ her coffee 10 minutes ago.': 'no-button',
};

const buttonLabels = {
  'I __________ to England last summer.': ['traveled', 'have traveled'],
  'I __________to England recently.': ['traveled', 'have traveled'],
  'He __________ breakfast already': ['has eaten', 'ate'],
  'He __________ breakfast this morning': ['has eaten', 'ate'],
  'She __________ her bike to school yesterday.': ['has ridden', 'rode'],
  'She __________ her bike every day this week.': ['has ridden', 'rode'],
  'He __________ his room yesterday.': ['cleaned', 'has cleaned'],
  'He __________ his room every day this week.': ['cleaned', 'has cleaned'],
  'They __________ the movie already.': ['have seen', 'saw'],
  'They __________ the movie last night.': ['have seen', 'saw'],
  'I __________ my homework an hour ago.': ['finished', 'have finished'],
  'I __________ my homework every day this week.': ['have finished', 'finished'],
  'She __________ her dog for a walk yesterday.': ['has taken', 'took'],
  'She __________ her dog for a walk every day this week.': ['has taken', 'took'],
  'She __________ her grandmother yesterday.': ['visited', 'has visited'],
  'She __________ her grandmother twice this week.': ['has visited', 'visited'],
  'He __________ his phone in the morning and now cannot call his parents.': ['forgot', 'has forgotten'],
  'He __________ his phone every day this week.': ['has forgotten', 'forgot'],
  'They __________ each other for 5 years.': ['have known', 'knew'],
  'They __________ each other when they were children.': ['knew', 'have known'],
  'I __________ a new book last week.':  ['have bought', 'bought'],
  'I __________ 3 books this month.': ['bought', 'have bought'],
  'She __________ her coffee already.': ['has finished', 'finished'],
  'She __________ her coffee 10 minutes ago.': ['has finished', 'finished'],
};

const unusedKeys = Object.keys(speechBubbles);

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
    noButton.addEventListener('click', () => {
      hasClickedYes = true;
      currentSpeechBubble = 'I __________ to England last summer.';
      speechBubble.textContent = currentSpeechBubble;
      yesButton.textContent = buttonLabels[currentSpeechBubble][0];
      noButton.textContent = buttonLabels[currentSpeechBubble][1];
    }, { once: true });
  } else {
    checkAnswer('no-button');
  }
});

function getNextSpeechBubble() {
  if (unusedKeys.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * unusedKeys.length);
  const selectedKey = unusedKeys[randomIndex];
  removeUsedKey(selectedKey);
  return selectedKey;
}

function removeUsedKey(key) {
  const index = unusedKeys.indexOf(key);
  if (index !== -1) {
    unusedKeys.splice(index, 1);
  }
}

function updateScoreDisplay() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = 'Score: ' + score;

  // check score and update background image and new character image accordingly
  if (score >= 0 && score <= 400) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene1.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char.png');
  } else if (score >= 500 && score <= 800) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene2.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char2.png');
  } else if (score >= 1000 && score <= 1400) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene3.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char3.png');
    removeImageElement(900);
  } else if (score >= 1500 && score <= 1900) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene4.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char4.png');
  } else if (score >= 2100 && score <= 2300) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene5.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char5.png');
    removeImageElement(2000);
  } else if (score >= 2400 && score <= 2800) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene6.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char6.png');
    removeImageElement(2900);
  }
  
  // add images at 900, 2000, and 2900 points
  if (score === 900) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/1to2world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(900);
  } else if (score === 2000) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/2to3world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(2000);
  } else if (score === 2900) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/3to4world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(2900);
  }
}

function removeImageElement(scoreValue) {
  if (scoreValue === 1000 || scoreValue === 2100 || scoreValue === 3000) {
    const transitionImage1 = document.querySelector('.game-container img[src$="1to2world.png"]');
    if (transitionImage1) {
      transitionImage1.remove();
    }

    const transitionImage2 = document.querySelector('.game-container img[src$="2to3world.png"]');
    if (transitionImage2) {
      transitionImage2.remove();
    }
  }
}


function addContinueButton(scoreValue) {
  const continueButton = document.createElement('button');
  continueButton.textContent = 'Continue';
  continueButton.classList.add('continue-button');
  continueButton.addEventListener('click', () => {
    score += 100; // Update the global score variable
    updateScoreDisplay();
    removeImageElement(score); // Call the removeImageElement function with the updated global score
    continueButton.remove();
  });

  if (scoreValue === 900 || scoreValue === 2000 || scoreValue === 2900) {
    document.querySelector('.game-container').appendChild(continueButton);
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

  document.querySelector('.game-over-container').appendChild(gameOverImage);
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
      gameOver(true);
    }
  } else {
    gameOver(false);
  }
}

function gameOver(isWin) {
  if (isWin) {
    speechBubble.textContent = 'Congratulations, you have completed the game!';
  } else {
    speechBubble.textContent = 'Incorrect! Game Over.';
  }

  yesButton.style.display = 'none';
  noButton.style.display = 'none';
  document.querySelector('.game-container').style.display = 'none';
  document.querySelector('.game-over-container').style.display = 'block';

  showGameOverImage();
  showFinalScore();
  document.getElementById('replayButton').style.display = 'block'; // Show the "Replay" button
}

function showFinalScore() {
  const finalScoreElement = document.createElement('div');
  finalScoreElement.setAttribute('id', 'finalScore');
  finalScoreElement.textContent = 'Final Score: ' + score;
  document.querySelector('.game-over-container').appendChild(finalScoreElement);
}

function resetGame() {
  document.querySelector('.game-container').style.display = 'block';
  document.querySelector('.game-over-container').style.display = 'none';
  document.getElementById('gameOverImage').style.display = 'none';
  document.getElementById('finalScore').remove();

  positionX = 0;
  score = 0;
  updateScoreDisplay();
  hasClickedYes = false;
  currentSpeechBubble = Object.keys(speechBubbles)[0];
  yesButton.textContent = 'Yes';
  noButton.textContent = 'No';
  yesButton.style.display = 'block';
  noButton.style.display = 'block';
  speechBubble.textContent = 'Hello! Welcome to the game! To continue you need to choose the present perfect or the simple past. Here\'s the first task, are you ready?';

  unusedKeys = Object.keys(speechBubbles);
  isGameRunning = false;
  moveSpeed = 3; // reset the moveSpeed to its initial value
  gameLoop();
}

function gameLoop() {
  if (!isGameRunning) {
    isGameRunning = true;
  }

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

document.getElementById('replayButton').addEventListener('click', () => {
  resetGame();
});