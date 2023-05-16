const gameObject = document.querySelector('.game-object');
const yesButton = document.querySelector('.yes-button');
const noButton = document.querySelector('.no-button');
const speechBubble = document.querySelector('.speech-bubble');
const newCharacter = document.querySelector('.new-character');
const gameOverImage = document.getElementById('gameOverImage');
const gameContainerWidth = document.querySelector('.game-container').clientWidth;
const gameObjectWidth = gameObject.clientWidth;
let positionX = 0;
const moveSpeed = 3;
const stopPositionX = gameContainerWidth * 0.6;
const characterImageM1 = new Image();
const characterImageM2 = new Image();
const characterImageF1 = new Image();
const characterImageF2 = new Image();

loadAssets(() => console.log('Assets loaded'));

function loadAssets(callback) {
  let assetsLoaded = 0;
  
  function assetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === 4) {
      callback();
    }
  }
  
  characterImageM1.src = 'Character_images/M_char_a.png';
  characterImageM1.onload = assetLoaded;

  characterImageM2.src = 'Character_images/M_char_b.png';
  characterImageM2.onload = assetLoaded;

  characterImageF1.src = 'Character_images/F_char_a.png';
  characterImageF1.onload = assetLoaded;

  characterImageF2.src = 'Character_images/F_char_b.png';
  characterImageF2.onload = assetLoaded;
};

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
  'We __________ the movie, but we do not remember the ending.': 'no-button',
  'She __________ her homework before dinner.': 'yes-button',
  'She __________ her homework, so she can watch TV now.': 'no-button',
  'They __________ to the concert yesterday.': 'yes-button',
  'They __________ to the concert, but they did not enjoy it.': 'no-button',
  'I __________ my keys in the car.': 'yes-button',
  'I __________ my keys in the car, so I cannot drive now.': 'no-button',
  'He __________ a book two weeks ago.': 'yes-button',
  'He __________ a book, but he cannot remember the title.': 'no-button',
  'They __________ a new restaurant last week.': 'yes-button',
  'They __________ a new restaurant and want to go again.': 'no-button',
  'She __________ the dishes after lunch.': 'yes-button',
  'She __________ the dishes, so the kitchen is clean.': 'no-button',
  'We __________ to the beach an hour ago.': 'yes-button',
  'We __________ to the beach, and the weather is perfect.': 'no-button',
  'They __________ a soccer match last Saturday.': 'yes-button',
  'They __________ a soccer match, but they did not win.': 'no-button',
  'He __________ a letter to his friend yesterday.': 'yes-button',
  'He __________ a letter to his friend, but he has not received a reply yet.': 'no-button',
  'She __________ a bike for her birthday last month.': 'yes-button',
  'She __________ a bike for her birthday, so she can ride to school.': 'no-button',
  'I __________ my passport when I traveled to Italy in 2022.': 'yes-button',
  'I __________ my passport, so I know where it is.': 'no-button',
  'They __________ a party last weekend.': 'yes-button',
  'They __________ a party, and everyone had a great time.': 'no-button',
  'I __________ a long walk in the park this morning.': 'yes-button',
  'I __________ a long walk in the park, so I feel refreshed.': 'no-button',
  'She __________ her driving test two months ago.': 'yes-button',
  'She __________ her driving test, so she can drive now.': 'no-button',
  'He __________ the museum during his trip to Paris.': 'yes-button',
  'He __________ the museum, and he really enjoyed the art.': 'no-button',
  'We __________ our grandparents last weekend.': 'yes-button',
  'We __________ our grandparents, and they are doing well.': 'no-button',
  'She __________ her room yesterday.': 'yes-button',
  'She __________ her room, so it looks nice and tidy now.': 'no-button',
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
  'We __________ the movie, but we do not remember the ending.': ['watched', 'have watched'],
  'She __________ her homework before dinner.': ['did', 'has done'],
  'She __________ her homework, so she can watch TV now.': ['did', 'has done'],
  'They __________ to the concert yesterday.': ['went', 'have gone'],
  'They __________ to the concert, but they did not enjoy it.': ['went', 'have gone'],
  'I __________ my keys in the car.': ['left', 'have left'],
  'I __________ my keys in the car, so I cannot drive now.': ['left', 'have left'],
  'He __________ a book two weeks ago.': ['read', 'has read'],
  'He __________ a book, but he cannot remember the title.': ['read', 'has read'],
  'They __________ a new restaurant last week.': ['tried', 'have tried'],
  'They __________ a new restaurant and want to go again.': ['tried', 'have tried'],
  'She __________ the dishes after lunch.': ['washed', 'has washed'],
  'She __________ the dishes, so the kitchen is clean.': ['washed', 'has washed'],
  'We __________ to the beach an hour ago.': ['arrived', 'have arrived'],
  'We __________ to the beach, and the weather is perfect.': ['arrived', 'have arrived'],
  'They __________ a soccer match last Saturday.': ['played', 'have played'],
  'They __________ a soccer match, but they did not win.': ['played', 'have played'],
  'He __________ a letter to his friend yesterday.': ['wrote', 'has written'],
  'He __________ a letter to his friend, but he has not received a reply yet.': ['wrote', 'has written'],
  'She __________ a bike for her birthday last month.': ['got', 'has gotten'],
  'She __________ a bike for her birthday, so she can ride to school.': ['got', 'has gotten'],
  'I __________ my passport when I traveled to Italy in 2022.': ['used', 'have used'],
  'I __________ my passport, so I know where it is.': ['used', 'have used'],
  'They __________ a party last weekend.': ['had', 'have had'],
  'They __________ a party, and everyone had a great time.': ['had', 'have had'],
  'I __________ a long walk in the park this morning.': ['took', 'have taken'],
  'I __________ a long walk in the park, so I feel refreshed.': ['took', 'have taken'],
  'She __________ her driving test two months ago.': ['passed', 'has passed'],
  'She __________ her driving test, so she can drive now.': ['passed', 'has passed'],
  'He __________ the museum during his trip to Paris.': ['visited', 'has visited'],
  'He __________ the museum, and he really enjoyed the art.': ['visited', 'has visited'],
  'We __________ our grandparents last weekend.': ['saw', 'have seen'],
  'We __________ our grandparents, and they are doing well.': ['saw', 'have seen'],
  'She __________ her room yesterday.': ['cleaned', 'has cleaned'],
  'She __________ her room, so it looks nice and tidy now.': ['cleaned', 'has cleaned'],
};

