const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var background = new Image();
background_source_start = './Изображения/фон2.png';
background_source_game = './Изображения/фон.png';
background.src = background_source_start;

var state = 0; // 0 - сброс, 1 - установка будильника, 2 - время, 3 - время будильника, 4 - игра 1, 5 - игра 2

var time_value = 0;
var isPlayAlarm = false;

var delay = 100;

var alarmAudio = new Audio('./Звуки/будильник.mp4');
var ldpAudio = new Audio('./Звуки/лнш.mp4');
var lupAudio = new Audio('./Звуки/лвш.mp4');
var rupAudio = new Audio('./Звуки/пвш.mp4');
var rdpAudio = new Audio('./Звуки/пнш.mp4');
var addScoreAudio = new Audio('./Звуки/плюс_один.mp4');
var penaltyScoreAudio = new Audio('./Звуки/штрафное очко.mp4');

// вратарь
const goalkeeper = {
    coords: null,
    width: null,
    height: null,
    scores: 0,
    // штрафные очки
    penalty_scores: 0, // до 6
    images: null,
    iamge: null,
    state: 0,
    draw() {
        ctx.drawImage(this.image, this.coords.x, this.coords.y, this.width, this.height);
    },
    init() {
        this.images = [new Image(), new Image(), new Image(), new Image(), new Image()];
        let sources = [
            './Изображения/вратарь/лнв.png', './Изображения/вратарь/лвв.png',
            './Изображения/вратарь/пвв.png', './Изображения/вратарь/пнв.png'
        ]
        for (let i = 0; i < sources.length; i++) {
            this.images[i].src = sources[i];
        }
    },
    // левое верхнее положение
    setLeftUpState() {
        this.state = 1;
        this.coords = { x: 393, y: 245 };
        this.image = this.images[1];
        this.width = 84;
        this.height = 117;
    },
    // левое нижнее положение
    setLeftDownState() {
        this.state = 0;
        this.coords = { x: 390, y: 245 };
        this.image = this.images[0];
        this.width = 87;
        this.height = 117;
    },
    // правое верхнее положение
    setRightUpState() {
        this.state = 2;
        this.coords = { x: 480, y: 245 };
        this.width = 85;
        this.height = 113;
        this.image = this.images[2];
    },
    // правое нижнее положение
    setRightDownState() {
        this.state = 3;
        this.coords = { x: 480, y: 245 };
        this.width = 86;
        this.height = 113;
        this.image = this.images[3];
    }
};

// левая нижняя шайба
const puckLD = {
    width: 16,
    height: 14,
    currentState: 0,
    images: null,
    states: {
        0: {image: './Изображения/лнш/лнш1.png', x: 360, y: 380},
        1: {image: './Изображения/лнш/лнш2.png', x: 365, y: 370},
        2: {image: './Изображения/лнш/лнш3.png', x: 373, y: 360},
        3: {image: './Изображения/лнш/лнш4.png', x: 380, y: 345},
        4: {image: './Изображения/лнш/лнш5.png', x: 386, y: 325},
    },
    draw() {
        if (this.currentState >= 0) {
            ctx.drawImage(this.images[this.currentState], this.states[this.currentState].x,
                this.states[this.currentState].y, this.width, this.height);
        } else {
            ctx.drawImage(this.images[0], this.states[0].x,
                this.states[0].y, this.width, this.height);
        }
    },
    init() {
        this.images = [new Image(), new Image(), new Image(), new Image(), new Image()];
        for (let i = 0; i < this.images.length; i++) {
            this.images[i].src = this.states[i].image;
        }
        this.currentState = -1;
    },
    move() {
        this.currentState++;
    },
    isLastState() {
        return this.currentState == 4;
    },
};

