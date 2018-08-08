const effects = {
	"jump": () => player.jumpUp(),
	"juice": () => player.juiceUp(),
	"speed": () => player.speedUp(),
	"regen": () => player.regenUp()
}

const colours = {
	"jump": [200, 89, 144],
	"juice": [144, 200, 89],
	"speed": [200, 144, 144],
	"regen": [89, 144, 200]
}

function randomType() {
	const types = Object.keys(effects);
	return types[floor(random() ** 2 * types.length)];
}

class Powerup {
	constructor(x, y) {
		this.x = x * 100 + 50;
		this.y = -y * 100 - 50;
		this.width = 50;
		this.height = 50;
		this.type = randomType();
	}

	update() {
		// check for collision with player
		if(collideRectRect(player.x - player.width / 2, player.y - player.height / 2, 
			player.width, player.height, 
			this.x - this.width / 2, this.y - this.height / 2, 
			this.width, this.height)) {
			effects[this.type]();
			powerups.delete(this);
		}
	}

	draw() {
		const [r, g, b] = colours[this.type];

		push();
		noStroke();
		fill(r + 33 * sin(frameCount / 2), g, b);
		rect(this.x, this.y, this.width, this.height);
		pop();
	}
}
