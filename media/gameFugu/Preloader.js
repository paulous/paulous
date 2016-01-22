
Fugushima.Preloader = function (game) 
{
	//this.ready = false;
};

Fugushima.Preloader.prototype = 
{
	preload: function () 
	{
		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar

		var barbg = this.add.sprite(this.game.width/2, this.game.height/2, 'barbg');
		barbg.anchor.setTo(.5, .5);
		barbg.alpha = 0.3;

		this.bar = this.add.sprite(this.game.width/2, this.game.height/2, 'bar');
		this.bar.anchor.setTo(.5, .5);

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.bar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		//this.load.image('titlepage', 'images/title.jpg');

		//this.load.image('glow', 'images/glow.png');
		//this.load.image('nuk', 'images/nuk.png');
		this.load.image('headtxt', 'gameimg/headtxt.png');
		this.game.load.spritesheet('easy', 'gameimg/btnEasy.png', 72, 31);
		this.game.load.spritesheet('norm', 'gameimg/btnNorm.png', 135, 31);
		this.game.load.spritesheet('hard', 'gameimg/btnHard.png', 90, 31);
		this.load.image('infotxt', 'gameimg/infotxt.png');


		//this.load.spritesheet('playButton', 'images/mutant1.png', 121, 121);

		//this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		//this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		//	+ lots of other required assets here
		this.game.load.atlas('spritesheet', 'gameimg/spritesheet.png', 'gameimg/spritesheet.json');
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.bar.cropEnabled = false;
		this.game.state.start('MainMenu');

	}

};
