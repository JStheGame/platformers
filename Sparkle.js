function randBit() {
	return floor(random() * 150 + 100);
}


class Sparkle {
	constructor(x, y, birthFrame) {
		this.x = x;
		this.y = y;
		this.birthFrame = birthFrame;
	}

	update() {
		if(frameCount - this.birthFrame > 30) {
			sparkles.delete(this);
		}
	}

	draw() {
		const lifeTime = frameCount - this.birthFrame;

		push();
		fill(randBit(), randBit(), randBit());
		noStroke();
		rect(this.x, this.y, 15 - lifeTime / 2, 15 - lifeTime / 2);
		pop();
	}
}