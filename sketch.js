const PLAY_BUTTON_WIDTH = 150;
const PLAY_BUTTON_HEIGHT = 50;
const RETURN_BUTTON_WIDTH = 100;
const RETURN_BUTTON_HEIGHT = 50;
const RETURN_BUTTON_X = 75;
const RETURN_BUTTON_Y = 50;
let buttonState = 0;
let explosion
let stars = [];
let originalStarSpeeds = [];
let rocketImage;
let asteroidImage;
let asteroids = [];
let originalAsteroidSpeeds = [];
let score = 0;
let asteroidsNum = 10

let Rmoney;
let bestScore;
let rocketSpeed;
let slowAsteroids;
let smallAsteroids;
let lastScore;


function preload() {
  explosion = loadImage("explosion.png")
  rocketImage = loadImage('rocket.png');
  asteroidImage = loadImage('asteroid.png');
}

function setup() {
  
  Rmoney = getItem("Rmoney") || 0;
  bestScore = getItem("bestScore") || 0;
  rocketSpeed = getItem("rocketSpeed") || 1
  lastScore = getItem("lastScore") || 0
  slowAsteroids = getItem("slowAsteroids") || 1
  smallAsteroids = getItem("smallAsteroids") || 1
  
  setInterval(incrementCounter, 1000);
  
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  
  // Initialize stars
  for(let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(1, 3)
    });
    originalStarSpeeds.push(stars[i].speed);
  }
  
  for(let i = 0; i < asteroidsNum; i++) { //asteroids
    asteroids.push({
      x: random(width),
      y: random(height),
      size: random(20, 50),
      speed: random(1, 3),
      direction: random(-PI/4, PI/4)
    });
  }
  
  character = new Character();
    
}

