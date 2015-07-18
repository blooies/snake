Snake = function(body, dir) {
    this.body = body;
    this.dir = dir;
    this.head = '';
    this.leveledUp = false;
}


Snake.prototype.move = function(dir) {
	this.dir = dir;
	var head = this.body[0];

	switch (dir) {
		case 'north': //row -1, column same
			this.body.unshift([head[0]-1, head[1]]);
			break;
		case 'south': //row +1, column same
			this.body.unshift([head[0]+1, head[1]]);
			break;
		case 'west': //row same, column -1
			this.body.unshift([head[0], head[1]-1]);
			break;
		case 'east': //row same, column + 1
			this.body.unshift([head[0], head[1]+1]);
			break;
	}

	var head = this.body[0];
	this.head = this.body[0].join('');

	if (!this.leveledUp) {
		this.body.pop();
	} else {
		this.leveledUp = false;
	}
}

