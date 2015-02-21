/**
 * Created by eltntawy on 20/02/15.
 */

function Preload() {
    this.asset = null;
    this.ready = false;

}

Preload.prototype.preload = function () {

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);

    this.load.image('background', '../assets/background.png');
    this.load.image('ground', '../assets/ground.png');
    this.load.image('title', '../assets/title.png');
    this.load.image('startButton', '../assets/start-button.png');

    this.load.image('bird', '../assets/robot-head.png');
}

Preload.prototype.create = function () {
    this.asset.cropEnabled = false;

}

Preload.prototype.update = function () {

    if (!!this.ready) {
        this.game.state.start('menu');
    }

    Preload.prototype.onComplete = function () {

        this.ready = true;

    }
}

module.exports = Preload
