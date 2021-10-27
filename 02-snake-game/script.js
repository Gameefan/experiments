var mouseX = 0;
var mouseY = 0;
var snake_len = 0;
const SNAKE_LEN = 5;
const SNAKE_DIST = 15;
const SNAKE_SPEED = 2;
var snake = [];
var w = window.innerWidth;
var h = window.innerHeight;
var orb = {x: Math.random()*w|0, y: Math.random()*h|0};
var gametime = 0;
var snakeAlive = true;
let uri = "https://www.colr.org/json/colors/random/20";
const colors = JSON.parse(httpGet(uri)).colors;
function setup() {
	document.onmousemove = handleMouse;
	setInterval(tick, 0);
	//setInterval(addOneToSnake, 2000);
	setupSnake(SNAKE_LEN);
	document.getElementById("death-msg").style.display="none";
}

function distance(a,b){
	return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2));
}

function setupSnake(len){
	let htmlToAdd = "";
	for (var i = 0; i < len; i++) {
		htmlToAdd += `<div class="snake" id="snake-${i}"></div>`;
		snake.push({x: 0, y: 0});
		snake_len ++;
	}
	document.getElementById("snake").innerHTML = htmlToAdd;
	
}

function addOneToSnake(){
	let htmlToAdd = "";
	snake_len ++;
	for (var i = 0; i < snake_len; i++) {
		htmlToAdd += `<div class="snake" id="snake-${i}"></div>`;
	}
	document.getElementById("snake").innerHTML = htmlToAdd;
	snake.push({x: snake[snake.length-1].x, y: snake[snake.length-1].y});
}

function tick() {
	if(snakeAlive==false){
		return;
	}
	w = window.innerWidth;
	h = window.innerHeight;
	doOrbLogic();
	renderOrb();
	if(gametime<200){
		gametime++;
	}else{
		for (var i = 1; i < snake_len; i++) {
			let dist = distance(snake[0], snake[i]);
			//console.log(dist);
			if(dist<10){
				snakeDied();
			}
		}
	}
	for (var i = 0; i < snake_len; i++) {
		renderSnakeAt(i);
	}
}

function renderSnakeAt(index) {
	updateOneSnake(index);
	document.getElementById(`snake-${index}`).style.left = `${snake[index].x - 10}px`;
	document.getElementById(`snake-${index}`).style.top = `${snake[index].y - 10}px`;
}

function updateOneSnake(index){
	if(index == 0){
		let res = getNewPos(snake[index], {x: mouseX, y: mouseY}, SNAKE_DIST);
		snake[index].x = res.x;
		snake[index].y = res.y;
	}else{
		let res = getNewPos(snake[index], snake[index-1], SNAKE_DIST);
		snake[index].x = res.x;
		snake[index].y = res.y;
	}
}

function getNewPos(current, anchor, distance){
	let dist = Math.sqrt(Math.pow(current.x - anchor.x, 2) + Math.pow(current.y - anchor.y, 2));
	let toVector_x = anchor.x - current.x;
	let toVector_y = anchor.y - current.y;
	if(dist <= distance){
		return current;
	}
	let maxDistanceDelta = SNAKE_SPEED;
	return {x: current.x + toVector_x / dist * maxDistanceDelta, y: current.y + toVector_y / dist * maxDistanceDelta};
}

function handleMouse(event){
	event = event || window.event;
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function doOrbLogic() {
	for (var i = 0; i < snake_len; i++) {
		let dist = distance(orb, snake[i]);
		//console.log(dist);
		if(dist<20){
			orbWasTouched();
		}
	}
}

function renderOrb(){
	document.getElementById(`orb`).style.left = `${orb.x - 10}px`;
	document.getElementById(`orb`).style.top = `${orb.y - 10}px`;
}

function orbWasTouched(){
	orb.x = Math.random()*w|0;
	orb.y = Math.random()*h|0;
	document.getElementById(`orb`).style.backgroundColor = '#'+colors[Math.random()*colors.length|0].hex;
	addOneToSnake();
}

function snakeDied() {
	snakeAlive = false;
	orb.x = 999999999;
	orb.y = 999999999;
	renderOrb();
	document.getElementById(`snake`).innerHTML = "";
	document.getElementById("death-msg").style.display="";
	document.getElementById("score").innerText=snake_len-5;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}