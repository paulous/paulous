Remember.menu = function () { game };
Remember.menu.prototype = 
{
    create: function () 
    { 
        this.game.stage.backgroundColor = 0xEDEDED;

        var txtRememberMe = new createText( this.game.world.centerX, 
                                           200, 
                                           'Remember Me!', 
                                           48, 
                                           '#0099CC', 
                                           true);

        var txtPlay = new createText( this.game.world.centerX, 
                                     this.game.world.centerY, 
                                     'Play', 
                                     36, 
                                     '#0099CC', 
                                     true, 
                                     true, 
                                     '#ffffff', 
                                     this.startGame, 
                                     this );
    },

    startGame:  function () 
    {
        this.game.state.start( 'game' );
    }
};