//initiate Game STATES
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex;
var liveT;
var deadT;
var ground; 
var invisibleGround;
var ObstaclesGroup;
var CloudsGroup;
var gameOver;
var restart;
var count = 0;
var abc;
var obstacle;
var rand;
var cloud;

function preload(){
liveT = loadImage("images/trex1.png")
deadT = loadImage("images/deadT.png")
ground = loadImage("images/ground2.png")
gameOver = loadImage("images/gameOver.png")
restart = loadImage("images/restart.png")
cloud = loadImage("images/cloud.png")
obstacle = loadImage("images/obstacle1.png")
obstacle = loadImage("images/obstacle2.png")
obstacle = loadImage("images/obstacle3.png")
obstacle = loadImage("images/obstacle4.png")
obstacle = loadImage("images/obstacle5.png")
obstacle = loadImage("images/obstacle6.png")

}

function setup(){
//create a trex sprite
trex = createSprite(200,380,20,50);
trex.addImage(liveT);

//set collision radius for the trex
trex.setCollider("circle",0,0,30);

//scale and position the trex
trex.scale = 0.5;
trex.x = 50;

//create a ground sprite
ground = createSprite(200,380,400,20);
ground.x = ground.width /2;

//invisible Ground to support Trex
invisibleGround = createSprite(200,385,400,5);
invisibleGround.visible = false;

//create Obstacle and Cloud Groups
ObstaclesGroup = createGroup();
CloudsGroup = createGroup();

//place gameOver and restart icon on the screen
gameOver = createSprite(200,300);
restart = createSprite(200,340);
gameOver.scale = 0.5;
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

//set text
textSize(18);
textFont("Georgia");
textStyle(BOLD);
}


function draw() {
  //set background to white
  background("white");
  //display score
  text("Score: "+ count, 250, 100);
  //console.log(gameState);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    abc = Math.round(World.frameRate/30)
    console.log(abc)
    count = count + abc
    //console.log(World.frameRate/60)
    //console.log(count)
    if (count>0 && count%100 === 0){
      playSound("checkPoint.mp3");
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 359){
      trex.velocityY = -12 ;
      playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      playSound("jump.mp3");
      gameState = END;
      playSound("die.mp3");
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.addImage(deadT);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
 gameState = PLAY;
 gameOver.visible = false;
    restart.visible = false;
    ObstaclesGroup.destroyEach();
    CloudsGroup.destroyEach();
    trex.addImage(liveT);
  count = 0;
}

function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    obstacle = createSprite(400,365,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    rand = randomNumber(1,6);
    obstacle.addImage("obstacle" + rand);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 70;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    cloud = createSprite(400,320,40,10);
    cloud.y = randomNumber(280,320);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}
