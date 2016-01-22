'use strict';

var ENDSCORE;
Remember.end = function () { game };
Remember.end.prototype = 
{
    create: function ()
    {
        this.txtScore = new createText( this.game.world.centerX, 
                                       140,                       
                                       'Your Score:', 
                                       36, 
                                       '#999999', 
                                       true );

        this.txtScorenum = new createText( this.game.world.centerX, 
                                          270,                       
                                          '' + ENDSCORE, 
                                          172, 
                                          '#0099CC', 
                                          true );

        this.txtReplay = new createText( this.game.world.centerX, 
                                        410, 
                                        'Replay', 
                                        36, 
                                        '#0099CC', 
                                        true, 
                                        true, 
                                        '#ffffff',
                                        this.reStartGame,
                                        this );

        this.txtShare = new createText( 140, 
                                       500, 
                                       'Share', 
                                       36, 
                                       '#0099CC', 
                                       true, 
                                       true, 
                                       '#ffffff',
                                       this.share,
                                       this );

        this.txtTweet = new createText( 320, 
                                       500, 
                                       'Tweet', 
                                       36, 
                                       '#0099CC', 
                                       true, 
                                       true, 
                                       '#ffffff',
                                       this.tweet,
                                       this );
    },
    
    share: function ()
    {
        window.open( 'https://www.facebook.com' );
    },
    
    tweet: function ()
    {
        window.open( 'http://www.twitter.com' );
    },
    
    // restart game
    reStartGame:  function () 
    {
        this.game.state.start( 'game' );
    }
};