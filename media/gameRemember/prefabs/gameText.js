WebFontConfig = 
{
    active: function () 
    {
        game.time.events.add(Phaser.Timer.SECOND, createText, this);
    },
    google: { families: ['Arimo:700'] }
};

var createText = function ( x, y, txt, size, color, center, input, overcol, func, t ) 
{
    this.text = game.add.text( x, y, txt );
    if ( center ) this.text.anchor.set( 0.5, 0.5 );
    this.text.font = 'Arimo';
    this.text.fontSize = size;
    this.text.fill = color;

    if ( input )
    {
        this.text.inputEnabled = true;
        this.text.events.onInputOver.add( function () { this.text.fill = overcol; }, this );
        this.text.events.onInputOut.add( function () { this.text.fill = color; }, this );
        this.text.events.onInputDown.add( func, t );
    }
};


    