function chooseBubble() {
  const availableKeys = Object.keys(speechBubbles).filter(key => !usedKeys.includes(key));

  if (availableKeys.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableKeys.length);
  const selectedKey = availableKeys[randomIndex];
  usedKeys.push(selectedKey);
  return selectedKey;
}

const usedKeys = [];

function resetUsedKeys() {
  usedKeys.length = 0;
}

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
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene7.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char7.png');
    removeImageElement(900);
  } else if (score >= 1500 && score <= 1900) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene8.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char8.png');
  } else if (score >= 2100 && score <= 2500) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene4.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char4.png');
    removeImageElement(2000);
  } else if (score >= 2500 && score <= 3100) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene3.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char3.png');
    removeImageElement(3200);
  } else if (score >= 3300 && score <= 3700) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene5.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char5.png');
    removeImageElement(2000);
  } else if (score >= 3700 && score <= 4200) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene6.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char6.png');
    removeImageElement(2000);
  } else if (score >= 4400 && score <= 4900) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene9.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char11.png');
    removeImageElement(2000);
  } else if (score >= 5000 && score <= 5500) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene10.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char9.png');
    removeImageElement(2000);
  } else if (score >= 5700 && score <= 6300) {
    document.querySelector('.game-container').style.backgroundImage = 'url("Background_images/Scene11.png")';
    newCharacter.setAttribute('src', 'Character_images/Q_char10.png');
    removeImageElement(5600);
  } else if (score >= 6400) {
    // Display the winning image when the score is over 6400
    document.querySelector('.game-container').style.backgroundImage = 'url("Win_image/gewonnen.png")';
 // Create a new div
 var div = document.createElement('div');

 // Set the id to 'winningScreen'
 div.id = 'winningScreen';

 // Append the div to the game container
 document.querySelector('.game-container').appendChild(div);
}
  
  // add images at 900, 2000, 3200, 4300 and 5600 points
  if (score === 900) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/1to2world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(900);
  } else if (score === 2000) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/4to5world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(2000);
  } else if (score === 3200) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/2to3world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(3200);
  } else if (score === 4300) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/3to4world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(4300);
  } else if (score === 5600) {
    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', 'Transition_images/5to6world.png');
    document.querySelector('.game-container').appendChild(imageElement);
    addContinueButton(5600);
  }
}

