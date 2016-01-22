'use strict';


Remember.preload = function () { game };
Remember.preload.prototype = 
{
    preload: function () 
    { 
        this.ready = null;
        this.game.load.script( 'webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js' );

        this.game.load.image( 'screen','images/sqrBg.jpg' );
        this.game.load.spritesheet('sqr', 'images/sqr.png', 82, 82);

        this.loadImg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloader');
        this.loadImg.anchor.setTo(0.5, 0.5);

        this.load.onLoadComplete.addOnce( this.onLoadComplete, this );
        this.load.setPreloadSprite( this.loadImg );
    },

    create: function () 
    { 
        this.game.stage.backgroundColor = 0xEDEDED;
        this.loadImg.cropEnabled = false;
    },
    
    update: function () 
    {
        if ( !!this.ready ) 
        {
            this.game.state.start('menu');
        }
    },
    
    onLoadComplete: function () 
    {
        this.ready = true;
    }
};