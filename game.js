Game = function(snake, view) {
    this.snake = snake;
    this.view = view;
    this.score = 0;
    this.eaten = 0;
    this.currentApples = [];
    this.currentApplesTable = {};
    this.updateSnake();
    this.numCurrentApples = 0;
    this.currentEatenApplesInThisRound = 0;
    this.paused = false;
}


Game.prototype.initialize = function(row, cellsPerRow) {
    this.view.renderBoard(row, cellsPerRow);
    this.view.renderSnake(this.snake);
    this.startGameLoop();
    this.generateUniqueRandomApples(this.score + 1);
}


Game.prototype.updateSnake = function() {
    var self = this;
    var opposites = {
        north: 'south',
        south: 'north',
        west: 'east',
        east: 'west'
    }

    var directionMap = {
        39: 'east',
        37: 'west',
        40: 'south',
        38: 'north'
    }

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
            if (coord[0] === currentApple[0] && coord[1] === currentApple[1]) {
                collision = true;
                self.currentApples.splice(i, 1)
            }
        }
    })

    if (collison || this.currentApples.length != this.numCurrentApples) {
        var newApple = this.generateRandomApple();
        this.currentApples.push(newApple);
        this.checkIfApplesCollideWithSnake();
    } else if (this.currentApples.length === this.numCurrentApples) {
        collison = false;
    }

    if (!collison) {
        for (var i = 0; i < this.currentApples.length; i++) {
            $('#current').text(this.currentApples[i]);
            this.currentApplesTable[this.currentApples[i].join('')] = true;
        }

        this.view.colorInApple(this.currentApples);
    }
}

Game.prototype.startGameLoop = function() {
    this.paused = false;
    var self = this;
    globalId = window.setInterval(function() {
        $('#length').text(self.snake.body.length)
        $('#current').text(self.currentApples.length)
        self.snake.move(self.snake.dir);
        self.view.colorSnake(self.snake);
        if (self.checkEatenApple()) {
            self.score += 1;
            $('#level').text(self.score);
            $('#current').text(self.currentApples.length);
            $('#length').text(self.snake.body.length)
            self.snake.leveledUp = true;
            self.generateUniqueRandomApples(self.score+1);
        }
        self.checkCollisions();
    }, 100)
}


Game.prototype.checkEatenApple = function() {
    var head = this.snake.head,
        currentApple = this.snake.body[0];
    if (this.currentApplesTable[this.snake.head]) {
        this.view.removeApple(currentApple);
        this.currentApplesTable[currentApple.join('')] = false;
        // removeItemInArray(this.currentApples, currentEatenApple);
        this.eaten += 1;
        this.currentEatenApplesInThisRound += 1;
        console.log('eaten');
        $('#eaten').text(this.eaten);
    }


    // for (var i = 0; i < this.currentApples.length; i++) {
    //     var currentApple = this.currentApples[i];
    //     if (head[0] === currentApple[0] && head[1] === currentApple[1]) {
    //         console.log('eaten!!!!!!!!!')
    //         // this.currentApples.splice(i, 1) ***MUST SPLICE SOMWHERE or else gonna keep checking if eaten
    //         this.view.removeApple(currentApple);
    //         this.eaten += 1;
    //         $('#eaten').text(this.eaten);
    //     }
    // }
    // if (head[0] === this.currentApple[0] && head[1] === this.currentApple[1]) {
    //     return true;
    // }

    if (this.numCurrentApples === this.currentEatenApplesInThisRound) {
        this.currentApples = [];
        this.currentApplesTable = {};
        this.currentEatenApplesInThisRound = 0;
        return true;
    }

    return false;
}

Game.prototype.eatApple = function() {
    var head = this.snake.body[0].join(''),
        currentApple = this.snake.body[0];
        console.log('checking')
        // $('#check').text('checking...')
        // $('#head').text(this.snake.head)
        // $('#table').text(JSON.stringify(this.currentApplesTable))
        // $('#exist').text(this.currentApplesTable[head])

    if (this.currentApplesTable[this.snake.head]) {
        this.view.removeApple(currentApple);
        this.currentApplesTable[currentApple.join('')] = false;
        // removeItemInArray(this.currentApples, currentEatenApple);
        this.eaten += 1;
        this.currentEatenApplesInThisRound += 1;
        console.log('eaten');
        $('#eaten').text(this.eaten);
    }


    // for (var i = 0; i < this.currentApples.length; i++) {
    //     var currentApple = this.currentApples[i];
    //     if (head[0] === currentApple[0] && head[1] === currentApple[1]) {
    //         console.log('eaten!!!!!!!!!')
    //         // this.currentApples.splice(i, 1) ***MUST SPLICE SOMWHERE or else gonna keep checking if eaten
    //         this.view.removeApple(currentApple);
    //         this.eaten += 1;
    //         $('#eaten').text(this.eaten);
    //     }
    // }
    // if (head[0] === this.currentApple[0] && head[1] === this.currentApple[1]) {
    //     return true;
    // }

    if (this.numCurrentApples === this.currentEatenApplesInThisRound) {
        this.currentApples = [];
        this.currentApplesTable = {};
        this.currentEatenApplesInThisRound = 0;
        return true;
    }

    return false;
}


Game.prototype.checkCollisions = function() {
    var max = this.view.rows - 1;
    var head = this.snake.body[0];
    if (this.checkSelfCollision() || head[0] < 0 || head[0] > max|| head[1] < 0 || head[1] > max) {
        console.log('outofscope')
        $('#game-over').show();
        $('body').off();
        clearInterval(globalId);
        return true;
    }
}

Game.prototype.checkSelfCollision = function() {
    var head = this.snake.body[0],
        body = this.snake.body;
    for (var i =1; i<body.length; i++) {
        var bodyCoords = body[i];
        if (bodyCoords[0] == head[0] && bodyCoords[1] == head[1]) {
            console.log("COLLIED")
            return true;
        }
    }
}


Game.prototype.resetApples = function() {
    this.currentApples = [];
    this.eaten = 0;
    this.view.clearApples();
}

function removeDuplicates(array) {
    var seen = {};
    return array.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function removeItemInArray(array, item) {
    for (var i =0; i<array.length; i++) {
        if (array[i].join('') === item.join('')) {
            array.splice(i, 1);
        }
    }

    return array;
}