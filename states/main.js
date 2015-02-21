/**
 * Created by eltntawy on 19/02/15.
 */


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');



game.state.add('menu',menuStage);
game.state.add('game',gameStage);

game.state.start('menu');
//game.state.start('game');