// правая нижняя шайба
const puckRD = Object.create(puckLD);
puckRD.states = {
    0: { image: './Изображения/пнш/пнш1.png', x: 595, y: 380 },
    1: { image: './Изображения/пнш/пнш2.png', x: 585, y: 370 },
    2: { image: './Изображения/пнш/пнш3.png', x: 575, y: 360 },
    3: { image: './Изображения/пнш/пнш4.png', x: 565, y: 345 },
    4: { image: './Изображения/пнш/пнш5.png', x: 555, y: 325 },
};

// левая верхняя шайба
const puckLU = Object.create(puckLD);
puckLU.states = {
    0: { image: './Изображения/лвш/лвш1.png', x: 305, y: 280 },
    1: { image: './Изображения/лвш/лвш2.png', x: 320, y: 275 },
    2: { image: './Изображения/лвш/лвш3.png', x: 340, y: 270 },
    3: { image: './Изображения/лвш/лвш4.png', x: 360, y: 265 },
    4: { image: './Изображения/лвш/лвш5.png', x: 380, y: 260 },
};

// правая верхняя шайба
const puckRU = Object.create(puckLD);
puckRU.states = {
    0: { image: './Изображения/пвш/пвш1.png', x: 635, y: 280 },
    1: { image: './Изображения/пвш/пвш2.png', x: 620, y: 275 },
    2: { image: './Изображения/пвш/пвш3.png', x: 600, y: 270 },
    3: { image: './Изображения/пвш/пвш4.png', x: 580, y: 265 },
    4: { image: './Изображения/пвш/пвш5.png', x: 565, y: 260 }
};

var allPucks = [[Object.create(puckLD)], [], [], []];

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

        time_value = 0;
        isPlayAlarm = false;
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