function draw() {
  // Draw space background
  background(0);
  fill(255);
  noStroke();

  if(buttonState === 1 ) {
    text(`Score: ${score}`, width/1.1, 20);
  }
  
  for(let i = 0; i < stars.length; i++) {
    ellipse(stars[i].x, stars[i].y, stars[i].size);
    stars[i].y += stars[i].speed;
    if(stars[i].y > height) {
      stars[i].y = 0;
      stars[i].x = random(width);
    }
  }

  character.show();
  character.move();
  
  for(let i = 0; i < asteroids.length; i++) {
    push();
    translate(asteroids[i].x, asteroids[i].y);
    rotate(asteroids[i].direction);
    image(asteroidImage, 0, 0, asteroids[i].size, asteroids[i].size); // Draw the asteroid image
    pop();
    asteroids[i].y += asteroids[i].speed;
    if(asteroids[i].y > height) {
      asteroids[i].y = 0;
      asteroids[i].x = random(width);
    }
    let speedIncrement = Math.floor(score / 10);
    for (let i = 0; i < asteroids.length; i++) {
      asteroids[i].y += (speedIncrement/10)/slowAsteroids;
    }
    
    const sizeIncrement = Math.floor(score / 50);
    for (let i = 0; i < asteroids.length; i++) {
      asteroids[i].size += (sizeIncrement/300)/smallAsteroids;
    }
  }
  
  for(let i = 0; i < asteroids.length; i++) {
    let d = dist(character.x, character.y, asteroids[i].x, asteroids[i].y);
    if(d < (character.width + asteroids[i].size)/2) {
      if(buttonState === 1){
        noLoop(); 
        buttonState = 3
        image(explosion, asteroids[i].x, asteroids[i].y, 100, 85)
        if(score > bestScore){
          bestScore = score;
          storeItem("bestScore", bestScore); 
        }
      }
    }
  }
  
  if(buttonState === 3){
      textSize(50)
    fill(85, 50, 255)
     Rmoney += Math.floor(score / 10);
    lastScore = score
    storeItem("lastScore", lastScore)
    storeItem("Rmoney", Rmoney)
    if(score === bestScore){
      text(`You lose\nYour score is : ${score}\nYou won ${Math.floor(score / 10)}$\nYour best score is : ${bestScore}`, width/2, height/2)
    } else{
      text(`You lose\nYour score is : ${score}\nYou won ${Math.floor(score / 10)}$`, width/2, height/2)
    }
  }
  
  if(buttonState === 1){
    noCursor()
  } else {
    cursor(ARROW);
  }
  
  

  if(buttonState === 0){
    fill(255)
    rect(width/7, height/9, PLAY_BUTTON_WIDTH, PLAY_BUTTON_HEIGHT)//upgrade rocket speed
    
    rect(width/7, height/4.5, PLAY_BUTTON_WIDTH, PLAY_BUTTON_HEIGHT)//decrease asteroids speed
    
    rect(width/7, height/3, PLAY_BUTTON_WIDTH, PLAY_BUTTON_HEIGHT) //decrease asteroids size
    
    rect(width/15, height/1.1, PLAY_BUTTON_WIDTH/2, PLAY_BUTTON_HEIGHT/2)//restart the game
    
    text(`Best score : ${bestScore}`, width/2, height/9) //best score
    
    text(`Last score : ${lastScore}`, width/2, height/5)//last score
    
    text(`Money : ${Rmoney}`, width/1.2, width/9) //money
    
    textSize(15);
      fill(0);
    text(`Rocket speed x ${rocketSpeed}\n(${10 * rocketSpeed})`, width/7, height/9);
    if(mouseX < width/7 + PLAY_BUTTON_WIDTH/2 && mouseX > width/7 - PLAY_BUTTON_WIDTH/2 &&
         mouseY < height/9 + PLAY_BUTTON_HEIGHT/2 && mouseY > height/9 - PLAY_BUTTON_HEIGHT/2) {
        cursor(HAND);
      }
    
    text(`Asteroids speed x ${slowAsteroids}\n(${slowAsteroids * 15})`, width/7, height/4.5)
    if(mouseX < width/7 + PLAY_BUTTON_WIDTH/2 && mouseX > width/7 - PLAY_BUTTON_WIDTH/2 &&
         mouseY < height/4.5 + PLAY_BUTTON_HEIGHT/2 && mouseY > height/4.5 - PLAY_BUTTON_HEIGHT/2) {
        cursor(HAND);
      }
    text(`Small asteroids x ${smallAsteroids}\n(${smallAsteroids * 20})`, width/7, height/3)
    if(mouseX < width/7 + PLAY_BUTTON_WIDTH/2 && mouseX > width/7 - PLAY_BUTTON_WIDTH/2 &&
         mouseY < height/3 + PLAY_BUTTON_HEIGHT/2 && mouseY > height/3 - PLAY_BUTTON_HEIGHT/2) {
        cursor(HAND);
      }
    
    textSize(10)
    text(`restart the game`, width/15, height/1.1);
    if(mouseX < width/15 + PLAY_BUTTON_WIDTH/4 && mouseX > width/15 - PLAY_BUTTON_WIDTH/4 &&
         mouseY < height/1.1 + PLAY_BUTTON_HEIGHT/4 && mouseY > height/1.1 - PLAY_BUTTON_HEIGHT/4) {
        cursor(HAND);
      }
  }
  // Draw buttons
  switch(buttonState) {
    case 0: // play
      fill(255)
      rect(width/2, height/2 + 100, PLAY_BUTTON_WIDTH, PLAY_BUTTON_HEIGHT);
      textSize(30);
      fill(0);
      text("Play", width/2, height/2 + 100);
      if(mouseX < width/2 + PLAY_BUTTON_WIDTH/2 && mouseX > width/2 - PLAY_BUTTON_WIDTH/2 &&
         mouseY < height/2 + PLAY_BUTTON_HEIGHT/2 + 100 && mouseY > height/2 - PLAY_BUTTON_HEIGHT/2 + 100) {
        cursor(HAND);
      }
      break;
      
    case 1: // return
      rect(RETURN_BUTTON_X, RETURN_BUTTON_Y, RETURN_BUTTON_WIDTH, RETURN_BUTTON_HEIGHT);
      textSize(20);
      fill(0);
      text("Return", RETURN_BUTTON_X, RETURN_BUTTON_Y);
      if(mouseX < RETURN_BUTTON_X + RETURN_BUTTON_WIDTH/2 && mouseX > RETURN_BUTTON_X - RETURN_BUTTON_WIDTH/2 &&
         mouseY < RETURN_BUTTON_Y + RETURN_BUTTON_HEIGHT/2 && mouseY > RETURN_BUTTON_Y - RETURN_BUTTON_HEIGHT/2) {
        cursor(HAND);
      }
      break;
  }
}


function incrementCounter() {
  if(buttonState === 1){
    score++
  }
}

class Character {
  constructor() {
    this.x = width/2;
    this.y = height/2;
    this.velX = 0;
    this.velY = 0;
    this.width = 44;
    this.height = 100;
  }

  show() {
    imageMode(CENTER);
  image(rocketImage, this.x, this.y, this.width, this.height);
  }

