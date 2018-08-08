class Platform {
	constructor(x, y) {
		this.width = 100;
		this.height = 100;
		this.x = 100 * x + 50;
		this.y = -100 * y - 50;
	}

	draw() {
		push();
		fill(144, 89, 55);
		noStroke();
		rect(this.x, this.y, this.width, this.height);
		pop();
	}
}