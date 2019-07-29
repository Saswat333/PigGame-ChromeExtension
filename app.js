/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
*/

var globalScore,
  roundScore,
  activePlayer,
  gamePlaying,
  winningScore,
  inputScore;

//chrome extension code

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({
    url: chrome.extension.getURL("index.html"),
    selected: true
  });
});
//intialise all the above parameter values
init();

/****** ROLL BUTTON FUNCTION ******/
document.querySelector(".btn-roll").addEventListener("click", function() {
  if (gamePlaying) {
    //disable the finalscore placeholder
    document.getElementById("final-score-1").disabled = true;
    //1. generate random number
    var diceValue1 = Math.floor(Math.random() * 6) + 1;
    var diceValue2 = Math.floor(Math.random() * 6) + 1;
    /*
     console.log(diceValue1);
     console.log(diceValue2);
    */
    //2. Display the disk block and result in DICE image
    document.getElementById("dice-1").style.display = "block";
    document.getElementById("dice-2").style.display = "block";

    document.getElementById("dice-1").src = "dice-" + diceValue1 + ".png";
    document.getElementById("dice-2").src = "dice-" + diceValue2 + ".png";

    //3.Update the score of local and global IF rolled value not 1 & if value is 1 the localScore = 0

    if (diceValue1 === 6 && diceValue2 === 6) {
      //player loses gobalscore
      globalScore[activePlayer] = 0;
      document.querySelector("#score-" + activePlayer).textContent = "0";
      nextPlayer();
    } else if (diceValue1 === 1 && diceValue2 === 1) {
      nextPlayer();
    } else {
      roundScore += diceValue1 + diceValue2;
      document.querySelector(
        "#current-" + activePlayer
      ).textContent = roundScore;
    }

    //4. reset the score if
  }
});

/****** HOLD BUTTON FUNCTION ******/
document.querySelector(".btn-hold").addEventListener("click", function() {
  if (gamePlaying) {
    //ADD  current score to global score
    globalScore[activePlayer] += roundScore;
    //update in UI
    document.querySelector("#score-" + activePlayer).textContent =
      globalScore[activePlayer];
    //checking for WINNING SCORE
    inputScore = document.querySelector(".final-score").value;
    checkFinalScore();
    //check if player won
    if (globalScore[activePlayer] >= winningScore) {
      document.getElementById("name-" + activePlayer).textContent =
        "WINNER !!!";
      document.getElementById("dice-1").style.display = "none"; //if any player wins remove the dice
      document.getElementById("dice-2").style.display = "none";
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");
      gamePlaying = false;
    } else {
      //next player
      nextPlayer();
    }
  }
});

function nextPlayer() {
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
  roundScore = 0;

  //update currentscore as 0, when hit 1
  document.getElementById("current-0").textContent = 0;
  document.getElementById("current-1").textContent = 0;

  //move the active panel to other player:: here toggle can change the class, remove from one place and add in another
  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");
  //hide the dice when player switch
  document.getElementById("dice-1").style.display = "none";
  document.getElementById("dice-2").style.display = "none";
}

/****** NEW BUTTON FUNCTION ******/
document.querySelector(".btn-new").addEventListener("click", init);

/****** RULES BUTTON FUNCTION **/
var modal = document.getElementById("myModal");
var btn = document.querySelector(".btn-rule");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
  modal.style.display = "block";
};
span.onclick = function() {
  modal.style.display = "none";
};
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
/**** INITIALISE ****/
function init() {
  globalScore = [0, 0];
  roundScore = 0;
  activePlayer = 0; // player1 = 0   player2 = 1
  gamePlaying = true;

  document.getElementById("final-score-1").disabled = false;
  var finScore = document.getElementById("final-score-1");
  finScore.value = "200";
  //hiding the dice block at the start of game
  document.getElementById("dice-1").style.display = "none";
  document.getElementById("dice-2").style.display = "none";

  //intialising all the global and current score of the players
  document.getElementById("score-0").textContent = 0;
  document.getElementById("score-1").textContent = 0;
  document.getElementById("current-0").textContent = 0;
  document.getElementById("current-1").textContent = 0;

  document.getElementById("name-0").textContent = "Player 1";
  document.getElementById("name-1").textContent = "Player 2";

  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");

  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");
}

function checkFinalScore() {
  //Undefined, null, 0, "", negative value are all COERED to false, anyother value coered to true
  if (inputScore > 0) {
    winningScore = inputScore;
  } else {
    winningScore = 60;
  }
}
