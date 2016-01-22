
Fugushima.MainMenu = function (game) {};

Fugushima.MainMenu.prototype = 
{
	create: function () 
	{
        this.bg = this.game.add.sprite(0, 0, 'spritesheet');
        this.bg.animations.frameName = 'bgsf0000';
        this.bg.width = 1024;
        this.bg.height = 1600;
        this.bg.alpha = 0.5;

		this.headtxt = this.add.sprite(this.game.width/2, 300, 'headtxt');
		this.headtxt.scale.setTo(1.5, 1.5);
		this.headtxt.anchor.setTo(.5, .5);
		this.headtxt.on = true;

		this.btnEasy = this.game.add.button(this.game.width/2 -150, 550, 'easy', function(){this.startGame(0)}, this, 1, 0);
		this.btnNorm = this.game.add.button(this.game.width/2, 547, 'norm', function(){this.startGame(1)}, this, 1, 0);
		this.btnHard = this.game.add.button(this.game.width/2 +160, 550, 'hard', function(){this.startGame(2)}, this, 1, 0);
		this.btnEasy.anchor.setTo(.5, 1);
		this.btnNorm.anchor.setTo(.5, 1);
		this.btnHard.anchor.setTo(.5, 1);

		this.infotxt = this.add.sprite(this.game.width/2, 680, 'infotxt');
		this.infotxt.anchor.setTo(.5, .5);
		this.infotxt.alpha = 0.5;

		this.bigfugu = this.game.add.sprite(-150, Math.floor(Math.random()*300), 'spritesheet');
        this.bigfugu.animations.add('swim', Phaser.Animation.generateFrameNames('fugu', 0, 1, '', 4), 5, true);
        this.bigfugu.animations.play('swim');
        this.bigfugu.anchor.setTo(0.5, 0.5);
        this.bigfugu.angle = 20;

        this.game.add.tween(this.bigfugu).to({x: this.game.width/2, y: this.game.height/2, angle: 0}, 2000, Phaser.Easing.Exponential.Out, true, 2000)
        .to({x: 1300, y:200, angle: -20}, 1000, Phaser.Easing.Exponential.In, true);

		this.fGrp = this.game.add.group();
		for(var i = 0; i < 9; i++)
		{
			var fugu = this.fGrp.create(-100, Math.floor((Math.random()*300)+200), 'spritesheet');
	        fugu.animations.add('swim', Phaser.Animation.generateFrameNames('fugusmall', 0, 2, '', 4), Math.floor((Math.random()*5)+3), true);
	        fugu.scale.x = -1;
	        fugu.animations.play('swim');
	        fugu.anchor.setTo(0.5, 0.5);
	        fugu.angle = 10;

	        this.game.add.tween(fugu).to({x: 1200, y: 400, angle: 0}, Math.floor((Math.random()*3000)+5000), Phaser.Easing.Linear.None, true, Math.floor((Math.random()*3000)+3000));
		};

		this.fish = this.game.add.sprite(-100, 350, 'spritesheet');
        this.fish.animations.add('swim', Phaser.Animation.generateFrameNames('fish', 1, 3, '', 4), 8, true);
        this.fish.animations.play('swim');
        this.fish.scale.x = -1;
        this.game.add.tween(this.fish).to({x: 1200, y: 350}, 9000, Phaser.Easing.Linear.None, true, 4500);
	},

	update: function () 
	{
		this.headtxt.on ? (this.headtxt.on = false, this.game.time.events.add(Math.floor((Math.random()*250)+50), function()
		{
			this.headtxt.on = true; 
			this.headtxt.alpha = (Math.random()*0.5)+0.5;
		}, this)) : null;

	},

	startGame: function (lev, pointer) 
	{
		_level = lev;
		this.game.state.start('Game');
	}
};
