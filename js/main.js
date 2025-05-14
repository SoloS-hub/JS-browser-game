const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const width = (canvas.width = 960)
const height = (canvas.height = 346)
const gravity = 9.82
const timeToUppdate = 15
const Hz = 60

let gameOn = false

let gamespeed = 1

let xVelocity = 0

const State = {
	states: {},
	generateState: function (name, startStateX, endStateX, stateY, timeToUppdate) {
		if (!this.states[name]) {
			this.states[name] = {
				frameIndex: startStateX,
				startIndex: startStateX,
				endIndex: endStateX,
				stateY: stateY,
				timeToUppdate: timeToUppdate,
			}
		}
	},
	getState: function (name) {
		if (this.states[name]) {
			return this.states[name]
		}
	},
}

State.generateState("runing", 0, 7, 3, 10)
State.generateState("jumping", 2, 7, 5, 18)

const hitboxes = {
	player: {
		x: 7,
		y: 4,
		width: 16,
		height: 28,
	},
	obsticle: {
		"1,0": {
			x: 2,
			y: 0,
			width: 27,
			height: 32,
		},
	},
}

class draw {
	constructor(spriteSheet, fWidth, fHeight, stateX = 0, stateY = 0) {
		this.image = spriteSheet
		this.stateX = stateX
		this.stateY = stateY
		this.frameWidth = fWidth
		this.frameHeight = fHeight
		this.frameX = 32 * this.stateX
		this.frameY = 32 * this.stateY
		this.xPos = 0
		this.yPos = 0
		this.scale = 1
	}
	update() {
		context.drawImage(
			this.image,
			this.frameX * this.frameWidth,
			this.frameY * this.frameHeight,
			this.frameWidth,
			this.frameHeight,
			this.xPos,
			this.yPos,
			this.frameWidth * this.scale,
			this.frameHeight * this.scale
		)
	}
}

class background extends draw {
	constructor(spriteSheet, speedMod = 1) {
		super(spriteSheet, 1024, 346)
		this.speedModifier = speedMod
	}

	update() {
		context.drawImage(
			this.image,
			this.frameX * this.frameWidth,
			this.frameY * this.frameHeight,
			this.frameWidth,
			this.frameHeight,
			this.xPos,
			this.yPos,
			this.frameWidth * this.scale,
			this.frameHeight * this.scale
		)

		context.drawImage(
			this.image,
			this.frameX * this.frameWidth,
			this.frameY * this.frameHeight,
			this.frameWidth,
			this.frameHeight,
			this.xPos + this.frameWidth,
			this.yPos,
			this.frameWidth * this.scale,
			this.frameHeight * this.scale
		)

		this.xPos -= xVelocity * this.speedModifier

		if (this.xPos <= -this.frameWidth) {
			this.xPos += this.frameWidth * this.scale
		}
	}
}

class tile extends draw {
	constructor(spriteSheet, fWidth, fHeight, layer, stateX = 1, stateY = 0) {
		super(spriteSheet, fWidth, fHeight, stateX, stateY)
		this.layer = layer
	}

	update() {
		for (let i = 0; i < Math.floor(width / this.frameWidth) + 2; i++) {
			context.drawImage(
				this.image,
				this.frameX,
				this.frameY,
				this.frameWidth,
				this.frameHeight,
				this.xPos + this.frameWidth * i,
				this.yPos + (height - this.layer * this.frameHeight),
				this.frameWidth * this.scale,
				this.frameHeight * this.scale
			)
		}

		this.xPos -= xVelocity

		if (this.xPos <= -this.frameWidth * this.scale) {
			this.xPos += this.frameWidth * this.scale
		}
	}
}

class obsticle extends draw {
	constructor(spriteSheet, fWidth, fHeight, stateX = 1, stateY = 0) {
		super(spriteSheet, fWidth, fHeight, stateX, stateY)
		this.scale = 1
		this.yPos = height - 2 * 32 - this.frameHeight * this.scale
		this.xPos = 1024
		this.hitbox = hitboxes.obsticle[`${stateX},${stateY}`]
		this.active = true
	}

	update() {
		context.drawImage(this.image, this.frameX, this.frameY, this.frameWidth, this.frameHeight, this.xPos, this.yPos, this.frameWidth * this.scale, this.frameHeight * this.scale)

		if (this.xPos <= 200 && this.active) {
			obsticles.push(new obsticle(decor, 32, 32, 1, 0))
			this.active = false
		}

		this.xPos -= xVelocity

		if (this.xPos <= -this.frameWidth * this.scale) {
			obsticles.shift()
			obsticles[0].update()
		}
	}
}