// кнопка установки будильника
const alarmButton = Object.assign({}, resetButton);
alarmButton.coords = { xLeft: 885, xRight: 910, yTop: 90, yBottom: 115 };
alarmButton.isPm = true;
alarmButton.action = function() {
    alarmButton.isShow = true;
    background.src = background_source_game;
    state = 1;
    isPlayAlarm = false;
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
        isPlayAlarm = false;
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

// кнопка игра 1
const game1Button = Object.assign({}, timeButton);
game1Button.coords = { xLeft: 811, xRight: 854, yTop: 55, yBottom: 90 };
game1Button.setState = function() {
    state = 4;
}
game1Button.resetPucks = function() {
    addPuck = 0;
    allPucks = [[Object.create(puckLD)], [], [], []];
    for (let pucks of allPucks) {
        for (let puck of pucks) {
            puck.init();
        }
    }
}
game1Button.puckSpeed = 700 / delay;
game1Button.action = function() {
    this.resetPucks();
    currentPuckInd = 0;
    this.isShow = true;
    background.src = background_source_game;
    goalkeeper.scores = 0;
    goalkeeper.penalty_scores = 0;
    isPlayAlarm = false;
    // начальное положение шайб и хоккеиста
    goalkeeper.setLeftDownState();
    this.setState();
    puckSpeed = this.puckSpeed;
    isResetScore = true;
    isCatched = false;
    isAddedPuck = false;
    addPuck = 0;    
    puck_count = 1;
}
game1Button.resetFlag = function() {
    this.isShow = false;
}

// кнопка игра 2
const game2Button = Object.assign({}, game1Button);
game2Button.puckSpeed = 600 / delay;
game2Button.coords = { xLeft: 811, xRight: 854, yTop: 120, yBottom: 155 };
game2Button.setState = function() {
    state = 5;
}

// левая верхняя кнопка управления
const leftUpButton = {
    coords: { xLeft: 85, xRight: 141, yTop: 340, yBottom: 396 },
    image: new Image(),
    source: './Изображения/интерфейс/нажатая кнопка3.png',
    isShow: false,
    width: 56,
    height: 56,
    init() {
        this.image.src = this.source;
    },
    action() {
        this.isShow = true;
    },
    resetFlag() {
        this.isShow = false;
        if (state == 4 || state == 5) {
            goalkeeper.setLeftUpState();
        } else if (state == 0) {
            resetButton.addHour();
        } else if (state == 1) {
            alarmButton.addHour();
        }
    },
    draw() {
        ctx.drawImage(this.image, this.coords.xLeft,
             this.coords.yTop, this.width, this.height);
    }
};

// левая нижняя кнопка управления
const leftDownButton = Object.assign({}, leftUpButton);
leftDownButton.coords = { xLeft: 85, xRight: 141, yTop: 440, yBottom: 496 };
leftDownButton.resetFlag = function() {
    this.isShow = false;
    if (state == 4 || state == 5) {
        goalkeeper.setLeftDownState();
    } else if (state == 0) {
        resetButton.deleteHour();
    } else if (state == 1) {
        alarmButton.deleteHour();
    }
}

// правая верхняя кнопка управления
const rightUpButton = Object.assign({}, leftUpButton);
rightUpButton.coords = { xLeft: 820, xRight: 876, yTop: 340, yBottom: 396 },
rightUpButton.resetFlag = function() {
    this.isShow = false;
    if (state == 4 || state == 5) {
        goalkeeper.setRightUpState();
    } else if (state == 0) {
        resetButton.addMinute();
    } else if (state == 1) {
        alarmButton.addMinute();
    }
}

// левая нижняя кнопка управления
const rightDownButton = Object.assign({}, leftUpButton);
rightDownButton.coords = { xLeft: 820, xRight: 876, yTop: 440, yBottom: 496 },
rightDownButton.resetFlag = function() {
    this.isShow = false;
    if (state == 4 || state == 5) {
        goalkeeper.setRightDownState();
    } else if (state == 0) {
        resetButton.deleteMinute();
    } else if (state == 1) {
        alarmButton.deleteMinute();
    }
}

// элементы интерфейса (различные надписи)
const ui_components = {
    // часы
    clock_image: new Image(),
    clock_image_src:'./Изображения/интерфейс/часы.png',
    clock_coords: { x: 455, y: 140 },
    clock_width: 29,
    clock_height: 26,
    draw_clock() {
        ctx.drawImage(this.clock_image, this.clock_coords.x, this.clock_coords.y,
            this.clock_width, this.clock_height);
    },
    // цифры
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
    // двоеточие
    points_image: new Image(),
    points_src: './Изображения/интерфейс/двоеточие.png',
    points_width: 9,
    points_height: 20,
    points_coords: { x: 540, y: 150 },
    draw_points() {
        ctx.drawImage(this.points_image, this.points_coords.x, this.points_coords.y,
             this.points_width, this.points_height);
    },
    // судья при звонке будильника
    alarm_referee_image: new Image(),
    alarm_referee_src: './Изображения/интерфейс/Судья с нотами.png',
    alarm_referee_width: 99,
    alarm_referee_height: 79,
    alarm_referee_coords: { x: 340, y: 143 },
    draw_alarm_referee() {
        ctx.drawImage(this.alarm_referee_image, this.alarm_referee_coords.x, this.alarm_referee_coords.y,
            this.alarm_referee_width, this.alarm_referee_height);
    },
    // судья в игре
    referee_image: new Image(),
    referee_image_src: './Изображения/интерфейс/Судья.png',
    referee_enable_flag: false,
    referee_width: 74,
    referee_height: 76,
    referee_coords: { x: 340, y: 143 },
    draw_referee() {
        ctx.drawImage(this.referee_image, this.referee_coords.x, this.referee_coords.y,
            this.referee_width, this.referee_height);
    },
    // надпись игра 1
    game1_image: new Image(),
    game1_image_src: './Изображения/интерфейс/игра1.png',
    game1_width: 53,
    game1_height: 22,
    game1_coords: { x: 400, y: 378 },
    draw_game1() {
        ctx.drawImage(this.game1_image, this.game1_coords.x, this.game1_coords.y,
            this.game1_width, this.game1_height);
    },
    // надпись игра 2
    game2_image: new Image(),
    game2_image_src: './Изображения/интерфейс/игра2.png',
    game2_width: 62,
    game2_height: 22,
    game2_coords: { x: 501, y: 376 },
    draw_game2() {
        ctx.drawImage(this.game2_image, this.game2_coords.x, this.game2_coords.y,
            this.game2_width, this.game2_height);
    },
    // штарфные очки (шайбы в звезде)
    penalty_scores_images: [new Image(), new Image(), new Image()],
    penalty_scores_src: './Изображения/интерфейс/шайба в звезде.png',
    penalty_scores_coords: [[525, 205], [495, 205], [465, 205]],
    penalty_scores_width: 26,
    penalty_scores_height: 23,
    penalty_half_score_enabled: false,
    draw_penalty_scores() {
        let penalty_scores = goalkeeper.penalty_scores;
        if (penalty_scores > 6) penalty_scores = 6;
        if (penalty_scores % 2 == 1) {
            let ind = (penalty_scores-1) / 2;
            for (let i = 0; i < ind; i++) {
                ctx.drawImage(this.penalty_scores_images[i], this.penalty_scores_coords[i][0],
                    this.penalty_scores_coords[i][1], this.penalty_scores_width, this.penalty_scores_height);
            }
            if (time_value % (500 / delay) == 0) { // 500 мс
                this.penalty_half_score_enabled = this.penalty_half_score_enabled ? false : true;
            }
            if (this.penalty_half_score_enabled) {
                ctx.drawImage(this.penalty_scores_images[ind],
                    this.penalty_scores_coords[ind][0], this.penalty_scores_coords[ind][1],
                    this.penalty_scores_width, this.penalty_scores_height);
            }
        } else {
            for (let i = 0; i < penalty_scores / 2; i++) {
                ctx.drawImage(this.penalty_scores_images[i], this.penalty_scores_coords[i][0],
                    this.penalty_scores_coords[i][1], this.penalty_scores_width, this.penalty_scores_height);
            }
        }
    },
    // надпись "счёт"
    count_image: new Image(),
    count_image_src: './Изображения/интерфейс/счёт.png',
    count_image_coords: { x: 520, y: 180 },
    count_image_width: 42,
    count_image_height: 16,
    draw_count_image() {
        ctx.drawImage(this.count_image, this.count_image_coords.x, this.count_image_coords.y,
            this.count_image_width, this.count_image_height);
    },
    
    init() {
        this.points_image.src = this.points_src;
        this.clock_image.src = this.clock_image_src;
        this.alarm_referee_image.src = this.alarm_referee_src;
        this.referee_image.src = this.referee_image_src;
        this.game1_image.src = this.game1_image_src;
        this.game2_image.src = this.game2_image_src;
        for (let i = 0; i < this.penalty_scores_images.length; i++) {
            this.penalty_scores_images[i].src = this.penalty_scores_src;
        }
        this.count_image.src = this.count_image_src;
    }
};


buttons = [resetButton, alarmButton, timeButton,
    game1Button, game2Button, leftUpButton, leftDownButton,
    rightUpButton, rightDownButton];


// обработка нажатия клавиш
window.addEventListener('keydown', function(event) {
    if (event.code == 'KeyQ') {
        leftUpButton.action();
    } else if (event.code == 'KeyS') {
        leftDownButton.action();
    } else if (event.code == 'KeyP') {
        rightUpButton.action();
    } else if (event.code == 'KeyL') {
        rightDownButton.action();
    } else if (event.key == '1') {
        game1Button.action();
    } else if (event.key == '2') {
        game2Button.action();
    } else if (event.key == '3') {
        timeButton.action();
    } else if (event.key == '4') {
        alarmButton.action();
    } else if (event.key == '5') {
        resetButton.action();
    }
});
window.addEventListener('keyup', function(event) {
    if (event.code == 'KeyQ') {
        leftUpButton.resetFlag();
    } else if (event.code == 'KeyS') {
        leftDownButton.resetFlag();
    } else if (event.code == 'KeyP') {
        rightUpButton.resetFlag();
    } else if (event.code == 'KeyL') {
        rightDownButton.resetFlag();
    } else if (event.key == '1') {
        game1Button.resetFlag();
    } else if (event.key == '2') {
        game2Button.resetFlag();
    } else if (event.key == '3') {
        timeButton.resetFlag();
    } else if (event.key == '4') {
        alarmButton.resetFlag();
    } else if (event.key == '5') {
        resetButton.resetFlag();
    }
});

// обработка нажатия мыши
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


goalkeeper.init();
goalkeeper.setLeftDownState();
for (let pucks of allPucks) {
    for (let puck of pucks) {
        puck.init();
    }
}
for (let button of buttons) {
    button.init();
}
ui_components.init();

var currentPuckInd = 0;

// функция, которая нужна для движения шайб в одном направлении (слева/справа сверху/снизу) 
function getCurrentPucksInd() {
    currentPuckInd++;
    if (allPucks[currentPuckInd % allPucks.length].length == 0) {
        getCurrentPucksInd();
    }
}

// нужна для создания новой шайбы после достижения последней позиции шайбы
function getNewPuck() {
    let indexes = [];
    let busyCount = 0;
    for (let i = 0; i < allPucks.length; i++) {
        if (allPucks[i].length != 0) busyCount++;
    }
    for (let i = 0; i < allPucks.length; i++) {
        if (allPucks[i].length == 0 || allPucks[i][allPucks[i].length-1].currentState % 5 >= 2) {
            // в игре 1 одновременно шайбы могут идти с 3 направлений
            if (state == 4 && allPucks[i].length != 0 && busyCount == 3 || busyCount < 3 || state == 5) { 
                indexes.push(i);
            }
        }
    }
    if (indexes.length > 0) {
        let ind = Math.floor(Math.random() * indexes.length);
        let val;
        switch(indexes[ind]) {
            case 0:
                val = Object.create(puckLD);
                break;
            case 1:
                val = Object.create(puckLU);
                break;
            case 2:
                val = Object.create(puckRU);
                break;
            case 3:
                val = Object.create(puckRD);
                break;
        }
        val.init();
        allPucks[indexes[ind]].push(val);
    }
}


function getClosestPuckState() {
    let min = 4;
    for (let puckAr of allPucks) {
        for (let puck of puckAr) {
            if (puck.currentState < min) min = puck.currentState;
        }
    }
    return min;
}


var isResetScore = true;
var isCatched = false;
var isAddedPuck = false;
var addPuck = 0;
var puckSpeed = 0;
var puck_count = 1;

setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (state == 4 || state == 5) {
        // в режиме игры

        // отрисовка шайб, вратаря и интерфейса
        for (let pucks of allPucks) {
            for (let puck of pucks) {
                puck.draw();
            }
        }
        if (ui_components.referee_enable_flag) {
            ui_components.draw_referee();
        }
        ui_components.draw_digits(String(goalkeeper.scores));
        goalkeeper.draw();
        if (state == 4) {
            ui_components.draw_game1();
        } else {
            ui_components.draw_game2();
        }
        if (goalkeeper.penalty_scores > 0) {
            ui_components.draw_penalty_scores();
            ui_components.draw_count_image();
        }
        if (goalkeeper.penalty_scores < 6) {

            if (allPucks[currentPuckInd % allPucks.length].length > 0 && allPucks[currentPuckInd % allPucks.length][0].isLastState()) {
                let puck_id = currentPuckInd % allPucks.length;
                if (puck_id == goalkeeper.state && !isCatched) {
                    goalkeeper.scores++;
                    isCatched = true;
                    addScoreAudio.play();
                }
            } 
            // проверка достижения шайбы последней позиции и проверка поимки шайбы
            if (time_value % puckSpeed == 0) {
                if (isCatched) {
                    allPucks[currentPuckInd % allPucks.length].splice(0, 1);
                    addPuck++;
                    isCatched = false;
                }
                if (allPucks[currentPuckInd % allPucks.length].length > 0 
                    && allPucks[currentPuckInd % allPucks.length][0].isLastState()) {
                    goalkeeper.penalty_scores = ui_components.referee_enable_flag ? goalkeeper.penalty_scores + 1
                    : goalkeeper.penalty_scores + 2;
                    penaltyScoreAudio.play();
                    for (let i = 0; i < allPucks.length; i++) {
                        if (allPucks[i].length != 0) {
                            addPuck += allPucks[i].length;
                            allPucks[i].splice(0, allPucks[i].length);
                        }
                    }
                }
                // мне была не совсем понятна суть появления новых шайб в оригинале, поэтому как есть
                if (goalkeeper.scores == 5 || goalkeeper.scores == 30
                     || goalkeeper.scores == 50 || goalkeeper.scores == 100) {
                    if (!isAddedPuck) {
                        addPuck++;
                        isAddedPuck = true;
                        puck_count++;
                    }
                } else {
                    isAddedPuck = false;
                }

                let closestPuckState = getClosestPuckState();
                if ((closestPuckState >= 1 && puck_count <= 3 || closestPuckState >= 0 
                    && puck_count > 3) && addPuck > 0) {
                    addPuck--;
                    getNewPuck();
                }
                getCurrentPucksInd();
                // звуки и движение шайб
                let ind = currentPuckInd % allPucks.length;
                switch(ind) {
                    case 0:
                        ldpAudio.play();
                        break;
                    case 1:
                        lupAudio.play();
                        break;
                    case 2:
                        rdpAudio.play();
                        break;
                    case 3:
                        rupAudio.play();
                        break;
                }
                for (let puck of allPucks[ind]) {
                    puck.move();
                }
            }
            

            // обработка появления судьи
            if (time_value % (12000 / delay) == 0 && time_value != 0) {
                ui_components.referee_enable_flag = ui_components.referee_enable_flag ? false : true;
            }

            // обработка достижения 200 и 500 очков
            if ((goalkeeper.scores == 200 || goalkeeper.scores == 500) && isResetScore) {
                goalkeeper.penalty_scores = 0;
                isResetScore = false;
            } else if (goalkeeper.scores != 200 && goalkeeper.scores != 500 && !isResetScore) {
                isResetScore = true;
            }
        }
    } else {
        // неигровой режим

        // получение времени будильника или часов 
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

        // отрисовка времени, судьи и часов
        ui_components.draw_digits(time);
        ui_components.draw_points();
        if ((state == 1 || state == 3) && alarmButton.isPm || (state == 0 || state == 2) && resetButton.isPm) {
            ui_components.draw_clock();
        }
        if (state == 1 || state == 3 || isPlayAlarm) {
            ui_components.draw_alarm_referee();
        }
        if (state == 1 || state == 2 || state == 3) {
            goalkeeper.draw();
        }
    }

    // отрисовка нажатых кнопок
    for (let button of buttons) {
        if (button.isShow) {
            button.draw();
        }
    }


    // звук будильника
    if (time_value % (1000 / delay) == 0) {
        if (isPlayAlarm) {
            alarmAudio.play();
        }
    }

    // счётчик времени 
    if (state != 0) {
        if (time_value != 0 && time_value % (1000 * 60 / delay) == 0) {
            if (resetButton.minutes == 59) {
                resetButton.addHour();
            }
            resetButton.addMinute();
            isPlayAlarm = false;
            // обработка включения будильника
            if (state == 2) {
                if (alarmButton.minutes == resetButton.minutes && 
                    alarmButton.hours == resetButton.hours &&
                    alarmButton.isPm == resetButton.isPm) {
                    isPlayAlarm = true;
                }
            }
        }
        time_value++;
        if (time_value == 1000001) time_value = 1;
    }      
}, delay);