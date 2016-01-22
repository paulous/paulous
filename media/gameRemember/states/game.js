'use strict';

Remember.game = function () { game };
Remember.game.prototype = 
    {
    create: function () 
    {
        this.game.stage.disableVisibilityChange = true;
        this.game.stage.backgroundColor = 0xEDEDED;

        // game variables
        this.sqr = [];
        this.shuffle = [];
        this.right = [];
        this.wrong = [];
        this.active = 0;
        this.repeat = 0;
        this.score = 0;
        this.lives = 5;

        this.sqrGrp = this.game.add.group();
        this.screenGrp = this.game.add.group();

        this.level = { cnt: 0, // question tracker
                      max: 3, // number of questions
                      text: 'Level Two', // screen text
                      num: 2, // level number to reset
                      end: null // end game
                     };

        // screen overlay for levels and end game
        var screen = this.game.add.sprite(0, 0, 'screen');                                  
        screen.width = this.game.world.width;
        screen.height = this.game.world.height;

        // level and game over text
        this.txtLevel = new createText( this.game.world.centerX, 
                                       this.game.world.centerY, 
                                       'Level One', 
                                       36, 
                                       '#ffffff', 
                                       true );

        this.screenGrp.add( screen );
        this.screenGrp.add( this.txtLevel.text );

        this.screenGrp.twn = this.game.add.tween( this.screenGrp ).to( { alpha: 0.8 }, 500, Phaser.Easing.Linear.None );
        this.screenGrp.detwn = this.game.add.tween( this.screenGrp ).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None );
        this.screenGrp.alpha = 0;

        // text set up for repeat, score 
        this.txtRepeat = new createText( 0, // x
                                        -100, // y
                                        'Remember the pattern,\nthen repeat it by tapping on the tiles.', // text
                                        18, // size
                                        '#0099CC', // color
                                        true, // centred
                                        true, // input active
                                        '#999999', // over color
                                        this.repeatSet, // on down callback
                                        this ); // context

        // score text                               
        var txtScore = new createText( 337, 20, 'Score:', 24, '#999999', false );
        this.txtScoreNum = new createText( 420, 22, '0', 24, '#0099CC', false );

        // lives text 
        var txtLife = new createText( 25, 20, 'Lives:', 24, '#999999', false );
        this.txtLifeNum = new createText( 100, 22, '5', 24, '#0099CC', false );

        // level screen one tween open
        this.screenGrp.twn.start();

        // level screen one tween closed
        this.game.time.events.add( 1500, function () { 
            this.screenGrp.detwn.start();

            ////////// START GAME - LEVEL 1 /////////
            this.levelSet ( 3, 3, 4 );
        }, this);  
    },


    // destroy last level items fire levelSet
    levelReset: function ( level ) 
    {   // destroy sqrs if any exist
        for( var i = 0; i < this.sqr.length; i++ ) 
        { 
            this.game.add.tween( this.sqr[i] ).to( { alpha: 0 }, 
                                                  250, Phaser.Easing.Linear.None, true, i * 75 );
        }

        // clear shuffle and sqr array
        this.shuffle = [];
        this.sqr = [];
        
        //////////////////////// CREATE A NEW LEVEL HERE /////////////////////
        // set new level for 2, 3 or four
        this.game.time.events.add( 1000, function () 
                                  {    // destroy current set
                                      for ( var i = 0; i < this.sqr.length; i++ ) this.sqr[i].destroy();

                                      // here we have levels 2, 3, 4. 
                                      // if you wanted a level five, ( level === 4 ) would become 5
                                      // the example below shows this
                                      if ( level === 2 ) 
                                      {
                                          this.level.max = 6; // screen counter, 3 for level 1, 6 for level 2 etc.
                                          this.level.text = 'Level Three'; // text for next level three
                                          this.level.num = 3; // set number of next level

                                          this.levelSet ( 3, 4, 5 );  // ( 3 cols, 4 rows, 5 active sqrs )
                                      }
                                      else if ( level === 3 ) 
                                      {
                                          this.level.max = 9;
                                          this.level.text = 'Level Four';
                                          this.level.num = 4;

                                          this.levelSet ( 4, 4, 6 );   
                                      }
                                      else if ( level === 4 ) 
                                      {
                                          this.level.max = null;
                                          this.levelSet ( 5, 5, 7 ); 
                                      }

                                      this.level.end = 12; // total screens in game. Total screens in 4 levels, 3, 6, 9, 12.
                                      
                                      ///////// EXAMPLE ///////////////
                                      /* else if ( level === 4 ) 
                                      {
                                          this.level.max = 12;
                                          this.level.text = 'Level Five';
                                          this.level.num = 5;

                                          this.levelSet ( 5, 5, 7 );   
                                      }
                                      else if ( level === 5 ) 
                                      {
                                          this.level.max = null;
                                          this.levelSet ( 6, 5, 8 ); 
                                      }
                                      
                                      this.level.end = 15; */
                                      /////////////////////////////////
                                      
                                  }, this);
        
        ////////////////////////////////////////////////////////////////////////
    },

    // set level sqrs
    levelSet: function ( col, row, actv ) 
    {   // set size of sqr plus space
        var sqrsize = 82;
        this.active = actv;

        // arrange sqrs
        var sqr;
        for ( var r = 0; r < row; r++ )
        { 
            for ( var c = 0; c < col; c++ )
            {
                if ( r === 0 ) sqr = new Sqr( game, c * sqrsize, r * sqrsize, this );
                else if ( r === 1 ) sqr = new Sqr( game, c * sqrsize, r * sqrsize, this );
                else if ( r === 2 ) sqr = new Sqr( game, c * sqrsize, r * sqrsize, this );
                else if ( r === 3 ) sqr = new Sqr( game, c * sqrsize, r * sqrsize, this );
                else if ( r === 4 ) sqr = new Sqr( game, c * sqrsize, r * sqrsize, this );

                this.sqr.push( sqr );
                this.sqrGrp.add( sqr );
            }
        }
        // center sqrs and repeat text
        this.sqrGrp.x = ( this.game.world.width - ( col * sqrsize ) ) / 2;
        this.sqrGrp.y = ( this.game.world.height - ( row * sqrsize )  ) / 2;
        
        // center repeat text and move with sqrs
        this.txtRepeat.text.x = this.game.world.centerX;
        this.txtRepeat.text.y = this.sqrGrp.y - 35;

        // set number of sqrs
        var j = this.sqr.length - 1;
        for ( var i = 0; i < this.sqr.length; i++ ) 
        {
            this.shuffle.push(i); 
            this.game.add.tween( this.sqr[ j ] ).from ( { y: - 80 }, 
                                            100 * i, Phaser.Easing.Bounce.Out, true, 50 * i );
            j--;
        }
        
        // set intro level delay
        var delay = actv * 500;

        // create first set and extended timer
        this.newSet ( delay );
    },

    // randomly shuffle set
    shuffleSet: function ( arr ) 
    {
        var tempval, rand;
        for ( var i = arr.length - 1; i > 0 ; i-- ) 
        {
            rand = Math.floor( Math.random() * i );

            tempval = arr[ i ];
            arr[ i ] = arr[ rand ];
            arr[ rand ] = tempval;
        }
        return arr;
    },

    // repeat the sqr sequence
    repeatSet: function () 
    {
        INPUT = false;
        for ( var i = 0; i < this.right.length; i++ )
        { 
            this.right[i].animations.frame = 1;
        }

        this.timerSet( 1000 );
    },

    // set time limit on active sqr visibility
    timerSet: function ( time ) 
    {
        this.game.time.events.add( time, function ()
                                  {
                                      for ( var i = 0; i < this.right.length; i++ )
                                      { 
                                          this.right[ i ].animations.frame = 0;  
                                      }
                                      // enable onDown
                                      INPUT = true;
                                  }, this);
    },

    // create a new set of random sqrs
    newSet: function ( time )
    {  // change score
        this.txtScoreNum.text.setText( this.score );

        // change lives
        this.txtLifeNum.text.setText( this.lives );

        // if score is 0 or last level is complete go to end screen
        if ( this.lives < 1 || this.level.cnt === this.level.end ) 
        {
            this.lives < 1 ? this.txtLevel.text.setText( 'GAME OVER' ) :
            this.txtLevel.text.setText( 'YOU WIN' );
            this.screenGrp.twn.start();

            this.game.time.events.add( 3000, function () { this.game.state.start( 'end' ); }, this ); 
            ENDSCORE = this.score; 
            
            return;
        }// next level select
        else if ( this.level.cnt === this.level.max ) 
        {   // tween screen group
            this.screenGrp.twn.start();
            this.txtLevel.text.setText( this.level.text );
            // timer call reset
            this.game.time.events.add( 1000, function () { 
                this.screenGrp.detwn.start();
                this.levelReset ( this.level.num );
            }, this);

            return; 
        }

        // shuffle set
        this.shuffleSet( this.shuffle );

        // control number of repeats
        if ( this.repeat === 3 )
        {
            this.txtRepeat.text.destroy();
        } 
        else { this.repeat++; }

        // clear arrays
        this.right = [];
        this.wrong = [];

        // fill new arrays and show new set
        for ( var i = 0; i < this.shuffle.length; i++ )
        { 
            var memory = this.sqr[ this.shuffle[i] ]; 

            if ( i < this.active ) 
            {    // mark active sqrs
                this.right.push( memory );
                memory.animations.frame = 1; 
            }
            else 
            {
                this.wrong.push( memory );
                memory.animations.frame = 0;  
            }
        }

        // sqr timer hides sqr combination
        this.timerSet( time );
    }
};