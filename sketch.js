/*
Mimi Yin NYU-ITP
Drawing skeleton joints and bones.
 */

// Declare kinectron
let kinectron = null;

let long = false;
let elbowStart;
let elbowEnd;
let handR, handL;
let footR, footL;

let currentSpinX, currentSpinY;
let spinPos;
let pspinPos = {x : 0, y : 0};

let ropes = [];

let osc;
let oscFreq = 100;

let alpha = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Define and create an instance of kinectron
  kinectron = new Kinectron("192.168.1.20");

  // Connect with application over peer
  kinectron.makeConnection();

  // Request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(bodyTracked);

  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(oscFreq);
  osc.amp(0);

  // for(let i = 0; i < 6; i++){
  //   for(let j = 0; j < 4; j++){
  //     ropes.push(new Rope(j));
  //   }
  // }

  for(let i = 0; i < 10; i++){
      ropes.push(new Rope(1));
  }

  for(let i = 0; i < 10; i++){
    ropes.push(new Rope(3));
  }

  currentSpinX = width / 2;
  currentSpinY = height / 2;

  background(0);
}

let bgColor = 0;
let whiteFrames = 0;
let whitebg = false;

let changedMillis = 0;

let speed;
function draw() {
  //Nothing to see here
  background(bgColor, 30);

  if(whitebg){
    bgColor = 255;
    whiteFrames++;

    if(whiteFrames > 10){
      whiteFrames = 0;
      whitebg = false;
      bgColor = 0;
    }
  }

  if(oscFreq == 50 && millis() - changedMillis > 1500){
    whitebg = true;
    changedMillis = millis();
  }

  // Draw a line
  if(spinPos != null){

    let elbowDist = dist(elbowStart.x, elbowStart.y, elbowEnd.x, elbowEnd.y);
    elbowDist = constrain(elbowDist, 100, width / 4);
    alpha = int(map(elbowDist, 100, width / 4, 0, 150));

    let longDist = dist(handR.x, handR.y, footL.x, footL.y);
    longDist = constrain(longDist, 0, height / 2);
    oscFreq = int(map(longDist, 0, height / 2, 100, 50));
    osc.freq(oscFreq);
    //console.log(oscFreq);
    if(alpha > 25){
      osc.amp(0.8, 0.05);
    }else{
      osc.amp(0, 0.1);
    }

    for(let i = 0; i < ropes.length; i++){
      let r = ropes[i];
      //
      // if(r.id == 0){
      //   r.update(handL.x, handL.y);
      // }

      if(r.id == 1){
        r.update(footL.x + random(-10, 10), footL.y + random(-10, 10));
      }
      //
      // if(r.id == 2){
      //   r.update(footR.x, footR.y);
      // }

      if(r.id == 3){
        r.update(handR.x + random(-10, 10), handR.y + random(-10, 10));
      }

      r.display();
    }

    //speed of percussion
    speed = dist(spinPos.x, spinPos.y, pspinPos.x, pspinPos.y);

    noFill();
    strokeWeight(3);
    stroke(255, alpha);
    //noStroke();
    currentSpinX = lerp(currentSpinX, spinPos.x, 0.01);
    currentSpinY = lerp(currentSpinY, spinPos.y, 0.01);

    //ellipse(currentSpinX, currentSpinY, speed*5, speed*5);

    if(speed > 1){
      for(let j = 3; j < 5; j++){
        push();
        translate(currentSpinX + random(-10, 10), currentSpinY + random(-10, 10));
        rotate(frameCount * (speed * 0.001 * j + 0.001));
        beginShape();
        for(let i = 0; i < 7; i++){
          let angle = 360 / 7 * i;
          let x = cos(radians(angle)) * (50 + j * 10 + speed * 15);
          let y = sin(radians(angle)) * (50 + j * 10 + speed * 15);
          vertex(x, y);
        }
        endShape(CLOSE);
        pop();
      }
    }


    pspinPos = spinPos;
  }
}

function mousePressed(){
 playSound();
}

async function playSound(){
  try{
    console.log("start sound");
    osc.start();
  }catch(err){
    console.log(err);
  }
}


