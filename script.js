const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var background = new Image();
background.src = './Изображения/фон.png';

const goalkeeper = {
    coords: { x: 480, y: 240 },
    width: 91,
    height: 114,
    image: new Image(),
    rightCoords: { x: 480, y: 245 },
    leftCoords: { x: 390, y: 245 },
    draw() {
        ctx.drawImage(this.image, this.coords.x, this.coords.y, this.width, this.height);
    },
    setLeftUpState() {
        this.coords = this.leftCoords;
        this.image.src = './Изображения/вратарь/лвв.png';
    },
    setLeftDownState() {
        this.coords = this.leftCoords;
        this.image.src = './Изображения/вратарь/лнв.png';
    },
    setRightUpState() {
        this.coords = this.rightCoords;
        this.image.src = './Изображения/вратарь/пвв.png';
    },
    setRightDownState() {
        this.coords = this.rightCoords;
        this.image.src = './Изображения/вратарь/пнв.png';
    }
};

// левая нижняя шайба
const puckLD = {
    width: 10,
    height: 10,
    currentState: 0,
    moveParam: 0,
    image: new Image(),
    states: {
        0: {image: './Изображения/лнш/лнш1.png', x: 360, y: 380},
        1: {image: './Изображения/лнш/лнш2.png', x: 370, y: 370},
        2: {image: './Изображения/лнш/лнш3.png', x: 377, y: 360},
        3: {image: './Изображения/лнш/лнш4.png', x: 385, y: 340},
        4: {image: './Изображения/лнш/лнш5.png', x: 395, y: 330},
    },
    draw() {
        ctx.drawImage(this.image, this.states[this.currentState % 5].x,
             this.states[this.currentState % 5].y, this.width, this.height);
    },
    init() {
        this.image.src = this.states[this.currentState % 5].image;
    },
    move() {
        if (this.moveParam % 35 == 0) {
            this.currentState++;
            this.image.src = this.states[this.currentState % 5].image;
        }
        this.moveParam++;
    },
    isLastState() {
        return this.currentState % 5 == 0 && this.currentState != 0;
    }
};

// правая нижняя шайба
const puckRD = Object.assign({}, puckLD);

// левая верхняя шайба
const puckLU = Object.assign({}, puckLD);

// правая верхняя шайба
const puckRU = Object.assign({}, puckLD);

var pucks = [puckLD, puckRD, puckLU, puckRU];

goalkeeper.setLeftDownState();

for (let puck of pucks) {
    puck.init();
}

var currentPuck = pucks[0];

window.addEventListener('keydown', function(event) {
    if (event.code == 'KeyQ') {
        goalkeeper.setLeftUpState();
    } else if (event.code == 'KeyS') {
        goalkeeper.setLeftDownState();
    } else if (event.code == 'KeyP') {
        goalkeeper.setRightUpState();
    } else if (event.code == 'KeyL') {
        goalkeeper.setRightDownState();
    } 
});

setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    currentPuck.draw();
    currentPuck.move();

    goalkeeper.draw();
}, 20);