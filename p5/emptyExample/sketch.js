let character;
let enemy = [];
let enemyCount = 15;
// countdown is (2.5 + 2.5 * enemyCount) seconds, 
// 2.5s for getting used to the control and for defecting each enemy.
// The "60" at the end is for 60 frames per second, because I didn't find how to change a value each second but not each frame.
let countdown = (2.5 + 2.5 * enemyCount) * 60;
// this line is used for test whether this sketch can jump to the result page accordingly correctly
// let countdown = 100;

class Character {
	constructor(enemyCount) {
		this.x = width / 2;
		this.y = height * 2 / 3;
		this.enemyCount = enemyCount;
		this.velX = 0;
		this.velY = 0;
		this.basicVel = 2;
		this.lastVelX = 0;
		this.whetherAttack = false;
		this.score = 0;
		this.projectile = [];

		if (width <= height) {
			this.diameter = width / 2 / this.enemyCount;
		}
		else {
			this.diameter = width / 2 / this.enemyCount;
		}
	}

	update() {
		if (this.x >= 0 && this.x <= width && this.y >= 0 && this.y <= height) {
			if (keyIsPressed === true) {
				if (keyCode === UP_ARROW) {
					this.velY = this.basicVel * -1;
				}
				if (keyCode === DOWN_ARROW) {
					this.velY = this.basicVel;
				}
				if (keyCode === LEFT_ARROW) {
					this.velX = this.basicVel * -1;
					this.lastVelX = this.velX;
				}
				if (keyCode === RIGHT_ARROW) {
					this.velX = this.basicVel;
					this.lastVelX = this.velX;
				}
				// if (keyCode === 32) {
				// 	this.whetherAttack = true;
				// 	this.projectile.push(new Projectile(this.x, this.y, this.lastVelX));
				// }
			}
			else {
				this.velX = 0;
				this.velY = 0
				this.whetherAttack = false;
			}
		}
		// if the player character moves outside of the screen, it will refreshed at the middle of the screen
		else {
			this.x = width / 2;
			this.y = height / 2;
		}
		this.x += this.velX;
		this.y += this.velY;

		for (let i = 0; i < this.projectile.length; i++) {
			this.projectile[i].update();
		}

		noStroke();
		if (this.whetherAttack === false) {
			if (this.lastVelX < 0) {
				fill(59, 49, 100);
				arc(this.x, this.y, this.diameter, this.diameter, 180, 180 - 40);
				fill(59, 0, 100);
				arc(this.x, this.y, this.diameter, this.diameter, 180 - 40, 180);
				fill(59, 0, 0);
				ellipse(this.x - this.diameter / 5, this.y - this.diameter / 5, 5, 5);
			}
			else {
				fill(59, 49, 100);
				arc(this.x, this.y, this.diameter, this.diameter, 40, 0);
				fill(59, 0, 100);
				arc(this.x, this.y, this.diameter, this.diameter, 0, 40);
				fill(59, 0, 0);
				ellipse(this.x + this.diameter / 5, this.y - this.diameter / 5, 5, 5);
			}
		}
		else {
			if (this.lastVelX < 0) {
				fill(59, 49, 100);
				arc(this.x, this.y, this.diameter, this.diameter, 180 + 40, 180 - 40);
				fill(59, 0, 0);
				ellipse(this.x - this.diameter / 5, this.y - this.diameter / 5 - 8, 5, 5);
			}
			else {
				fill(59, 49, 100);
				arc(this.x, this.y, this.diameter, this.diameter, 40, 0 - 40);
				fill(59, 0, 0);
				ellipse(this.x + this.diameter / 5, this.y - this.diameter / 5 - 8, 5, 5);
			}
		}
	}
}

class Enemy {
	constructor(count, id) {
		this.x = random(0, width);
		this.y = random(0, height);
		this.count = count;
		this.id = id;
		this.velX = random([-1, 1]);
		this.velY = random([-1, 1]);
		// create boolean value for deciding whether this enemy is drawn
		this.whetherHit = false;
		// create animation ID for deciding which situation is drawn
		this.animId = 0;

		if (width <= height) {
			this.diameter = width / 2 / this.count;
		}
		else {
			this.diameter = width / 2 / this.count;
		}
	}