function removeImageElement(scoreValue) {
  if (scoreValue === 1000 || scoreValue === 2100 || scoreValue === 3300 || scoreValue === 4400 || scoreValue === 5600) {
    const transitionImage1 = document.querySelector('.game-container img[src$="1to2world.png"]');
    if (transitionImage1) {
      transitionImage1.remove();
    }

    const transitionImage2 = document.querySelector('.game-container img[src$="4to5world.png"]');
    if (transitionImage2) {
      transitionImage2.remove();
    }

    const transitionImage3 = document.querySelector('.game-container img[src$="2to3world.png"]');
    if (transitionImage3) {
      transitionImage3.remove();
    }

    const transitionImage4 = document.querySelector('.game-container img[src$="3to4world.png"]');
    if (transitionImage4) {
      transitionImage4.remove();
    }

    const transitionImage5 = document.querySelector('.game-container img[src$="5to6world.png"]');
    if (transitionImage5) {
      transitionImage5.remove();
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

  if (scoreValue === 900 || scoreValue === 2000 || scoreValue === 3200 || scoreValue === 4300 || scoreValue === 5600) {
    document.querySelector('.game-container').appendChild(continueButton);
  }
}

function showGameOverImage() {
  const gameOverImage = document.createElement('img');
  gameOverImage.setAttribute('id', 'gameOverImage');

  if (selectedCharacter === 'F_char') {
    gameOverImage.setAttribute('src', 'Finish_images/F_char_lose.png');
  } else if (selectedCharacter === 'M_char') {
    gameOverImage.setAttribute('src', 'Finish_images/M_char_lose.png');
  }

  document.querySelector('.game-over-container').appendChild(gameOverImage);
}

function showWinGameImage() {
  const winGameImage = document.createElement('img');
  winGameImage.setAttribute('id', 'winGameImage');

  if (selectedCharacter === 'F_char') {
    winGameImage.setAttribute('src', 'Finish_images/F_char_win.png');
  } else if (selectedCharacter === 'M_char') {
    winGameImage.setAttribute('src', 'Finish_images/M_char_win.png');
  }

  document.querySelector('.game-over-container').appendChild(gameOverImage);
}

function checkAnswer(clickedButton) {
  if (speechBubbles[currentSpeechBubble] === clickedButton) {
    score += 100;
    updateScoreDisplay();

    speechBubble.textContent = 'Correct!';
    currentSpeechBubble = chooseBubble();
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

  resetUsedKeys(); // Add this line to reset usedKeys array when the game is reset
  isGameRunning = false;
  moveSpeed = 3; // reset the moveSpeed to its initial value
  gameLoop();
}

let frameCounter = 0;
const framesPerSwitch = 15;

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
  } else {
    // Increment the frame counter
    frameCounter++;

    // Switch the character image based on the frame counter
    if (frameCounter >= framesPerSwitch * 2) {
      frameCounter = 0;
    }

    if (selectedCharacter === 'F_char') {
      gameObject.style.backgroundImage = `url('Character_images/${frameCounter < framesPerSwitch ? 'F_char_a' : 'F_char_b'}.png')`;
    } else if (selectedCharacter === 'M_char') {
      gameObject.style.backgroundImage = `url('Character_images/${frameCounter < framesPerSwitch ? 'M_char_a' : 'M_char_b'}.png')`;
    }
  }

  gameObject.style.left = positionX + 'px';
  gameObject.style.bottom = '5%';
  requestAnimationFrame(gameLoop);
}

document.getElementById('replayButton').addEventListener('click', () => {
  resetGame();
});

