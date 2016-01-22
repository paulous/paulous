'use strict';

var Remember = {};
Remember.boot = function () { game };
Remember.boot.prototype = 
{
    preload: function () 
    {
        this.load.image('preloader', 'images/preloader.gif');
    },
    
    create: function () 
    {
        this.game.stage.backgroundColor = 0xEDEDED;
        this.game.input.maxPointers = 1;
        this.game.state.start('preload');
    }
};