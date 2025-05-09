const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const width = canvas.width = 960
const height = canvas.height = 346
const fps = 60
const secondsToUpdate = 1 * fps

let xVelocity = 1

class draw {
	constructor(spriteSheet, fWidth, fHeight, stateX = 0, stateY = 0) {
		this.image = spriteSheet
        this.stateX = stateX
        this.stateY = stateY
		this.frameWidth = fWidth
		this.frameHeight = fHeight
		this.frameX = this.frameWidth * this.stateX
		this.frameY = this.frameHeight * this.stateY
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
    constructor(spriteSheet, fWidth, fHeight, speedMod = 1) {
        super(spriteSheet, fWidth, fHeight);
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
            this.xPos + this.frameWidth-1,
            this.yPos,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale
        )

        this.xPos -= xVelocity * this.speedModifier;

        if (this.xPos <= -this.frameWidth) {
            this.xPos = 0;
        }
    }
}

class tile extends draw {
    constructor(spriteSheet, fWidth, fHeight, layer, stateX = 1, stateY = 0) {
        super(spriteSheet, fWidth, fHeight, stateX, stateY);
        this.layer = layer
    }

    update() {
        for (let i = 0; i < Math.floor(width/this.frameWidth) + 2; i++) {
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
        
        this.xPos -= xVelocity;

        if (this.xPos <= -this.frameWidth) {
            this.xPos = 0;
        }
    }
}

class playerClass extends draw {
    constructor(spriteSheet, fWidth, fHeight, stateX = 1, stateY = 0) {
        super(spriteSheet, fWidth, fHeight, stateX, stateY);
        this.scale = 1.5
        this.xPos = 100
        this.yPos = height - (2 * 32 + this.frameHeight * this.scale)
    }

    update() {
        context.drawImage(
            this.image,
            this.frameX,
            this.frameY,
            this.frameWidth,
            this.frameHeight,
            this.xPos,
            this.yPos,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale
        )
    }
}

const spriteSheetPlayer = new Image()
spriteSheetPlayer.src = "../img/AnimationSheet_Character.png"
let player = new playerClass(spriteSheetPlayer, 32, 32, 0)

const spriteSheetBG1 = new Image()
spriteSheetBG1.src = "../img/GandalfHardcore-Background-layers_layer-1.png"
let bg1 = new background(spriteSheetBG1, 1024, 346, 1)

const spriteSheetBG2 = new Image()
spriteSheetBG2.src = "../img/GandalfHardcore-Background-layers_layer-2.png"
let bg2 = new background(spriteSheetBG2, 1024, 346, 0.6)

const spriteSheetBG3 = new Image()
spriteSheetBG3.src = "../img/GandalfHardcore-Background-layers_layer-3.png"
let bg3 = new background(spriteSheetBG3, 1024, 346, 0.36)

const spriteSheetBG4 = new Image()
spriteSheetBG4.src = "../img/GandalfHardcore-Background-layers_layer-4.png"
let bg4 = new background(spriteSheetBG4, 1024, 346, 0.216)

const spriteSheetBG5 = new Image()
spriteSheetBG5.src = "../img/GandalfHardcore-Background-layers_layer-5.png"
let bg5 = new background(spriteSheetBG5, 1024, 346, 0.1296)

const spriteSheetTile = new Image()
spriteSheetTile.src = "../img/Floor-Tiles1.png"
let tile1 = new tile(spriteSheetTile, 32, 32, 2, 1, 0)
let tile2 = new tile(spriteSheetTile, 32, 32, 1, 1, 1)

function animate() {
    bg5.update()
    bg4.update()
    bg3.update()
    bg2.update()
    bg1.update()
    tile1.update()
    tile2.update()
    player.update()
}

function frame() {
	context.clearRect(0, 0, width, height)
	animate()
	requestAnimationFrame(frame)
}

frame()
