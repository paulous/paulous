var INPUT = true;
var Sqr = function( game, x, y, t )
{
    Phaser.Sprite.call( this, game, x, y, 'sqr' );
    this.t = t;

    // enable sqr input events
    this.inputEnabled = true;
    this.events.onInputDown.add( this.active, this );

    this.game.add.existing( this );
};

Sqr.prototype = Object.create( Phaser.Sprite.prototype );
Sqr.prototype.constructor = Sqr;

Sqr.prototype.active = function ( t )
{   // change how long sqrs are visable 
    var timer = t.t.active * 150; 
    
    //right sqr
    for ( var i = 0; i < t.t.right.length; i++ )
    { 
        if ( t.t.right[ i ] === t && INPUT )
        {
            t.t.right.splice( i, 1 );
            if ( t.t.right.length === 0 )
            {
                INPUT = false;
                t.animations.frame = 1;
                t.t.score++;
                t.t.level.cnt++;
                this.game.time.events.add( 250, function () { t.t.newSet( timer ); }, this );
            }
            else { t.animations.frame = 1; }

        }
    }

    // wrong sqr
    for ( var i = 0; i < t.t.wrong.length; i++ )
    { 
        if ( t.t.wrong[ i ] === t && INPUT )
        {
            t.animations.frame = 2; 

            // reveal remaining sqrs
            for ( var i = 0; i < t.t.right.length; i++ )
            { 
                INPUT = false;
                t.t.right[i].animations.frame = 1;
                var wrong = this.game.add.tween( t.t.right[i] ).to( { alpha: 0.3 }, 250, Phaser.Easing.Sinusoidal.In )
                .to( { alpha: 1 }, 250, Phaser.Easing.Sinusoidal.Out )
                .to( { alpha: 0.3 }, 250, Phaser.Easing.Sinusoidal.In )
                .to( { alpha: 1 }, 250, Phaser.Easing.Sinusoidal.Out );
                wrong.start();
            }

            // call for new set
            this.game.time.events.add( 2000, function () { t.t.lives--; t.t.newSet( timer ); }, this );
        }
    }
};