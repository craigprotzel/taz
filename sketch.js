var phrases = [
	"That's just wrong on so many levels.",
	"Are you sure?",
	"Hell yeah!",
	"I don't understand?",
	"What the ?8^#2!?",
	"Ya man!",
	"Na man!",
	"Please explain yourself sir.",
	"I agree with you 100 percent!",
	"Na, I disagree."
];

var msgBoxes = [];
var rows;
var cols;
var paddingW;
var paddingH;

var theVoice;
	
function setup() {
	checkMobile();
	createCanvas(windowWidth,windowHeight);
	initBoxes(2,3);
	initVoice();
}

function initBoxes(numRows, numCols){
	msgBoxes = [];
	rows = numRows;
	cols = numCols;
	paddingW = width/48;
	paddingH = height/32;

	for (var j=0; j<rows; j++){
		for (var i=0; i<cols; i++){
			var curPhrase = (j * cols) + i;
			var curPosX = (width/cols * i)+paddingW;
			var curPosY = (height/rows * j)+paddingH;
			console.log(curPhrase);
			msgBoxes.push(new MsgBox(phrases[curPhrase], curPosX, curPosY));
		}
	}
}

function initVoice(){
	//init Voice
	//15 - Computer
	//23 - Robot
	//25 - US
	//27 - UK
	theVoice = new p5.Speech(0); // new P5.Speech object
	theVoice.onEnd = speechEnded;
	theVoice.speaking = false;
}

function draw() {
	background(20,40,150);

	for (var i = 0; i < msgBoxes.length; i++){
		msgBoxes[i].draw();
		msgBoxes[i].checkMouse();
	}
}

//Class for creating a msg
function MsgBox(phrase, posX, posY){
	this.phrase = phrase;

	this.hovered = false;

	this.posX = posX;
	this.posY = posY;

	this.boxWidth = width/cols - (paddingW*2);
	this.boxHeight = height/rows - (paddingH*2);

	this.c = color(50,150,150);
	this.cHover = color(50,200,100);
	var curColor = this.c;

	this.say = function(){
		console.log(this.phrase);
	};

	this.checkMouse = function(){
		if (mouseX > this.posX && mouseX < this.posX + this.boxWidth && mouseY > this.posY && mouseY < this.posY +this.boxHeight){
			//console.log(this.phrase);
			curColor = this.cHover;
			this.hovered = true;
		}
		else{
			this.hovered = false;
			curColor = this.c;
		}
	};

	this.checkForTouch = function(tX,tY){
		if (tX > this.posX && tX < this.posX + this.boxWidth && tY > this.posY && tY < this.posY +this.boxHeight){
			theVoice.speak(this.phrase);
			theVoice.speaking = true;
		}
	};

	this.draw = function(){
		fill(curColor);
		noStroke();
		rect(this.posX, this.posY, this.boxWidth, this.boxHeight);
		fill(0);

		if (this.boxWidth < 300){
			textSize(18);
			//console.log("Small!");
		}
		else{
			textSize(32);
		}

		if (this.boxHeight < 200){
			textSize(16);
		}


		textAlign(CENTER);
		text(	this.phrase, this.posX + (this.boxWidth/16), this.posY + this.boxHeight/3,
					this.boxWidth * 7/8,this.boxHeight/3);
	};
}

function updateBoxPos(){

	paddingW = width/48;
	paddingH = height/32;

	for (var j=0; j<rows; j++){
		for (var i=0; i<cols; i++){
			var curPhrase = (j * cols) + i;
			var curPosX = (width/cols * i)+paddingW;
			var curPosY = (height/rows * j)+paddingH;
			msgBoxes[curPhrase].posX = curPosX;
			msgBoxes[curPhrase].posY = curPosY;
			msgBoxes[curPhrase].boxWidth = width/cols - (paddingW*2);
			msgBoxes[curPhrase].boxHeight = height/rows - (paddingH*2);
		}
	}
}


function speechEnded(){
	//Reset all boxes
	console.log("Speech Ended!");
	theVoice.speaking = false;
}


function touchEnded(){
	if(isMobile){
		if (!theVoice.speaking){
			msgBoxes.forEach(function(msgBox){
				msgBox.checkForTouch(touchX, touchY);
			});
		}
		else{
			console.log("Sorry...");
		}
	}
}


function mousePressed(){
	if (!isMobile){
		if (!theVoice.speaking){
			msgBoxes.forEach(function(msgBox){
				if (msgBox.hovered){
					theVoice.speaking = true;
					theVoice.speak(msgBox.phrase);
				}
			});
		}
		else{
			console.log("Sorry...");
		}
	}
}

function keyPressed(e){
	//console.log(e);
	if (keyCode === 49){
		initBoxes(2,3);
	}
	if (keyCode === 50){
		initBoxes(2,5);
	}
}

function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
	updateBoxPos();
}