  move() {
    this.y += this.velY;
    this.x += this.velX;

    if (this.y > height - this.height/2) {
      this.y = height - this.height/2;
      this.velY = 0;
    }
    
    if (this.y < 0 + this.height/2) {
      this.y = 0 + this.height/2;
      this.velY = 0;
    }
    
    if (this.x < 0 + this.width/5) {
      this.x = width - this.width/4;
      this.velX = 0;
    }
    
    if (this.x > width) {
      this.x = 0 + this.width/5;
      this.velX = 0;
    }
    
    

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A
      if(buttonState === 1){
        this.velX = -rocketSpeed
      }
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D
      if(buttonState === 1){
        this.velX = rocketSpeed
      }
    } else {
      this.velX = 0;
    }

    if ((keyIsDown(UP_ARROW) || keyIsDown(87))) {
      if(buttonState === 1){
        this.velY = -rocketSpeed
      }
    } else if(keyIsDown(DOWN_ARROW) || keyIsDown(83)){
      if(buttonState === 1){
        this.velY = rocketSpeed
      }
    } else {
      this.velY = 0
    }
  }
}



function mousePressed() {
  switch(buttonState) {
    case 0: // play button
      if(mouseX < width/2 + PLAY_BUTTON_WIDTH/2 && mouseX > width/2 - PLAY_BUTTON_WIDTH/2 &&
         mouseY < height/2 + 100 + PLAY_BUTTON_HEIGHT/2 && mouseY > height/2 + 100 - PLAY_BUTTON_HEIGHT/2) {
        buttonState = 1;
      }
      break;
      
    case 1: // return button
      if(mouseX < RETURN_BUTTON_X + RETURN_BUTTON_WIDTH/2 && mouseX > RETURN_BUTTON_X - RETURN_BUTTON_WIDTH/2 &&
         mouseY < RETURN_BUTTON_Y + RETURN_BUTTON_HEIGHT/2 && mouseY > RETURN_BUTTON_Y - RETURN_BUTTON_HEIGHT/2) {
        buttonState = 0;
        this.x = width/2;
        this.y = height/2
      }
      break;
  }
  
  if(mouseX < width/7 + PLAY_BUTTON_WIDTH/2 && mouseX > width/7 - PLAY_BUTTON_WIDTH/2 &&
         mouseY < height/9 + PLAY_BUTTON_HEIGHT/2 && mouseY > height/9 - PLAY_BUTTON_HEIGHT/2) {
        if(buttonState === 0){
          if(Rmoney >= 10 * rocketSpeed){
            Rmoney = Rmoney - (10 * rocketSpeed)
            rocketSpeed ++
            storeItem("Rmoney", Rmoney)
            storeItem("rocketSpeed", rocketSpeed)
          }
        }
      }
  
  if(mouseX < width/7 + PLAY_BUTTON_WIDTH/2 && mouseX > width/7 - PLAY_BUTTON_WIDTH/2 &&
         mouseY < height/4.5 + PLAY_BUTTON_HEIGHT/2 && mouseY > height/4.5 - PLAY_BUTTON_HEIGHT/2) {
    if(buttonState === 0){
      if(Rmoney >= slowAsteroids * 15){
        Rmoney = Rmoney - (slowAsteroids * 15)
        slowAsteroids ++
        storeItem("Rmoney", Rmoney)
        storeItem("slowAsteroids", slowAsteroids)
      }
    }
  }
  
  if(mouseX < width/7 + PLAY_BUTTON_WIDTH/2 && mouseX > width/7 - PLAY_BUTTON_WIDTH/2 &&
         mouseY < height/3 + PLAY_BUTTON_HEIGHT/2 && mouseY > height/3 - PLAY_BUTTON_HEIGHT/2) {
    if(buttonState === 0){
      if(Rmoney >= smallAsteroids * 20){
        Rmoney = Rmoney - (smallAsteroids * 20)
        smallAsteroids ++
        storeItem("Rmoney", Rmoney)
        storeItem("smallAsteroids", smallAsteroids)
      }
    }
  }
  
  if(mouseX < width/15 + PLAY_BUTTON_WIDTH/4 && mouseX > width/15 - PLAY_BUTTON_WIDTH/4 &&
         mouseY < height/1.1 + PLAY_BUTTON_HEIGHT/4 && mouseY > height/1.1 - PLAY_BUTTON_HEIGHT/4){
    let result = confirm("Are you sure you want to do this?\nBy pressing ok, you will lose all your progress");
    if (result) {
      clearStorage()
      location.reload()
    }
  }
}
