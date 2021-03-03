var mouseX = 0;
var mouseY = 0;
const SNAKE_LEN = 30;
const SNAKE_DIST = 15;
const SNAKE_SPEED = 10;
var snake = []
function setup() {
	document.onmousemove = handleMouse;
	setInterval(tick, 0);
	setupSnake(SNAKE_LEN);
}

function setupSnake(len){
	let htmlToAdd = "";
	for (var i = 0; i < len; i++) {
		htmlToAdd += `<div class="snake" id="snake-${i}"></div>`;
		snake.push({x: 0, y: 0});
	}
	document.getElementById("snake").innerHTML = htmlToAdd;
	
}

function tick() {
	for (var i = 0; i < SNAKE_LEN; i++) {
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