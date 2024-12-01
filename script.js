const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var background = new Image();
background_source_start = './Изображения/фон2.png';
background_source_game = './Изображения/фон.png';
background.src = background_source_start;

var state = 0; // 0 - сброс, 1 - установка будильника, 2 - время, 3 - время будильника, 4 - игра 1, 5 - игра 2

// вратарь
const goalkeeper = {
    coords: { x: 480, y: 240 },
    width: 91,
    height: 114,
    scores: 0,
    penalty_scores: 0, // до 6
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
        this.currentState = 0;
        this.image.src = this.states[this.currentState].image;
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

// кнопка сброса
const resetButton = {
    coords: { xLeft: 885, xRight: 910, yTop: 155, yBottom: 180 },
    width: 25,
    height: 25,
    image: new Image(),
    source: './Изображения/интерфейс/нажатая кнопка2.png',
    isShow: false,
    init() {
        this.image.src = this.source;
    },
    draw() {
        ctx.drawImage(this.image, this.coords.xLeft, this.coords.yTop, this.width, this.height);
    },
    action() {
        this.isShow = true;
        state = 0;
        background.src = background_source_start;
        this.isPm = false;
        this.minutes = 0;
        this.hours = 12;

        alarmButton.minutes = 0;
        alarmButton.hours = 12;
        alarmButton.isPm = true;
    },
    minutes: 0,
    hours: 12,
    isPm: false,
    addMinute() {
        this.minutes++;
        if (this.minutes == 60) {
            this.minutes = 0;
        }
    },
    deleteMinute() {
        this.minutes--;
        if (this.minutes == -1) {
            this.minutes = 59;
        }
    },
    addHour() {
        if (this.hours == 11) {
            if (this.isPm) {
                this.isPm = false;
            } else {
                this.isPm = true;
            }
        } else if (this.hours == 12) {
            this.hours = 0;
        }
        this.hours++;
    },
    // ???
    deleteHour() {
        if (this.hours == 12) {
            if (this.isPm) {
                this.isPm = false;
            } else {
                this.isPm = true;
            }
        } else if (this.hours == 1) {
            this.hours = 13;
        }
        this.hours--;
    },
    resetFlag() {
        this.isShow = false;
    }
};

// кнопка будильника
const alarmButton = Object.assign({}, resetButton);
alarmButton.coords = { xLeft: 885, xRight: 910, yTop: 90, yBottom: 115 };
alarmButton.isPm = true;
alarmButton.action = function() {
    alarmButton.isShow = true;
    background.src = background_source_game;
    state = 1;
    //alarmButton.minutes = 0;
    //alarmButton.hours = 12;
    //alarmButton.isPm = true;
    // ...
}

// кнопка просмотра времени часов и времени будильника
const timeButton = {
    coords: { xLeft: 811, xRight: 854, yTop: 186, yBottom: 221 },
    width: 43,
    height: 22,
    image: new Image(),
    isShow: false,
    source: './Изображения/интерфейс/нажатая кнопка.png',
    init() {
        this.image.src = this.source;
    },
    action() {
        this.isShow = true;
        state = 3;
        background.src = background_source_game;
    },
    resetFlag() {
        this.isShow = false;
        state = 2;
    },
    draw() {
        ctx.drawImage(this.image, this.coords.xLeft, this.coords.yTop,
             this.width, this.height);
    }
};

const game1Button = Object.assign({}, timeButton);
game1Button.coords = { xLeft: 811, xRight: 854, yTop: 55, yBottom: 90 };
game1Button.action = function() {
    this.isShow = true;
    background.src = background_source_game;
    state = 4;
    goalkeeper.scores = 0;
}
game1Button.resetFlag = function() {
    this.isShow = false;
}

const game2Button = Object.assign({}, game1Button);
game2Button.coords = { xLeft: 811, xRight: 854, yTop: 120, yBottom: 155 };
game1Button.action = function() {
    this.isShow = true;
    background.src = background_source_game;
    state = 5;
    goalkeeper.scores = 0;
}

const leftUpButton = {
    coords: {},
    image: new Image(),
    isShow: false,

};

// элементы интерфейса (различные надписи)
const ui_components = {
    clock_image: new Image(),
    clock_image_src:'./Изображения/интерфейс/часы.png',
    clock_coords: { x: 455, y: 140 },
    clock_width: 29,
    clock_height: 26,
    draw_clock() {
        ctx.drawImage(this.clock_image, this.clock_coords.x, this.clock_coords.y,
            this.clock_width, this.clock_height);
    },
    digit_width: 22,
    digit_height: 36,
    digits_image: [new Image(), new Image(), new Image(), new Image()],
    digits_src: [
        './Изображения/цифры/0.png', './Изображения/цифры/1.png', 
        './Изображения/цифры/2.png', './Изображения/цифры/3.png',
        './Изображения/цифры/4.png', './Изображения/цифры/5.png',
        './Изображения/цифры/6.png', './Изображения/цифры/7.png',
        './Изображения/цифры/8.png', './Изображения/цифры/9.png',
    ],
    digits_coords: [[585, 140], [555, 140], [515, 140], [485, 140]],
    draw_digits(digits) {
        for (let i = 0; i < digits.length; i++) {
            this.digits_image[i].src = this.digits_src[Number(digits[i])];
            ctx.drawImage(this.digits_image[i], this.digits_coords[digits.length-1-i][0],
                 this.digits_coords[digits.length-1-i][1], this.digit_width, this.digit_height);
        }
    },
    points_image: new Image(),
    points_src: './Изображения/интерфейс/двоеточие.png',
    points_width: 9,
    points_height: 20,
    points_coords: { x: 540, y: 150 },
    draw_points() {
        ctx.drawImage(this.points_image, this.points_coords.x, this.points_coords.y,
             this.points_width, this.points_height);
    },
    referee_image: new Image(),
    referee_src: './Изображения/интерфейс/Судья с нотами.png',
    referee_width: 99,
    referee_height: 79,
    referee_coords: { x: 340, y: 143 },
    draw_referee() {
        ctx.drawImage(this.referee_image, this.referee_coords.x, this.referee_coords.y,
            this.referee_width, this.referee_height);
    },
    
    init() {
        this.points_image.src = this.points_src;
        this.clock_image.src = this.clock_image_src;
        this.referee_image.src = this.referee_src;
        // ...
    }
};

window.addEventListener('keydown', function(event) {
    if (event.code == 'KeyQ') {
        if (state == 4 || state == 5) {
            goalkeeper.setLeftUpState();
        } else if (state == 0) {
            resetButton.addHour();
        } else if (state == 1) {
            alarmButton.addHour();
        }
    } else if (event.code == 'KeyS') {
        if (state == 4 || state == 5) {
            goalkeeper.setLeftDownState();
        } else if (state == 0) {
            resetButton.deleteHour();
        } else if (state == 1) {
            alarmButton.deleteHour();
        }
    } else if (event.code == 'KeyP') {
        if (state == 4 || state == 5) {
            goalkeeper.setRightUpState();
        } else if (state == 0) {
            resetButton.addMinute();
        } else if (state == 1) {
            alarmButton.addMinute();
        }
    } else if (event.code == 'KeyL') {
        if (state == 4 || state == 5) {
            goalkeeper.setRightDownState();
        } else if (state == 0) {
            resetButton.deleteMinute();
        } else if (state == 1) {
            alarmButton.deleteMinute();
        }
    } 
});

buttons = [resetButton, alarmButton, timeButton, game1Button, game2Button];

window.addEventListener('mousedown', function(event) {
    if (event.which == 1) {
        var rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        for(let i = 0; i < buttons.length; i++) {
            if (clickX >= buttons[i].coords.xLeft && clickX <= buttons[i].coords.xRight
                && clickY >= buttons[i].coords.yTop && clickY <= buttons[i].coords.yBottom) {
                    buttons[i].action();
            }
        }
    }
});

window.addEventListener('mouseup', function(event) {
    if (event.which == 1) {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].isShow) {
                buttons[i].resetFlag();
            }
        }
    }
});


