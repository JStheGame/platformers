// constants
const screenWidth = 800;
const screenHeight = 800;

// sprite variables
const player = new Friend();
const platforms = new Set();
const powerups = new Set();
const sparkles = new Set();

// gameplay variables
const keys = {};
let height = 0;
let maxHeight = 0;

window.addEventListener("keydown", ({which}) => {
	keys[which] = 1;

	if(which === 32) {
		// jump
		player.jump();
	}

	if(which === 90) {
		// dash
		let [dx, dy] = [0, 0];
		if(keys[37]) dx -= 1;
		if(keys[39]) dx += 1;
		if(keys[38]) dy -= 1;
		if(keys[40]) dy += 1;

		player.dash(dx, dy);
	}
})

window.addEventListener("keyup", ({which}) => {
	keys[which] = 0;
})

// runs once, when the page is ready
function setup() {
	createCanvas(screenWidth, screenHeight);
	noSmooth();
	rectMode(CENTER);

	// create a field of platforms
	let nextY = 1;
	let dy = 0;

	for(let i = 0; i < 250; i++) {
		if(i % 10 === 0) dy++;
		const x = floor(random() * 7);
		const y = nextY + floor(random() * (i / 10) - (i / 20));

		platforms.add(new Platform(x, y));
		if(random() > 0.8) powerups.add(new Powerup(x, y + 1))
		nextY += dy;
	}

	for(let x = 1; x < 7; x++) {
		platforms.add(new Platform(x, 0));
	}
}

// this function gets called every frame, 
// and it updates the position of all the sprites
function update() {
	// update all the sprites
	player.update();

	for(const powerup of powerups) {
		powerup.update();
	}

	// handle movement
	if(keys[37]) {
		// move left
		player.move(-1);
	}
	if(keys[39]) {
		// move right
		player.move(1);
	}

	for(const sparkle of sparkles) {
		sparkle.update();
	}

	translate(0, 400 - player.y);

	height = floor(-150 - player.y);
	maxHeight = max(height, maxHeight);
}

// this function fires every frame
function draw() {
	update();

	// paint the background
	const fader = player.y / 50;
	background(89 + fader, 144 + fader, 233 + fader);

	// draw all the sprites
	for(const platform of platforms) {
		platform.draw();
	}

	for(const powerup of powerups) {
		powerup.draw();
	}

	for(const sparkle of sparkles) {
		sparkle.draw();
	}

	// display the height
	push();
	fill(255);
	textSize(32);
	textFont("VT323");

	// hi score
	text(maxHeight, 20, player.y - 360);
	fill(205);

	// current score
	text(height, 20, player.y - 330);

	// dash meter
	const amountFilled = floor(player.juice / player.maxJuice * 100);

	noFill();
	stroke(255);
	strokeWeight(4);
	rect(75, player.y - 300, 110, 30);

	fill(255, 255, 255, 200);
	noStroke();
	rect(25 + amountFilled / 2, player.y - 300, amountFilled, 20);

	//text(player.juice, 20, player.y - 300);
	pop();

	player.draw();
}




