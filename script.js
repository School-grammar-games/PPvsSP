const gameObject = document.querySelector('.game-object');
const yesButton = document.querySelector('.yes-button');
const noButton = document.querySelector('.no-button');
const speechBubble = document.querySelector('.speech-bubble');
const newCharacter = document.querySelector('.new-character');
let positionX = 0;
const moveSpeed = 3;
const gameContainerWidth = document.querySelector('.game-container').clientWidth;
const gameObjectWidth = gameObject.clientWidth;
const stopPositionX = gameContainerWidth * 0.6; // Calculate the stop position at 60% of screen length

let hasClickedYes = false;
let currentSpeechBubble;

const speechBubbles = {
    'I __________ to England last summer': 'yes-button',
    'I traveled to England last summer': 'no-button',
    'He has eaten breakfast already': 'yes-button',
    'He ate breakfast this morning': 'no-button'
};

function startGame(selectedCharacter) {
    const characterSelection = document.getElementById('characterSelection');
    characterSelection.style.display = 'none';
    gameObject.style.backgroundImage = `url('Character_images/${selectedCharacter}.png')`;
    gameObject.style.backgroundSize = 'cover';
    document.querySelector('.new-character').style.display = 'block';
    document.querySelector('.speech-bubble').style.display = 'none';
    yesButton.style.display = 'none';
    noButton.style.display = 'none';
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
      currentSpeechBubble = 'I __________ to England last summer';
      speechBubble.textContent = currentSpeechBubble;
      yesButton.textContent = 'traveled';
      noButton.textContent = 'have traveled';
      hasClickedYes = true;
    } else {
      // Check answer here
      if (speechBubbles[currentSpeechBubble] === 'yes-button') {
        speechBubble.textContent = 'Correct!';
        currentSpeechBubble = 'I traveled to England last summer';
      } else {
        speechBubble.textContent = 'Incorrect!';
      }
      // Update button texts for the next speech bubble
      yesButton.textContent = 'He has eaten';
      noButton.textContent = 'He ate';
      // Update speechBubble text to the next speech bubble
      speechBubble.textContent = currentSpeechBubble;
      // Update the correct button for the next speech bubble
      if (speechBubbles[currentSpeechBubble] === 'yes-button') {
        yesButton.removeEventListener('click', noButtonClickHandler);
        yesButton.addEventListener('click', yesButtonClickHandler);
      } else {
        yesButton.removeEventListener('click', yesButtonClickHandler);
        yesButton.addEventListener('click', noButtonClickHandler);
      }
    }
  });  

  noButton.addEventListener('click', () => {
    if (!hasClickedYes) {
        speechBubble.textContent = 'No problem. Take your time and choose what you feel more comfortable with.';
        noButton.textContent = 'Continue';
    } else {
        // Check answer here
        if (speechBubbles[currentSpeechBubble] === 'no-button') {
            speechBubble.textContent = 'Correct!';
        } else {
            speechBubble.textContent = 'Incorrect!';
        }
    }
});

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
