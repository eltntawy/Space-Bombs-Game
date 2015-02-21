/**
 * Created by eltntawy on 21/02/15.
 */
var score = 0;
var scoreText;
var player;
var stars;
var enemies;
var diamonds;
var aids;

var bullets;

var fireRate = 500;
var nextFire = 0;

var starsGenerator;
var enemiesGenerator;
var diamondGenerator;
var aidGenerator;

var fireSound;
var bumpSound;
var platforms;

var lives = new Array(3);
var liveCount = 3;

var gameStage = {
    preload: function () {

        console.log('game state preload');

        var backgroundIndex = Math.round(1 + Math.random() * 2);
        var backgroundURL = 'assets/spaceBackground' + backgroundIndex + '.png';
        console.log('backgroundURL : ' + backgroundURL);
        game.load.image('backgroundGame', backgroundURL);
        game.load.image('tryAgain', 'assets/try-again.png');
        game.load.image('platform', 'assets/platform.png');

        game.load.spritesheet('player', 'assets/dude.png', 32, 48);
        game.load.image('platform', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('diamond', 'assets/diamond.png');
        game.load.image('aid', 'assets/firstaid.png');

        game.load.spritesheet('enemy0', 'assets/baddie.png', 32, 32);
        game.load.image('enemy1', 'assets/Enemy.png');
        game.load.image('enemy2', 'assets/Enemy2.png');


        game.load.image('bullet', 'assets/bullet.png');

        game.load.audio('fireSound', 'assets/audio/266977_SOUNDDOGS__gu.mp3');
        game.load.audio('bumpSound', 'assets/audio/bump.mp3');
    },

    create: function () {

        // background and score and sound 
        /**************************************************************************************/
        this.game.stage.backgroundColor = 'white';
        var background = this.game.add.tileSprite(0, 0, 800, 600, 'backgroundGame');
        background.autoScroll(-25, 0);

        fireSound = game.add.audio('fireSound');
        bumpSound = game.add.audio('bumpSound');
        /**************************************************************************************/
        // platform
        /**************************************************************************************/
        platforms = game.add.group();
        platforms.enableBody = true;
        var platform = platforms.create(0, game.world.height - 50, 'platform');

        platform.body.immovable = true;

        /**************************************************************************************/
        // ground
        /**************************************************************************************/
        // add the ground sprite as a tile
        // and start scrolling in the negative x direction
        //this.ground = this.game.add.tileSprite(0, 0, 800, 600, 'ground');
        //this.ground.autoScroll(-50, 0);
        scoreText = game.add.text(10, 10, 'Game Score = 0', {fontsize: 60, fill: 'white'});

        for (var i = 0; i < liveCount; i++) {
            lives [i] = game.add.sprite(10 + i * 30, 30, 'player');
        }


        /**************************************************************************************/
        // Player
        /**************************************************************************************/
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 500;
        player.body.collideWorldBounds = true;
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6.7, 8], 10, true);
        /**************************************************************************************/
        //  Our bullet group
        /**************************************************************************************/
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet', 0, false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);


        /**************************************************************************************/
        // game collectors
        /**************************************************************************************/
        stars = game.add.group();
        stars.enableBody = true;

        enemies = game.add.group();
        enemies.enableBody = true;

        diamonds = game.add.group();
        diamonds.enableBody = true;

        aids = game.add.group();
        aids.enableBody = true;

        /**************************************************************************************/
        // generators
        /**************************************************************************************/
        var numberOfEnemy = 2;
        if (gameDifficulty == 1) {
            numberOfEnemy = 1
        }
        if (gameDifficulty == 2) {
            numberOfEnemy = 0.5;
        }
        if (gameDifficulty == 3) {
            numberOfEnemy = 0.25;
        }

        if (gameDifficulty == 4) {
            numberOfEnemy = 0.05;
        }

        starsGenerator = game.time.events.loop(Phaser.Timer.SECOND * 5, this.generatorStar, this);
        enemiesGenerator = game.time.events.loop(Phaser.Timer.SECOND * numberOfEnemy, this.generatorAnemy, this);
        diamondGenerator = game.time.events.loop(Phaser.Timer.SECOND * 30, this.generatorDiamond, this);
        aidGenerator = game.time.events.loop(Phaser.Timer.SECOND * 60, this.generatorAid, this);


        starsGenerator.timer.start();
        enemiesGenerator.timer.start();
        diamondGenerator.timer.start();
        aidGenerator.timer.start();
        /**************************************************************************************/


        console.log('game state created');

    },

    update: function () {
        //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms);

        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.collide(enemies, platforms);

        game.physics.arcade.overlap(player, enemies, this.collectAnemy, null, this);
        game.physics.arcade.overlap(player, stars, this.collectStar, null, this);
        game.physics.arcade.overlap(player, aids, this.collectAid, null, this);
        game.physics.arcade.overlap(player, diamonds, this.collectDiamond, null, this);
        game.physics.arcade.overlap(bullets, enemies, this.killAnemy, null, this);

        var cursors = game.input.keyboard.createCursorKeys();

        player.body.velocity.x = 0;
        if (cursors.left.isDown) {
            player.body.velocity.x = -150;
            
            if (player.body.touching.down)
                player.animations.play('left');

        } else if (cursors.right.isDown) {
            player.body.velocity.x = 150;
            
            if (player.body.touching.down)
                player.animations.play('right');

        } else {
            player.animations.stop();
            player.frame = 4;
        }

        if (cursors.up.isDown) {
            player.body.velocity.y = -150;
            player.frame = 6;

        } else if (cursors.down.isDown) {
            player.body.velocity.y = 150;
            player.frame = 6;

        }


        if (game.input.activePointer.isDown) {
            //  Boom!
            this.fire();
        }
    },
    collectStar: function (player, star) {

        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        score += 1;
        scoreText.text = 'Game Score = ' + score;

    }, collectAid: function (player, aid) {

        score += 10;
        aid.kill();

        lives [liveCount] = game.add.sprite(10 + liveCount * 30, 30, 'player');

        liveCount++;


    }, collectDiamond: function (player, diamond) {
        diamond.kill();

        //  Add and update the score
        score += 20;
        scoreText.text = 'Game Score = ' + score;

    },
    collectAnemy: function (player, enemy) {

        enemy.kill();
        console.log('liveCount : ' + liveCount);
        console.log('lives length : ' + lives.length);

        lives[liveCount - 1].kill();
        liveCount--;


        if (liveCount == 0) {
            player.kill();

            var textGameOver = game.add.text(game.world.centerX, game.world.centerY - 100, 'Game Over', {
                fontsize: 60,
                fill: 'white'
            });
            textGameOver.anchor.setTo(0.5, 0.5);

            var tryAgainButton = game.add.button(game.world.centerX - 100, game.world.centerY, 'tryAgain', function () {
                tryAgainButton.anchor.setTo(0.5, 0.5);

                liveCount = 3;
                score = 0;
                game.state.start('game');
            });

        }


    },
    killAnemy: function (bullet, enemy) {

        bumpSound.play();

        enemy.kill();
        bullet.kill();


        score += 10;
        scoreText.text = 'Game Score = ' + score;

    },
    generatorStar: function () {
        // stars
        /**************************************************************************************/
        var randomSpeed = 50 + Math.random() * 200;
        var randomY = 1 + Math.random() * 500;
        var star = stars.create(this.world.width, randomY, 'star');
        star.body.velocity.x = -1 * randomSpeed;
        //star.body.bounce.x = 0.7 + Math.random() * 0.2;

        /**************************************************************************************/
    },
    generatorAnemy: function () {
        // enemies
        /**************************************************************************************/
        var randomSpeed = 50 + Math.random() * 200;
        var randomY = 1 + Math.random() * 500;
        var enemy = enemies.create(this.world.width, randomY, 'enemy');
        enemy.animations.add('animate', [0, 1, 2, 3, 4], true);
        enemy.animations.play('animate');

        enemy.body.gravity.x = -1 * randomSpeed;
        //enemy.body.bounce.x = 0.7 + Math.random() * 0.2;
        /**************************************************************************************/
    },
    generatorDiamond: function () {
        score -= 10;
        scoreText.text = 'Game Score = ' + score;

    },
    generatorStar: function () {
        // stars
        /**************************************************************************************/
        var randomSpeed = 50 + Math.random() * 200;
        var randomY = 1 + Math.random() * 500;
        var star = stars.create(this.world.width, randomY, 'star');
        star.body.velocity.x = -1 * randomSpeed;
        //star.body.bounce.x = 0.7 + Math.random() * 0.2;

        /**************************************************************************************/
    },
    generatorAnemy: function () {
        // enemies
        /**************************************************************************************/
        var randomSpeed = 50 + Math.random() * 200;
        var randomY = 1 + Math.random() * 500;
        var enemy = 'enemy' + Math.round(Math.random() * 2);
        var enemy = enemies.create(this.world.width, randomY, enemy);
        enemy.body.gravity.x = -1 * randomSpeed;
        //enemy.body.bounce.x = 0.7 + Math.random() * 0.2;
        /**************************************************************************************/
    },
    generatorDiamond: function () {
        // diamond
        /**************************************************************************************/
        var randomSpeed = 50 + Math.random() * 200;
        var randomY = 1 + Math.random() * 500;
        var diamond = diamonds.create(this.world.width, randomY, 'diamond');
        diamond.body.velocity.x = -1 * randomSpeed;
        //diamond.body.bounce.x = 0.7 + Math.random() * 0.2;
        /**************************************************************************************/
    },
    generatorAid: function () {
        // aid
        /**************************************************************************************/
        var randomSpeed = 50 + Math.random() * 200;
        var randomY = 1 + Math.random() * 500;
        var aid = aids.create(this.world.width, randomY, 'aid');
        aid.body.velocity.x = -1 * randomSpeed;
        //aid.body.bounce.x = 0.7 + Math.random() * 0.2;
        /**************************************************************************************/

    },
    fire: function () {

        if (game.time.now > nextFire && bullets.countDead() >= 1 && liveCount > 0) {
            nextFire = game.time.now + fireRate - score / 3;

            var bullet = bullets.getFirstExists(false);
            bullet.reset(player.x, player.y);
            bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
            fireSound.play();
            console.log('bullet fired');
        }

    }
}