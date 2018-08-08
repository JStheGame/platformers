class Friend {
	constructor() {
		this.x = screenWidth / 2;
		this.y = -1000;
		this.dx = 0;
		this.dy = 0;
		this.width = 100;
		this.height = 100;
		this.grounded = false;
		this.jumpPower = 1;
		this.dashPower = 20;
		this.lastDash = -1e9;
		this.speed = 1;
		this.friction = 0.15;
		this.juice = 100;
		this.maxJuice = 100;
		this.regen = 1;
	}

	move(dx) {
		this.dx += dx * sqrt(this.speed);
	}

	jump() {
		if(this.grounded) {
			this.dy = -sqrt(200 * this.jumpPower);
			this.grounded = false;
		}
	}

	dash(dx, dy) {
		if(this.grounded || this.juice < 100) return;

		[this.dx, this.dy] = [this.dx + dx * this.dashPower, dy * this.dashPower];
		this.juice -= 100;
		this.lastDash = frameCount;
	}

	speedUp() {
		this.speed++;
	}

	jumpUp() {
		this.jumpPower++;
	}

	dashUp() {
		this.dashPower += 10;
	}

	juiceUp() {
		this.maxJuice += 50;
		this.juice += 50;
	}

	regenUp() {
		this.regen += 1;
	}

	getSlippery() {
		this.friction *= 0.5;
	}

	isSupported() {
		let supported = false;

		for(const platform of platforms) {
			if(Math.abs(platform.x - this.x) < 100 
			&& platform.y - this.y === 100) supported = true;
		}

		return supported;
	}

	respawn() {
		this.x = 400;
		this.y = -1000;
		this.dy = 0;
	}

	update() {
		if(this.grounded) {
			if(!this.isSupported()) this.grounded = false;
		} else {
			// fall down
			const nextY = this.y + this.dy;
			this.dy++;

			let landing = false;
			let landingHeight = -1;

			if(this.dy >= 0) {
				// the guy is falling
				for(const platform of platforms) {
					if(Math.abs(platform.x - this.x) < 100
					&& platform.y - this.y >= 100
					&& platform.y - nextY <= 100) {
						landing = true;
						landingHeight = platform.y - 100;
					}
				}
			}

			if(landing) {
				this.grounded = true;
				this.y = landingHeight;
				this.dy = 0;
			} else {
				this.y = nextY;

				if(this.y > 10000) {
					this.respawn();
				}
			}
		}

		const nextX = (this.x + this.dx + 800) % 800;
		this.x = nextX;

		this.dx *= (1 - this.friction);
		this.juice = min(this.maxJuice, this.juice + sqrt(this.regen));
	}

	draw() {
		push();
		noStroke();

		// did the player dash less than half a second ago?
		if(frameCount - this.lastDash < 30) {
			// lay down a sparkle
			sparkles.add(new Sparkle(player.x + floor(random() * 100) - 50, 
									 player.y + floor(random() * 100) - 50, 
									 frameCount));
		}

		for(const offset of [-screenWidth, 0, screenWidth]) {
			const shake = _ => this.dy > 50 ? floor(random() * this.dy ** 2 / 10000 * (random() > 0.5 ? 1 : -1)) : 0;

			fill(255);
			rect(this.x + offset, this.y, this.width, this.height);

			fill(0);
			// eyes
			rect(this.x - 30 + offset + shake(), this.y + shake() + 10, 5, 5);
			rect(this.x + 30 + offset + shake(), this.y + shake() + 10, 5, 5);
			// mouth
			this.grounded ? rect(this.x + offset, this.y + 20, 20, 5)
			: arc(this.x + offset + shake(), this.y + 20 + shake(), 20, 20, 0, this.dy > 35 ? 2 * PI : PI);
		}

		

		pop();
	}
}