class playerClass extends draw {
	constructor(spriteSheet, fWidth, fHeight, stateX = 1, stateY = 0) {
		super(spriteSheet, fWidth, fHeight, stateX, stateY)
		this.scale = 1
		this.xPos = 100
		this.ground = 2 * 32 + this.frameHeight * this.scale
		this.yPos = height - this.ground
		this.jumping = false
		this.jumpstrength = (30 * gravity) / Hz
		this.yVelocity = 0
		this.hitbox = hitboxes.player
		this.count = 0
		this.state = State.getState("runing")
		this.score = 0
		this.test = 0
	}

	update() {
		// check for collision

		if (this.jumping) {
			this.yVelocity -= gravity / Hz
			this.yPos -= this.yVelocity

			if (this.yPos >= height - this.ground) {
				this.jumping = false
				this.yPos = height - this.ground
				this.yVelocity = 0
			}
		}

		this.test++

		if (this.test >= 100) {
			this.test = 0
			xVelocity += 0.01
		}

		this.score += 1 / Hz

		this.checkCollision()
		this.frameX = this.frameWidth * this.state.frameIndex
		this.frameY = this.frameHeight * this.state.stateY

		if (this.jumping) {
			this.state = State.getState("jumping")
		} else {
			this.state = State.getState("runing")
		}
		if (this.count >= this.state.timeToUppdate) {
			this.state.frameIndex++
			if (this.state.frameIndex >= this.state.endIndex + 1) {
				this.state.frameIndex = this.state.startIndex
			}
			this.count = 0
		}
		this.count++

		context.drawImage(this.image, this.frameX, this.frameY, this.frameWidth, this.frameHeight, this.xPos, this.yPos, this.frameWidth * this.scale, this.frameHeight * this.scale)
	}

	checkCollision() {
		if (
			(this.xPos + this.hitbox.x <= obsticles[0].xPos + obsticles[0].hitbox.x && this.xPos + this.hitbox.x + this.hitbox.width >= obsticles[0].xPos + obsticles[0].hitbox.x) ||
			(this.xPos + this.hitbox.x <= obsticles[0].xPos + obsticles[0].hitbox.x + obsticles[0].hitbox.width &&
				this.xPos + this.hitbox.x + this.hitbox.width >= obsticles[0].xPos + obsticles[0].hitbox.x + obsticles[0].hitbox.width)
		) {
			if (this.yPos + this.frameHeight >= obsticles[0].yPos + obsticles[0].hitbox.y) {
				console.log("collision")
				gameOn = false
			}
		}
	}
}

const spriteSheetPlayer = new Image()
spriteSheetPlayer.src = "../img/AnimationSheet_Character.png"
let player = new playerClass(spriteSheetPlayer, 32, 32, 0)

const spriteSheetBG1 = new Image()
spriteSheetBG1.src = "../img/GandalfHardcore-Background-layers_layer-1.png"
let bg1 = new background(spriteSheetBG1, 1)

const spriteSheetBG2 = new Image()
spriteSheetBG2.src = "../img/GandalfHardcore-Background-layers_layer-2.png"
let bg2 = new background(spriteSheetBG2, 0.6)

const spriteSheetBG3 = new Image()
spriteSheetBG3.src = "../img/GandalfHardcore-Background-layers_layer-3.png"
let bg3 = new background(spriteSheetBG3, 0.36)

const spriteSheetBG4 = new Image()
spriteSheetBG4.src = "../img/GandalfHardcore-Background-layers_layer-4.png"
let bg4 = new background(spriteSheetBG4, 0.216)

const spriteSheetBG5 = new Image()
spriteSheetBG5.src = "../img/GandalfHardcore-Background-layers_layer-5.png"
let bg5 = new background(spriteSheetBG5, 0)

const spriteSheetTile = new Image()
spriteSheetTile.src = "../img/Floor-Tiles1.png"
let tile1 = new tile(spriteSheetTile, 32, 32, 2, 1, 0)
let tile2 = new tile(spriteSheetTile, 32, 32, 1, 1, 1)

const decor = new Image()
decor.src = "../img/Decor.png"
let obsticles = []

function animate() {
	bg5.update()
	bg4.update()
	bg3.update()
	bg2.update()
	bg1.update()
	tile1.update()
	tile2.update()
	obsticles.forEach((obsticle) => obsticle.update())
	player.update()
}

function frame() {
	context.clearRect(0, 0, width, height)
	animate()

	if (gameOn) {
		requestAnimationFrame(frame)
	}
}

setInterval(function () {}, 1)

document.addEventListener("keydown", function (e) {
	if (e.key == " " || e.code == "Space") {
		if (!gameOn) {
			gameOn = true
			obsticles = []
			obsticles.push(new obsticle(decor, 32, 32, 1, 0))
			player = new playerClass(spriteSheetPlayer, 32, 32, 0)
			xVelocity = 240 / Hz
			frame()
		} else if (!player.jumping) {
			State.getState("jumping").frameIndex = State.getState("jumping").startIndex
			player.count = 0
			player.jumping = true
			player.yVelocity = player.jumpstrength
		}
	}
})

frame()
