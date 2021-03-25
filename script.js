// global constants
//const clueHoldTime = 1000; redone as variables
const cluePauseTime = 333;
//const nextClueWaitTime = 1000; redone as variables

// global variables
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var countdown = false;
var volume = 0.5;
var guessCounter = 0;
var clueHoldTime = 1000;
var strikeCounter = 0;
var nextClueWaitTime = 1000;
var timeleft = 10;
var colorBlindMode = false;


function startGame() {
  randomPattern();
  progress = 0;
  gamePlaying = true;
  timeleft = 10;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
  countdownFunction();
}

function countdownFunction() {
var downloadTimer = setInterval(function(){
  if(timeleft <= 0){
    clearInterval(downloadTimer);
    document.getElementById("timer").innerHTML = stopGame();
    document.getElementById("timer").innerHTML = "Times up! Restart by pressing Start";
  } else {
    document.getElementById("timer").innerHTML = timeleft + " seconds remaining";
  }
  timeleft -= 1;
}, 1000);
  document.getElementById("timer").innerHTML = timeleft;
}

function setColorBlindMode() {
  colorBlindMode = !colorBlindMode;
  if(colorBlindMode === true) {
      document.getElementById("colorBlind").classList.add("boldText");
  }else{
      document.getElementById("colorBlind").classList.remove("boldText");
    }
  }


function stopGame() {
  gamePlaying = false;
  timeleft = 0;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  
}

function randomPattern() { // generating a random secret pattern
         pattern = [];
         for (var i = 0; i <= 5; i++)
         {
            pattern.push(Math.floor(Math.random() * 5) + 1)
        }
        console.log(pattern);
}


function playSingleClue(btn) {
  if(gamePlaying) {
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
    
  }
    clueHoldTime = clueHoldTime >= 50 ?  clueHoldTime-50 : 1000; // speed up clue time
    console.log(clueHoldTime);
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
  clueHoldTime = 1000;
  timeleft = 0;
  strikeCounter = 0;
}

function winGame() {
  stopGame();
  alert("Game Over. You won!");
}
  
  function guess(btn){
  console.log("user guessed: " + btn);

  if(!gamePlaying){
    countdown = false;
    return;
  }
  

  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }else{
        progress++;
        timeleft = 10;
        playClueSequence();
      }
    }else{
      guessCounter++;
    }
  }else{
    strikeCounter++;
    console.log(strikeCounter);
    if (strikeCounter <= 2) {
      playClueSequence();
    }else{
      loseGame();
    }
  }
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
  if (colorBlindMode === true) {
    var myBtn = document.getElementById("button"+btn);
    myBtn.innerHTML = "click";
    myBtn.classList.add("boldText");
  }
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
  document.getElementById("button"+btn).innerHTML = "";
}


// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 490.5,
  6: 550.3
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
