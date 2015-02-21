/**
 * Created by eltntawy on 20/02/15.
 */

var music;
var gameDifficulty = 0;
var menuStage = {


    preload: function () {

        game.load.image('startButton', 'assets/startButton.png');
        game.load.image('gameLogo', 'assets/game-logo.png');
        game.load.image('ground', 'assets/ground.png');
        game.load.image('background', 'assets/spaceBackground1.png');

        game.load.image('easy', 'assets/button-easy.png');
        game.load.image('medium', 'assets/button-medium.png');
        game.load.image('hard', 'assets/button-hard.png');
        game.load.image('ultraHard', 'assets/button-ultraHard.png');


        game.load.audio('music', 'assets/audio/naruto_background.mp3');
    }
    ,

    create: function () {

        music = game.add.audio('music');

        music.play('', 0, 1, true);

        var background = this.game.add.tileSprite(0, 0, 800, 600, 'background');
        background.autoScroll(-25, 0);

        var style = {font: '65px Arial', fill: '#1106FF', align: 'center'};
        this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'gameLogo');
        this.sprite.anchor.setTo(0.5, 0.5);

        this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Space Bombs Game!', style);
        this.titleText.anchor.setTo(0.5, 0.5);

        this.instructionsText = game.add.button(this.game.world.centerX, 400, 'startButton', this.startClick);
        this.instructionsText.anchor.setTo(0.5, 0.5);


        this.instructionsText = game.add.button(this.game.world.centerX - 200, 490, 'easy', function () {
            gameDifficulty = 1;
        });
        this.instructionsText.anchor.setTo(0.5, 0.5);

        this.instructionsText = game.add.button(this.game.world.centerX - 75, 490, 'medium', function () {
            gameDifficulty = 2;
        });
        this.instructionsText.anchor.setTo(0.5, 0.5);

        this.instructionsText = game.add.button(this.game.world.centerX + 75, 490, 'hard', function () {
            gameDifficulty = 3;
        });
        this.instructionsText.anchor.setTo(0.5, 0.5);

        this.instructionsText = game.add.button(this.game.world.centerX + 200, 490, 'ultraHard', function () {
            gameDifficulty = 4;
        });
        this.instructionsText.anchor.setTo(0.5, 0.5);

        this.sprite.angle = -20;
        this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);


        // add the ground sprite as a tile
        // and start scrolling in the negative x direction
        this.ground = this.game.add.tileSprite(0, 0, 800, 600, 'ground');
        this.ground.autoScroll(-50, 0);
    }
    ,

    update: function () {

    }
    ,
    startClick: function () {

        this.game.state.start('game');
        console.log('game state being starting');

    }
}