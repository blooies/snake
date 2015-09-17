Game = function(snake, view) {
    this.snake = snake;
    this.view = view;
    this.level = 1;
    this.eaten = 0;
    this.currentApples = [];
    this.currentApplesTable = {};
    this.updateSnake();
    this.numCurrentApples = 0;
    this.currentEatenApplesInThisRound = 0;
    this.paused = false;
}

Game.prototype.initialize = function(row, cellsPerRow) {
    $('#level').text(this.level);
    this.view.renderBoard(row, cellsPerRow);
    this.view.renderSnake(this.snake);
    this.startGameLoop();
    this.generateUniqueRandomApples(this.level);
}

Game.prototype.updateSnake = function() {
    var self = this,
        opposites = {
            north: 'south',
            south: 'north',
            west: 'east',
            east: 'west'
        },
        directionMap = {
            39: 'east',
            37: 'west',
            40: 'south',
            38: 'north'
        };

    $('body').on('keydown', function(event) {
        if (opposites[self.snake.dir] !== directionMap[event.keyCode]) {
            switch (event.keyCode) {
                case 39: //right arrow
                    self.snake.dir = 'east';
                    break;
                case 37: //left arrow
                    self.snake.dir = 'west';
                    break;
                case 40: // down arrow
                    self.snake.dir = 'south';
                    break;
                case 38: //up arrow
                    self.snake.dir = 'north';
                    break;
                case 32:
                    if (self.paused) {
                        self.startGameLoop();
                    } else {
                        self.pauseGameLoop();
                    }
                    break;
            }
        }
    })
}

Game.prototype.pauseGameLoop = function() {
    this.paused = true;
    clearInterval(globalId);
}

Game.prototype.generateUniqueRandomApples = function(apples) {
    this.numCurrentApples = apples;

    for (var i = 0; i < apples; i++) {
        var apple = this.generateRandomApple();
        this.currentApples.push(apple);
    }

    this.currentApples = removeDuplicates(this.currentApples);

    while (this.currentApples.length != apples) {
        var apple = this.generateRandomApple();
        this.currentApples.push(apple);
        this.currentApples = removeDuplicates(this.currentApples);
    }

    this.checkIfApplesCollideWithSnake();
}

Game.prototype.generateRandomApple = function() {
    return [Math.floor(Math.random() * this.view.rows), Math.floor(Math.random() * this.view.cellsPerRow)];
}

Game.prototype.checkIfApplesCollideWithSnake = function() {
    var collison,
        self = this;

    this.snake.body.forEach(function(coord) {
        for (var i = 0; i < self.currentApples.length; i++) {
            var currentApple = self.currentApples[i];
            if (coord[0] === currentApple[0] 
                && coord[1] === currentApple[1]) {
                    collision = true;
                    self.currentApples.splice(i, 1);
            }
        }
    })

    if (collison || this.currentApples.length !== this.numCurrentApples) {
        var newApple = this.generateRandomApple();
        this.currentApples.push(newApple);
        this.checkIfApplesCollideWithSnake();
    } else if (this.currentApples.length === this.numCurrentApples) {
        collison = false;
    }

    if (!collison) {
        for (var i = 0; i < this.currentApples.length; i++) {
            this.currentApplesTable[this.currentApples[i].join('')] = true;
        }
        this.view.colorInApple(this.currentApples);
    }
}

Game.prototype.startGameLoop = function() {
    this.paused = false;
    var self = this;
    globalId = window.setInterval(function() {
        self.snake.move(self.snake.dir);
        self.view.colorSnake(self.snake);
        if (self.checkEatenAllApples()) {
            self.level += 1;
            $('#level').text(self.level);
            self.snake.leveledUp = true;
            self.generateUniqueRandomApples(self.level);
        }
        self.checkCollisions();
    }, 100)
}

Game.prototype.checkEatenAllApples = function() {
    var head = this.snake.head,
        currentApple = this.snake.body[0];

    //check if apple is eaten
    if (this.currentApplesTable[head]) {
        this.view.removeApple(currentApple);
        this.currentApplesTable[currentApple.join('')] = false;
        this.eaten += 1;
        this.currentEatenApplesInThisRound += 1;
        $('#eaten').text(this.eaten);
    }

    //level is beaten
    if (this.numCurrentApples === this.currentEatenApplesInThisRound) {
        this.currentApples = [];
        this.currentApplesTable = {};
        this.currentEatenApplesInThisRound = 0;
        return true;
    }

    return false;
}

Game.prototype.checkCollisions = function() {
    var max = this.view.rows - 1,
        head = this.snake.body[0];

    //self collision or collide with borders
    if (this.checkSelfCollision() || 
        head[0] < 0 || 
        head[0] > max || 
        head[1] < 0 || 
        head[1] > max) {
            $('#game-over').show();
            $('body').off();
            clearInterval(globalId);
            return true;
    }
}

Game.prototype.checkSelfCollision = function() {
    var body = this.snake.body,
        head = body[0];

    for (var i = 1; i < body.length; i++) {
        var bodyCoords = body[i];
        if (bodyCoords[0] == head[0] && bodyCoords[1] == head[1]) {
            return true;
        }
    }
}

function removeDuplicates(array) {
    var seen = {};
    return array.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}