function bodyTracked(body) {

//  console.log('received');

  // Draw all the joints
//  kinectron.getJoints(drawJoint);

  // Get all the joints off the tracked body and do something with them

  // Mid-line
  let head = scaleJoint(body.joints[kinectron.HEAD]);
  let neck = scaleJoint(body.joints[kinectron.NECK]);
  let spineShoulder = scaleJoint(body.joints[kinectron.SPINESHOULDER]);
  let spineMid = scaleJoint(body.joints[kinectron.SPINEMID]);
  let spineBase = scaleJoint(body.joints[kinectron.SPINEBASE]);

  // Right Arm
  let shoulderRight = scaleJoint(body.joints[kinectron.SHOULDERRIGHT]);
  let elbowRight = scaleJoint(body.joints[kinectron.ELBOWRIGHT]);
  let wristRight = scaleJoint(body.joints[kinectron.WRISTRIGHT]);
  let handRight = scaleJoint(body.joints[kinectron.HANDRIGHT]);
  let handTipRight = scaleJoint(body.joints[kinectron.HANDTIPRIGHT]);
  let thumbRight = scaleJoint(body.joints[kinectron.THUMBRIGHT]);

  // Left Arm
  let shoulderLeft = scaleJoint(body.joints[kinectron.SHOULDERLEFT]);
  let elbowLeft = scaleJoint(body.joints[kinectron.ELBOWLEFT]);
  let wristLeft = scaleJoint(body.joints[kinectron.WRISTLEFT]);
  let handLeft = scaleJoint(body.joints[kinectron.HANDLEFT]);
  let handTipLeft = scaleJoint(body.joints[kinectron.HANDTIPLEFT]);
  let thumbLeft = scaleJoint(body.joints[kinectron.THUMBLEFT]);

  // Right Leg
  let hipRight = scaleJoint(body.joints[kinectron.HIPRIGHT]);
  let kneeRight = scaleJoint(body.joints[kinectron.KNEERIGHT]);
  let ankleRight = scaleJoint(body.joints[kinectron.ANKLERIGHT]);
  let footRight = scaleJoint(body.joints[kinectron.FOOTRIGHT]);

  // Left Leg
  let hipLeft = scaleJoint(body.joints[kinectron.HIPLEFT]);
  let kneeLeft = scaleJoint(body.joints[kinectron.KNEELEFT]);
  let ankleLeft = scaleJoint(body.joints[kinectron.ANKLELEFT]);
  let footLeft = scaleJoint(body.joints[kinectron.FOOTLEFT]);

  elbowStart = elbowLeft;
  elbowEnd = elbowRight;
  handL = handLeft;
  handR = handRight;
  footL = footLeft;
  footR = footRight;

  spinPos = spineMid;
}

// Scale the joint position data to fit the screen
// 1. Move it to the center of the screen
// 2. Flip the y-value upside down
// 3. Return it as an object literal
function scaleJoint(joint) {
  return {
    x: (joint.cameraX * width / 2) + width / 2,
    y: (-joint.cameraY * height / 2) + height / 2,
  }
}

// Draw skeleton
function drawJoint(joint) {

  //console.log("JOINT OBJECT", joint);
  let pos = scaleJoint(joint);

  //Kinect location data needs to be normalized to canvas size
  stroke(255);
  strokeWeight(5);
  point(pos.x, pos.y);
}

class Rope{

  constructor(i){
    this.id = i;
    this.x = 0;
    this.y = 0;
    //hand left
    if(i == 0){
      if(random() > 0.5){
        this.x = 0;
        this.y = random(0, height / 4);
      }else{
        this.x = random(0, width / 4);
        this.y = 0;
      }
    } else if(i == 1){
      if(random() > 0.5){
        this.x = 0;
        this.y = random(height * 3 / 4, height);
      }else{
        this.x = random(0, width / 4);
        this.y = height;
      }
    }else if(i == 2){
      if(random() > 0.5){
        this.x = random(width * 3 / 4, width);
        this.y = height;
      }else{
        this.x = width;
        this.y = random(height * 3 / 4, height);
      }
    }else if(i == 3){
      if(random() > 0.5){
        this.x = width;
        this.y = random(0, height / 4);
      }else{
        this.x = random(width * 3 / 4, width);
        this.y = 0;
      }
    }

    this.targetX = 0;
    this.targetY = 0;
  }

  update(x, y){
    this.targetX = x;
    this.targetY = y;
  }

  display(){
    strokeWeight(1);
    stroke(255, alpha);
    line(this.x, this.y, this.targetX, this.targetY);
  }

}