var pucks = [puckLD, puckRD, puckLU, puckRU];

goalkeeper.setLeftDownState();

for (let puck of pucks) {
    puck.init();
}
for (let button of buttons) {
    button.init();
}
ui_components.init();

var currentPuck = pucks[0];

setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (state == 4 || state == 5) {
        // в режиме игры
        currentPuck.draw();
        currentPuck.move();
    
        ui_components.draw_digits(String(goalkeeper.scores));
        goalkeeper.draw();
    } else {
        // другие режимы
        let hours;
        let minutes;
        if (state == 1 || state == 3) {
            hours = String(alarmButton.hours);
            minutes = String(alarmButton.minutes);
        } else {
            hours = String(resetButton.hours);
            minutes = String(resetButton.minutes);
        }
        if (hours.length == 1) {
            hours = '0' + hours;
        }
        if (minutes.length == 1) {
            minutes = '0' + minutes;
        }
        let time = hours + minutes;
        ui_components.draw_digits(time);
        ui_components.draw_points();
        if ((state == 1 || state == 3) && alarmButton.isPm || (state == 0 || state == 2) && resetButton.isPm) {
            ui_components.draw_clock();
        }
        if (state == 1 || state == 3) {
            ui_components.draw_referee();
        }

        if (state == 1 || state == 2 || state == 3) {
            goalkeeper.draw();
        }
    }

    // отрисовка кнопок
    for (let button of buttons) {
        if (button.isShow) {
            button.draw();
        }
    }
}, 20);