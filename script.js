
function unHighlight(btn){
  btn.classList.remove("buttonHover");
}

function highlight(btn){
  btn.classList.add("buttonHover");
}

function computerChoice(){
  let choice = ["rock", "paper", "scissors"];
  return choice[Math.floor(Math.random()*3)];
} 

function unHighlightAllButtons(){
  const myButtons = document.querySelectorAll(".myButton");
  const compButtons = document.querySelectorAll(".compButton");
  for(let i=0; i<myButtons.length; i++){
    if(myButtons[i].classList.contains("buttonHover")){
      myButtons[i].classList.remove("buttonHover");;
    }
  }
  for(let i=0; i<compButtons.length; i++){
    if(compButtons[i].classList.contains("buttonHover")){
      compButtons[i].classList.remove("buttonHover");;
    }
  }
}

function roundResult (playerSelection, computerSelection) {
  if (playerSelection.toLowerCase() === computerSelection) {
    return `Your ${playerSelection} ties with Computer's ${computerSelection.toUpperCase()}. It's a TIE.`;
  } 
  else if (playerSelection.toLowerCase() === 'rock'){
    switch (computerSelection){
      case 'paper':
        return `Computer's PAPER beats your ROCK. You LOSE.`
      case 'scissors':
        return `Your ROCK beats Computer's SCISSORS. You WIN!`;
    }
  } 
  else if (playerSelection.toLowerCase() === 'paper'){
    switch (computerSelection){
        case 'rock':
          return `Your PAPER beats Computer's ROCK. You WIN!`;
        case 'scissors':
          return `Computer's SCISSORS beats your PAPER. You LOSE.`;
    }
  } 
  else if (playerSelection.toLowerCase() === 'scissors'){
    switch (computerSelection){
        case 'rock':
          return `Computer's ROCK beats your SCISSORS. You LOSE.`;
        case 'paper':
          return `Your SCISSORS beats Computer's PAPER. You WIN!`;
    }
  }    
}

function animateComputer(computerSelection, pScore, cScore, pScoreDiv, cScoreDiv){ 
  let millisecDelay = 40; // millisecond highlight interval
  let iterations = 30; // number of iterations
  let i = 0; // loop index 
  const compButtonClassList = document.querySelectorAll(".compButton"); // List of buttons to highlight
  const compSelectionBtn = document.getElementById(computerSelection);  // Final button to highlight 
  const audioBeeps = document.getElementById("beeps"); // Beep
  animate(compButtonClassList, compSelectionBtn); // Declared below

  function animate(classes, finalBtn) { // *Recursive loop makes setTimeout work in real time
    let num = Math.floor(Math.random()*3) // random number from 0 to 2
    highlight(classes[num]); //  highlight a random button
    audioBeeps.play(); // Beep 
    setTimeout(()=>{ //  code to be executed after delay 
      unHighlight(classes[num]); // Un-highlight what was highlighted 
      i++; // Increment counter
      if (i < iterations) { // If we have not finished all iterations,
        animate(classes, finalBtn); // *Recursion: iterate
      } else { // If we have finished all iterations,
        highlight(finalBtn); // Final actions 
        pScoreDiv.textContent = pScore;
        cScoreDiv.textContent = cScore;
      } 
    }, millisecDelay); //  millisecond interval 
  }
  
}

function announceResult(result){
  let primaryDelay = 1200; // Set to duration of animateComputer() to run this after it
  let secondaryDelay = 300; // Blink frequency
  let i = 0; 
  let iterations = 1; 
  const centreDiv = document.getElementById("centreDiv");
  const audioWin = document.getElementById("win"); // Beep
  const audioLose = document.getElementById("lose"); // Beep 
  const audioTie = document.getElementById("tie"); // Beep 

  centreDiv.textContent = result;
  centreDiv.style.visibility = "hidden";
  flashText(centreDiv); // Declared below

  function flashText(node) { // Recursive
    setTimeout(()=>{
      centreDiv.style.visibility = " visible";
      setTimeout(()=>{
        centreDiv.style.visibility = "hidden";
        setTimeout(()=>{
          centreDiv.style.visibility = "visible";
          if (result.includes('You WIN')) { 
            audioWin.play();
          } else if (result.includes('You LOSE')) { 
            audioLose.play();
          } else if (result.includes("It's a TIE")) {
            audioTie.play();
          };
          setTimeout(()=>{
            centreDiv.style.visibility = "hidden";
            setTimeout(()=>{
              centreDiv.style.visibility = "visible";
            }, secondaryDelay);
          }, secondaryDelay);
        }, secondaryDelay);
      }, secondaryDelay);
      i++;
      if(i<iterations){
        flashText(node); // Recursion
      } 
    }, primaryDelay);
  } 

}