	update() {
		// draw only when this enemy is not hit
		if (this.whetherHit === false) {
			this.x += this.velX;
			this.y += this.velY;

			if (this.x < 0 || this.x > width) {
				this.velX *= -1;
			}

			if (this.y < 0 || this.y > height) {
				this.velY *= -1;
			}

			// animId ranges from 0 to 30, grows from 0 to 30 then returns to 0
			if (this.animId < 30) {
				this.animId += 1;
			}
			else if (this.animId === 30) {
				this.animId = 0;
			}

			noStroke();
			fill(5, 100, 100);
			// when 0 <= animId < (30 / 2), this enemy opens its mouth
			if (this.animId >= 0 && this.animId < 30 / 2) {
				if (this.velX < 0) {
					arc(this.x, this.y, this.diameter, this.diameter, 180 + 40, 180 - 40);
				}
				else {
					arc(this.x, this.y, this.diameter, this.diameter, 0 + 40, 0 - 40);
				}
			}
			// when (30 / 2) <= animId < 30, this enemy closes its mouth
			else if (this.animId >= 30 / 2 && this.animId <= 30) {
				if (this.velX < 0) {
					ellipse(this.x, this.y, this.diameter, this.diameter);
				}
				else {
					ellipse(this.x, this.y, this.diameter, this.diameter);
				}
			}
		}
	}
}

class Projectile {
	constructor(x, y, xDirection) {
		this.x = x;
		this.y = y;
		this.diameter = 10;
		if (xDirection >= 0) {
			this.velX = 10;
		}
		else {
			this.velX = -10;
		}
	}

	update() {
		this.x += this.velX;
		if (this.x >= 0 && this.x <= width) {
			fill(59, 49, 100);
			ellipse(this.x, this.y, this.diameter, this.diameter);
		}
	}
}

function drawGradientBackground() {
	// using HSB color mode within selected value range
	// from (209, 40, 100) at the top to (209, 100, 100) at the bottom here
	noStroke();
	for (let i = 0; i < height; i++) {
		fill(209, 40 + i / height * (100 - 40), 100);
		rect(0, i, width, 1);
	}
}

// when the distance between player character and enemy is smaller than 1.5 times of their diameter, 
// the enemy will escape to another random position.
function enemyEscape(character, enemy) {
	let ceDis = dist(character.x, character.y, enemy.x, enemy.y);
	// the diameter of character and that of enemy is same
	if (ceDis < enemy.diameter * 1.5) {
		enemy.x = random(0, width);
		enemy.y = random(0, height);
	}
}

// "when (keyIsPressed === true)" will cause an event to happen continously,
// while "keyPressed()" will cause an event only happens once.
// the latter one is used here, because using the former one for attack here will create a lot of projectile objects
// (perhaps about 60 * how many seconds of "when there are at least one key pressed, spacebar is among these keys").
function keyPressed() {
	if (keyCode === 32) {
		character.whetherAttack = true;
		character.projectile.push(new Projectile(character.x, character.y, character.lastVelX));
	}
}


function setup() {
	createCanvas(windowWidth, windowHeight);

	colorMode(HSB);
	angleMode(DEGREES);

	for (let i = 0; i < enemyCount; i++) {
		// constructor(count, id)
		enemy[i] = new Enemy(enemyCount, i);
	}

	character = new Character(enemyCount);
}

function draw() {
	drawGradientBackground();

	if (countdown > 0) {
		// check whether player has defected all the enemies
		if (character.score >= enemyCount) {
			countdown = 0;
		}

		countdown -= 1;

		character.update();

		for (let i = 0; i < enemy.length; i++) {
			enemy[i].update();
			enemyEscape(character, enemy[i]);
		}

		stroke(58, 47, 100);
		strokeWeight(5);
		fill(8, 78, 100);
		textSize(25);
		text("A different Pac-Man! Defect the enemies!", 30, 35);
		text("countdown: " + countdown, 30, 65);
		text("Your score: " + character.score, 30, 95);

		if (character.projectile.length > 0) {
			for (let i = 0; i < character.projectile.length; i++) {
				if (character.projectile[i].x < 0 || character.projectile[i].x > width) {
					character.projectile.splice(i, 1);
					i -= 1;
					continue;
				}

				else {
					for (let j = 0; j < enemy.length; j++) {
						let dis = dist(character.projectile[i].x, character.projectile[i].y, enemy[j].x, enemy[j].y);
						if (dis <= (character.projectile[i].diameter + enemy[j].diameter) / 2) {
							// character.projectile.splice(i, 1);
							character.score += 1;
							enemy[j].whetherHit = true;
							enemy.splice(j, 1);
							// i -= 1;
							j -= 1;
							continue;
						}
					}
					continue;
				}
			}
		}
	}
	else {
		countdown = 0;

		stroke(58, 47, 100);
		strokeWeight(5);
		fill(8, 78, 100);
		textSize(25);
		textAlign(CENTER, CENTER);
		text("Game Finished!", width / 2, height / 2 - 15);
		if (character.score >= enemyCount) {
			text("You Win!", width / 2, height / 2 + 15);
		}
		else {
			text("You Lose...", width / 2, height / 2 + 15);
		}
	}
}
