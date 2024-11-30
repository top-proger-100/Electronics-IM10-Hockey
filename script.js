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

goalkeeper.setLeftDownState();

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

    goalkeeper.draw();
}, 20);