function finalResultScreen(playerScore, computerScore){
  let millisecDelay = 1200;
  const centreDiv = document.getElementById("centreDiv");
  centreDiv.style.visibility = "hidden";
  const bottomHeading = document.getElementById("bottomHeading");
  const restartButton = document.getElementById("restartButton");
  const audioGameOver = document.getElementById("gameOver"); // Music

  setTimeout(()=>{
    bottomHeading.style.visibility = "visible";
    restartButton.style.visibility = "visible";
    audioGameOver.play();
    if (playerScore === computerScore){
      bottomHeading.textContent = `Game over. It's a ${playerScore}:${computerScore} Tie!`;
    } else if (playerScore > computerScore){
      bottomHeading.textContent = `Game over. Player WINS ${playerScore} to ${computerScore}!`;
    } else if (playerScore < computerScore){
      bottomHeading.textContent = `Game over. Computer WINS ${computerScore} to ${playerScore}!`;
    }  
  }, millisecDelay);
}

function play(){
  let btnSelected;
  let playerScore = 0;
  let computerScore = 0;
  let playerSelection;
  let computerSelection;
  let result;
  const playerScoreDiv = document.getElementById("playerScore"); 
  const computerScoreDiv = document.getElementById("computerScore"); 
  const myButtons = document.querySelectorAll(".myButton");

  function disableMyButtons(){
    const myButtons = document.querySelectorAll(".myButton");
    myButtons.forEach((button) => { 
      button.removeAttribute("data-key");
      button.classList.add("myButtonAlt"); // No hover
      button.classList.remove("myButton");
      button.removeEventListener("click", clickListener);
    });
  }

  function reEnableMyButtons(){
    const myButtons = document.querySelectorAll(".myButtonAlt");
    myButtons.forEach((button) => { 
      button.classList.add("myButton");
      button.classList.remove("myButtonAlt");
      button.addEventListener("click", clickListener);
    });
    myButtons[0].setAttribute("data-key", "r");
    myButtons[1].setAttribute("data-key", "p");
    myButtons[2].setAttribute("data-key", "s");  
    unHighlightAllButtons(); 
  }

  function playRound(){
    unHighlightAllButtons();
    disableMyButtons(); 
    highlight(btnSelected);
    playerSelection = btnSelected.getAttribute("id");
    computerSelection = computerChoice();
    result = roundResult(playerSelection, computerSelection);
    if (result.includes('You WIN')) { 
      playerScore++;
    } else if (result.includes('You LOSE')) { 
      computerScore++; 
    };  
    animateComputer(computerSelection, playerScore, computerScore, playerScoreDiv, computerScoreDiv);
    announceResult(result);
    setTimeout(()=>{
      reEnableMyButtons();
    }, 3300);
    if(playerScore === 5 || computerScore === 5){
      // disableMyButtons();
      finalResultScreen(playerScore, computerScore);
    }
  }
    
  let clickListener = function(e){
    if(e.target.getAttribute("class") == "myButton") return; // Make border unclickable
    btnSelected = e.target.parentElement; // Get player to click the img but we want the parent div
    playRound();
  }

  let keydownListener = function(e){
    btnSelected = document.querySelector(`div[data-key="${e.key}"]`);
    if (!btnSelected) return;
    playRound();
  }
  
  myButtons.forEach((button) => { 	
    button.addEventListener("click", clickListener)
  });

  window.addEventListener("keydown", keydownListener);

}

play();
