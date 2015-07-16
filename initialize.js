$(document).ready(function() {
        snake = new Snake([[19,12],[19,13],[19,14],[19,15],[19,16],[19,17]], 'west'),
        view = new GameView(),
        game = new Game(snake, view);
    
    game.initialize(20,20);
})
