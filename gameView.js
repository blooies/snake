GameView = function() {
	this.rows = null;
	this.cellsPerRow = null;
}

GameView.prototype.renderBoard = function(rows, cellsPerRow) {
	this.rows = rows;
	this.cellsPerRow = cellsPerRow;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cellsPerRow; j++) {
            $('#game-container').append(makeDivId(i, j));
        }
    }
}

GameView.prototype.renderSnake = function(snake) {
    snake.body.forEach(function(coord) {
        $('.row' + coord[0] + '.column' + coord[1]).toggleClass('snake-color');
    })

}

GameView.prototype.colorSnake = function(snake) {
	$('div').filter('.snake-color').toggleClass('snake-color');
	snake.body.forEach(function(coord) {
        $('.row' + coord[0] + '.column' + coord[1]).toggleClass('snake-color');
    })
}

GameView.prototype.colorInApple = function(apples) {
	apples.forEach(function(apple) {
		$('.row' + apple[0] + '.column' + apple[1]).addClass('apple');
	})
}

GameView.prototype.clearApples = function() {
	$('.apple').removeClass('apple');
}

GameView.prototype.removeApple = function(apple) {
	$('.row' + apple[0] + '.column' + apple[1]).removeClass('apple');
}

function makeDivId(i, j) {
    var div = "<div class='row"
        div += i;
        div += " ";
        div += 'column';
        div += j;
        div += " ";
        div += "cell'></div>";
    
    return div;
}