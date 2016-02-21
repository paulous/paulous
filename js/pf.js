var ajaxLoad,
ajaxpath = '/Sites/pf02/public';
$(document).ready(function() {
  ajaxLoad = function ( cb, loadPath, ID, indId ) {
    var pathID = loadPath + ' ' + ID;
    $.get( loadPath, {
        userId: 1234,
        data: '',
        cache: false
    }, function( resp ) {
      $(indId).load( pathID, function( html ) {
        if (cb == 'splash'){ // callback to transition in
          setTimeout(splashInit, 6000); // splash text delay
          polyInit();
        } else if (cb == 'About') { // Any About sect
          genPageTranzIn(ID); // fade in selected sect
        } else if (cb == 'Create') {
          introSwf (ID);
        } else if (cb == 'Tech') {
          genPageTranzIn(ID);
        } else if (cb == 'Footer') {
          genPageTranzIn(ID);
        }
      })
    })
  }
});

var headBlast,
footerScroll,
shuffle,
randNum,
randColor;
$(document).ready(function() {
  var subup = true; // control resize calls.
  //
  // Register custom velocity UI effects
  $.Velocity.RegisterUI('headColorIn', {
      defaultDuration: 100,
      calls: [
        [ { color: '#ffa800' }, 1, {easing: 'easeOutCubic'} ]
      ],
      reset: { color: '#a4dee6' }
  });

  // Blast and call effects
  headBlast = function () { //
    if ( $(window).width() > 930) { // No effect if window is smaller than 930
      $('h1').blast({delimiter: 'character'}) // perspectiveLeftIn, bounceLeftIn
      .velocity('headColorIn', { stagger: 50 });
    }
  }
  // Footer scroll to top
  footerScroll = function () {
    $('#TopNav').velocity('scroll', { duration: 1500, easing: 'spring' })
  }
  //
  //Global functions
  shuffle = function (o) {
    for(var j, x, i = o.length; i;
    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }
  randNum = function(min, max, t) {
    if (t){
      max = max - min;
      var r = (Math.random() * max) + min;
      return r;
    }else{
      max = max - min;
      var r = Math.round((Math.random() * max) + min);
      return r;
    }
  }
  randColor = function() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.round(Math.random() * 16)];
    }
    return color;
  }
  // On window resize
  window.addEventListener('resize', function(e) {
    if (subup && this.innerWidth < 768) { // subup allows just once and reset
      subup = false;
      $('#MainContainer').css({ transform: // when subbar size changes...
        'translateY(' + navHeight().sub + 'px)'}); // get new height and move
    } else if (!subup && this.innerWidth > 768) {
      subup = true;
    }
  }, false);
});

var introSwf,
genPageTranzIn,
genPageTranzOut;
$(document).ready(function() {
  var swflastid, genlastid = '#SplashAjax', lastsubsec;
  introSwf = function (ID) {
    headBlast();
    if (swflastid != undefined) {
      if (swflastid == '#SwfAutoIntro'){
        swfOn('next', 0); // go to section start
        swfNavBars ({a:0, b:7}); // heighlight section
      }else if (swflastid == '#SwfCusIntro'){
        swfOn('next', 8);
        swfNavBars ({a:8, b:13});
      }else if (swflastid == '#SwfMediaIntro'){
        swfOn('next', 14);
        swfNavBars ({a:14, b:19});
      }else if (swflastid == '#SwfMiscIntro'){
        swfOn('next', 20);
        swfNavBars ({a:20, b:22});
      }
      //footer ('footer');
      genlastid = ID; // assign main swf id for tranz out
      swflastid = undefined; // clear var for next load
    } else if (ID == '#SwfArchIntro'){ // bounce if archive
      return;
    }
    $(ID).velocity({
      opacity: 1
    }, {
      duration: 1300,
      easing: 'easeOutCubic',
      complete: function(e) {
        if (ID != '#SwfAjax'){ // fade in intro, fade in swf, bounce
          ajaxLoad(
            'Create', // Unique after load key eg. after load fade-in
            ajaxpath + '/swf.html', // File to load
            '#SwfAjax', // ID to retrive from file
            '#MainContent' // ID to put into
          );
          swflastid = ID;
        }
      }
    })
  }
  genPageTranzIn = function (id) { //Trans in new
    console.log(id);
    $(id).velocity({
      opacity: 1
    }, {
      duration: 300,
      easing: 'easeInCubic'
    })
  }
  genPageTranzOut = function (id, subsec, t) { //Trans out old
    $(genlastid).velocity({ // Fade out current ajax load
      opacity: 0
    }, {
      duration: 300,
      easing: 'easeOutCubic',
      complete: function(e) {
        if (genlastid == '#SplashAjax') { // stop remove splash
          $('#Splash').remove();
          splashInit(true);
          reMorph(null, null, true);
        }
        if (subsec == 'About'){
          if (t && lastsubsec !== subsec){ // if logo clicked hilite nav 'About'
            $($('.top-nav-li').get(0)).addClass('top-nav-out');
            $($('.top-nav-li').get(0)).triggerHandler('mouseleave');
            $('#SubAnimate').trigger('click');
          }
          about(id); // call to subbar.js, load ajax id
        }else if (subsec == 'Create') {
          swfIntro(id); // call to subbar.js, load ajax id
        }else if (subsec == 'Tech') {
          tech(id); // call to subbar.js, load ajax id
        }
        lastsubsec = subsec; // change on anim complete:
        genlastid = '#'+id;
      }
    });
  }
});

var polyInit,
reMorph;
$(document).ready(function() {
  var svg, // init vars
  aSvg = [],
  xy = [],
  abc = {a:0, b:1, c:2, tog:0},
  min = 0,
  mid = 70, // change size of poly
  max = mid*2,
  numP = 60, // change total polys
  xP = numP/4, // change division of rows
  xpos = 0,
  ypos = 0, // scale poly = mid ++ --
  timer;
  //
  // Init SVG after html has loaded
  polyInit = function () {
    svg = SVG('Poly').addClass('svg-poly');
    svg.size(mid*xP+mid, numP/xP*max+mid); // create viewbox width and height
    start(); // Start it off
  }
  //
  // Create polygons and return obj
  var appendSvg = function(n) {
    if (n % xP == 0){
      if (n!=0){ypos++;}
      xpos = 0;
    }else{
      xpos++;
    }
    var pts = n % 2 == 0
    ? [[mid,min], [min,max], [max,max]]
    : pts = [[min,min], [max,min], [mid,max]];

    var id = 'poly-'+String(n);
    var poly = svg.polygon(pts).fill('#152c33')
    .stroke({ color: '#a4dee6', opacity: 0.3, width: 1 })
    .move(xpos*mid, ypos*max)
    .addClass(id)
    .addClass('polygon');

    poly.animate(20).plot(pts);

    return {
      id: id,
      pts: pts,
      poly: poly
    }
  }
  //
  // Start call for polygon objs
  var start = function () {
    var xmax = 0, ymax = 0;
    for (var i = 0; i < numP; i++) {
      aSvg.push( appendSvg( i ));
      xmax += max; // continue adding 100 to x
      if ( xpos < Math.floor(xP/2) ){ // divide row len in 2
        if (xpos % xP == 0){ // when end of row is reached +y
          ymax += max; // y start on 2nd row, y init at 100 not 0
          if ( ypos % 2 == 0) {// toggle start new row at 100 or 150
            xmax = max; // set 1st row back to 100
          }else { // start at 150 but change pts on 50
            xmax = max+mid; // set 2nd row back to 150
            xy.push({ // push extra obj on 150 rows, changes pts on 50
              x:[mid, rNums({m:true}), rNums({m:true}), rNums({m:true})],
              y:[ymax, rNums({y:ymax}), rNums({y:ymax}), rNums({y:ymax})],
              xt:false, yt:false});
          }
        }
        xy.push({ // push new obj to xy and random pts
          x:[xmax, rNums({x:xmax}), rNums({x:xmax}), rNums({x:xmax})],
          y:[ymax, rNums({y:ymax}), rNums({y:ymax}), rNums({y:ymax})],
          xt:false, yt:false});
      }
    }
    abc.cid = [];
    aSvg.forEach(function(v){ abc.cid.push(v.id); });
    shuffle(abc.cid);
    abc.cid.forEach(function(v, i){ randOpcty('.' + v, i); });

    setTimeout( function() {
      morph(3000); // Start the polyMorph
    }, 10);
  }
  //
  // Random Opacity for all polygons
  var randOpcty = function(p, n) {
    $(p).velocity({
      opacity: randNum(0, 10, true)/10,
      fill: randColor()
    }, { duration: randNum(500,1000), delay: n*randNum(50,200)})
    .velocity({
      opacity: randNum(2, 10, true)/10,
      fill:'#152c33'
    });
  }
  //
  // Provides random numbers for poly pts
  var rNums = function (rn){ // random numbers for poly pts
    var num;
    if (rn.x){
    num = randNum(rn.x-mid, rn.x+mid);}
    else if(rn.y){num = randNum(rn.y-mid, rn.y+mid);}
    else if(rn.m){num = randNum(mid-mid/2, mid+mid/2);}
    return num;
  }
  //
  // Init poly morph for first time
  var morph = function (dur){
    abc.dur = dur ;
    sortPts(abc);
    timer = setTimeout(function(){
      reMorph(250, 8000)
    }, 5000);
  }
  //
  // All additional calls to morph polygons
  reMorph = function (rpt, dur, t){ // any additional passes
    if (t) {clearTimeout(timer); return;} // stop reMorph
    if (dur){ // external call, set duration and repeat numbers
      abc.rpt = rpt;
    }
    abc.dur = randNum(3000, 8000);

    // toggle random numbers between a, b and c for morphPts()
    abc.tog == 0
    ? (abc.a=1, abc.b=2, abc.c=3, abc.tog = 1)
    : (abc.a=3, abc.b=2, abc.c=1, abc.tog = 0);

    xy.forEach(function (v) { // create new set of randoms for x, y
      v.x[abc.b] = rNums({x:v.x[0]}); // set second array item to rand
      v.y[abc.b] = rNums({y:v.y[0]});
    });
    // below is my funky fix for animating pts with svg.js
    aSvg.forEach(function (v){v.poly.animate(200).plot(v.pts);});
    setTimeout(function(){sortPts(abc)}, 100); // call sortPts()
    abc.cid.forEach(function (v, i){if(i % 3 == 0){randOpcty('.' + v, i);}});
    timer = setTimeout(function(){ // number of repeats = abc.rpt
      abc.rpt--;
      if (abc.rpt !== 0) {
        reMorph();
      }
    }, abc.dur);
  }
  //
  // Sorts polys into groups of 6 for more efficient point comparison
  var sortPts = function (abc){
    // Step through 6 aSvg[] calls where xy[] will be called only once.
    // This will allow all 6 aSvg[].pts[] to be examined for matches with xy[].
    // 3 from the top and 3 from directly below. Range and step make this possible.
    //
    var range = 0, step = 2, ro = Math.round(xP/2); // step of 2+2 allows for the last poly to be first time
    for (var j = 0; j < xy.length-1; j++){ // length-8 or ro will skip last row
      for (var i = 0; i < 6; i++){ // 6 = 3 from top and 3 from directly below
        morphPts ( xy[j], aSvg[range], abc ); // xy has length 41
        if (range == step) { // if true get the 3 directly below by...
          j < xy.length-ro ? range += xP-2 : null; // forwarding range 13. len-8 for last row
        }else {
          range++; // forward 1 for top and below group of 6
        }
      }
      j < xy.length-ro ? range -= xP+1 : range -= 3; // subtract gap between top and below
      step += 2; // step to next group and do the same thing again
    }
  }
  //
  // Finaly apply new random numbers and morph pts
  var morphPts = function ( xyr, svg, abc ) {
    for(var i = 0; i < 3; i++){ // [[x,y],[x,y],[x.y]]
      svg.pts[i].forEach(function (v, j){ // [x,y]
        if (j == 0){ // x point
          // check if svg point x matches current xnum
          v == xyr.x[abc.a] ? xyr.xt = true : xyr.xt = false;
        }else{ // y point
          // check if svg point y matches current ynum
          v == xyr.y[abc.a] ? xyr.yt = true : xyr.yt = false; // current = a
        }
      })
      if(xyr.xt && xyr.yt){ // two matches = success

        svg.pts[i][0] = xyr.x[abc.b]; // svg = b
        svg.pts[i][1] = xyr.y[abc.b]; // change pts to random b
        svg.poly.animate(abc.dur).plot(svg.pts);

        xyr.x[abc.c] = xyr.x[abc.b]; // c = b
        xyr.y[abc.c] = xyr.y[abc.b]; // take new random b pts and add to c

        xyr.xt = false; // reset
        xyr.yt = false;
      }
    }
  }
});

var splashInit; // called from ajax.js
$(document).ready(function() {
  // Ajax page load on load
  ajaxLoad(
    'splash', // Do something after it loads, not before!
    ajaxpath + '/splash.html', // File to load
    '#SplashAjax', // ID to retrive from file
    '#Splash' // ID to put into
  );
  // Array of words that get looped through
  var divTitles = [
    'WEB',
    'DESIGN',
    'IDEAS',
    'CODE',
    'SHARING',
    'SKILLS',
    'MONEY',
    'LIFE',
    'HEALTH',
    'TRUST',
    'MIND',
    'DESIRE',
    'NEED'
  ];
  // Easing In and Out all
  var easyIn = [
    'easeInSine',
    'easeInCubic',
    'easeInQuad',
    'easeInExpo',
    'easeInBack',
    'easeInCirc',
    'easeInQuint'
  ];
  var easyOut = [
    'easeOutSine',
    'easeOutCubic',
    'easeOutQuad',
    'easeOutExpo',
    'easeOutBack',
    'easeOutCirc',
    'easeOutQuint'
  ];
  // Splash text registered effect
  $.Velocity.RegisterUI('splashHeadIn', {
      defaultDuration: 100,
      calls: [
        [ { color: '#ffa800' }, 1, {easing: 'easeOutCubic'} ],
        [ { scale: .7 }, 1, {easing: 'easeOutCubic'} ]
      ],
      reset: { color: '#a4dee6', opacity:1 }
  });
  //
  // Splash page animation start
  var txtn = 0;
  splashInit = function (t) { // Headline text
    if (t) { clearTimeout(out); $('.poly-sub-txt', '.poly-txt').velocity('stop'); return; } // stop
    $('.poly-txt')
    .blast({delimiter: 'character'}) // perspectiveLeftIn, bounceLeftIn
    .velocity('splashHeadIn', { stagger: 100 })
    //.velocity({textShadowBlur: '3rem'}, { duration:1500 })
    .velocity({opacity:0}, { duration:3000,  delay:500 });

    $('.poly-sub-txt').text(divTitles[txtn]);// switch sub txt
    txtn < divTitles.length-1 ? txtn++ : txtn = 0; // loop through divTitles

    var out = setTimeout( function() {
      $('.poly-sub-txt')
      .blast({delimiter: 'character'}) // perspectiveLeftIn, bounceLeftIn
      .velocity('splashHeadIn', { stagger: 100})
      //.velocity({textShadowBlur: '3rem'}, { duration:2000 })
      .velocity({opacity:0}, { duration:3000,  delay:1000,
        complete: function (){splashInit();} });
    }, 1000);
  }
});

var swfIntro,
about,
tech;
$(document).ready(function() {
  swfIntro = function (id) { // Called from subbar.html
    ajaxLoad(
      'Create', // Unique after load key eg. after load fade-in, ajax.js
      ajaxpath + '/swfintro.html', // File to load
      '#'+id, // ID to retrive from file
      '#MainContent' // ID to put into
    );
    if ( $('#Footer').is(':parent') ){$('#Footer').html('');} // Remove footer
  }
  about = function (id) { // Called from subbar.html
    ajaxLoad(
      'About', // Unique after load key eg. after load fade-in, ajax.js
      ajaxpath + '/' + id + '.html', // File to load
      '#'+id, // ID to retrive from file
      '#MainContent' // ID to put into
    );
    if (id == 'aboutcnt') { // Don't add a footer to contact
      $('#Footer').html(''); // Unload the footer
    }else {
      footer ('footer');
    }
  }
  tech = function (id) { // Called from subbar.html
    ajaxLoad(
      'Tech', // Unique after load key eg. after load fade-in, ajax.js
      ajaxpath + '/' + id + '.html', // File to load
      '#'+id, // ID to retrive from file
      '#MainContent' // ID to put into
    );
    footer ('footer');
  }
  var footer = function (id) {
    if ($('#Footer').is(':empty')){ // check if footer is empty
      ajaxLoad(
        'Footer', // Unique after load key eg. after load fade-in, ajax.js
        ajaxpath + '/' + id + '.html', // File to load
        '#'+id, // ID to retrive from file
        '#Footer' // ID to put into
      );
    }
  }
});

var swfTranzOut;
var swfOn;
var swfNavBars;
$(document).ready(function() {
  // swf params array
  var path = 'media/swf', swfCount = 0, first = true, active = true, lastog;
  var swfName = [
    {name: 'Mercedes', url: path + '/merc_160x600.swf', width: '160', height: '600', des: 'Clemmenger BBDO, Melbourne', int: 'No', size: '23k'},
    {name: 'Mercedes', url: path + '/merc_300x250.swf', width: '300', height: '250', des: 'Clemmenger BBDO, Melbourne', int: 'No', size: '40k'},
    {name: 'Mercedes', url: path + '/merc_Eclass_300x250.swf', width: '300', height: '250', bg: '#ffffff', des: 'Clemmenger BBDO, Melbourne', int: 'No', size: '33k'},
    {name: 'Ford Mondeo', url: path + '/ford_120x600_lig.swf', width: '120', height: '600', des: 'Wunderman, London', int: 'No', size: '29k'},
    {name: 'Ford Mondeo', url: path + '/ford_120x600.swf', width: '120', height: '600', des: 'Wunderman, London', int: 'No', size: '33k'},
    {name: 'Ford Mondeo', url: path + '/ford_300x250.swf', width: '300', height: '250', des: 'Wunderman, London', int: 'No', size: '22k'},
    {name: 'Nissan Navara', url: path + '/nissan_300X250.swf', width: '300', height: '250', des: 'Untitled, London', int: 'No', size: '30k'},
    {name: 'Nissan Navara', url: path + '/nissan_800X600.swf', width: '600', height: '400', des: 'Untitled, London', int: 'No', size: '980k'},
    {name: 'Waitrose', url: path + '/waitrose_500x300.swf', width: '500', height: '300', des: 'Twenty Six, London', int: 'Yes', size: '106k'},
    {name: 'Weet-Bix', url: path + '/weetbix_940x660.swf', width: '600', height: '421', bg: '#000000', des: 'Sputnik Agency, Melbourne', int: 'No', size: '194k'},
    {name: 'Splenda', url: path + '/splenda_300x600_01.swf', width: '300', height: '600', des: 'Sputnik Agency, Melbourne', int: 'No', size: '36k'},
    {name: 'Splenda', url: path + '/splenda_300x600.swf', width: '300', height: '600', des: 'Sputnik Agency, Melbourne', int: 'Yes', size: '40k'},
    {name: 'Carlton Draught', url: path + '/carlton_300x250.swf', width: '300', height: '250', des: 'Clemmenger BBDO, Melbourne', int: 'No', size: '30k'},
    {name: 'Quorn', url: path + '/quorn_300x250.swf', width: '300', height: '250', des: 'BWM, Melbourne', int: 'No', size: '41k'},
    //{name: 'Carlton Draught', url: path + '/carlton_728x90.swf', width: '728', height: '90', des: 'Banner', int: 'No', size: '15k'},
    {name: 'Australian Idol', url: path + '/ausIdol_760x450.swf', width: '600', height: '355', des: 'Igloo, Melbourne', int: 'Yes', size: '179k'},
    {name: 'Paradise Lost', url: path + '/palmLeafs08.swf', width: '300', height: '250', des: 'Green Room, London', int: 'No', size: '57k'},
    {name: 'Haven Holidays', url: path + '/haven_300X250.swf', width: '300', height: '250', des: 'Souk, London', int: 'Yes', size: '78k'},
    {name: 'BMI', url: path + '/bmi_300X250.swf', width: '300', height: 250, des: 'Twenty Six, London', int: 'No', size: '30k'},
    {name: 'TeleWest', url: path + '/elle.swf', width: '300', height: '250', bg: '#ffffff', des: 'Twenty Six, London', int: 'No', size: '30k'},
    {name: 'ntl', url: path + '/NTL_300x250.swf', width: '300', height: '250', des: 'Twenty Six, London', int: 'Yes', size: '30k'},
    //{name: 'Showtime', url: path + '/jeremiah_kick.swf', width: '450', height: '300', des: 'Banner', int: 'No', size: '15k'},
    //{name: 'Toys R Us| Rzone', url: path + '/rzoneMovie.swf', width: '500', height: '500', des: 'Banner', int: 'No', size: '15k'},
    //{name: 'Quorn| 01', url: path + '/quorn_160x300.swf', width: '160', height: '300', des: 'Banner', int: 'No', size: '15k'},
    {name: 'White Pages', url: path + '/whitepages_300x250.swf', width: '300', height: '250', des: 'Clemmenger BBDO, Melbourne', int: 'Yes', size: '37k'},
    {name: 'PA Consulting', url: path + '/paConsult.swf', width: '600', height: '400', des: 'PA Consulting', int: 'Yes', size: '106k'},
    {name: 'Save the Children', url: path + '/STC_03.swf', width: '600', height: '450', bg: '#000000', des: 'Proximity, London', int: 'No', size: '785k'}
  ];
  // swf loading
  var swfLoadEvent = function (swftranzin){
    //Ensure fn is a valid function
    if(typeof fn !== 'function'){ return false; }
    //This timeout ensures we don't try to access PercentLoaded too soon
    var initialTimeout = setTimeout(function (){
        //Ensure Flash Player's PercentLoaded method is available and returns a value
        if(typeof e.ref.PercentLoaded !== 'undefined' && e.ref.PercentLoaded()){
            //Set up a timer to periodically check value of PercentLoaded
            var loadCheckInterval = setInterval(function (){
                //Once value == 100 (fully loaded) we can do whatever we want
                if(e.ref.PercentLoaded() === 100){
                    //Execute function
                    swftranzin();
                    //Clear timer
                    clearInterval(loadCheckInterval);
                }
            }, 1500); // ADJUSTED FROM 1500
        }
    }, 200);
  }
  //To use this custom swfLoadEvent function, you invoke it via your SWFObject callback:
  //This function is invoked by SWFObject once the <object> has been created
  var callback = function (e){
    //Only execute if SWFObject embed was successful
    if(!e.success || !e.ref){ return false; }
    swfLoadEvent( swfTranzIn() );
  };
  //
  //Support function: checks to see if target
  //element is an object or embed element
  var isObject = function (targetID){
     var isFound = false;
     var el = document.getElementById(targetID);
     if(el && (el.nodeName === 'OBJECT' || el.nodeName === 'EMBED')){
        isFound = true;
     }
     return isFound;
  }
  //
  //Support function: creates an empty
  //element to replace embedded SWF object
  var replaceSwfWithEmptyDiv = function(targetID){
     var el = document.getElementById(targetID);
     if(el){
        var div = document.createElement('div');
        el.parentNode.insertBefore(div, el);
        //Remove the SWF
        swfobject.removeSWF(targetID);
        //Give the new DIV the old element's ID
        div.setAttribute('id', targetID);
     }
  }
  var loadSWF = function (swf, targetID ){
     //Check for existing SWF
     if(isObject(targetID)){
        //replace object/element with a new div
        replaceSwfWithEmptyDiv(targetID);
     }
     //Embed SWF
     if (swfobject.hasFlashPlayerVersion('9')) {
        var attributes = {
          //data: swf.url,
          //width: swf.width,
          //height: swf.height,
          class: 'swf-class'
        };
        var bgColor = '#152c33';
        if (swf.bg) {
          bgColor = swf.bg;
        }
        var params = {
          //align: 'l',
          wmode: 'direct',
          bgcolor: bgColor
        };

        var obj = swfobject.embedSWF(
          swf.url,
          targetID,
          swf.width,
          swf.height,
          '9',
          false,
          false,
          params,
          attributes,
          callback
        );
     }
     // Change heading txt
     $('.swf-head').html('<div class="flex-head">' + swf.name + '<div>');
     $('.swf-text').html('<div class="flex-text">Agency: '+ swf.des +'<br>Interactive: '+ swf.int +'<br>Size: '+ swf.size +'</div>');
  }
  //
  var swfTranzIn = function () { // transition swf in
    $('#SwfCont').velocity({
      opacity: 1,
    }, {
      duration: 300,
      easing: 'easeInCubic',
      complete: function(e) {
        active = true; // swf has loaded, activate buttons
      }
    })
  }
  //
  swfTranzOut = function (ID, navnum) { // transition swf out
    if ( // bounce if...
      ID == 'next' && swfCount == swfName.length || // end of array is reached by bar.
      ID == 'next' && swfCount == swfName.length-1 && navnum == null || // end of array is reached by next.
      ID == 'prev' && swfCount == 0 // and if previous is pressed at start
      ){
      return;
    }
    $('#SwfCont').velocity({
      opacity: 0,
    }, {
      duration: 300,
      easing: 'easeOutCubic',
      complete: function(e) {
        if (navnum != null) { // called from swfbars
          swfOn (ID, navnum);
        }else { // called from prev, next
          active = true;
          swfOn (ID, null);
          togNavBars( $('.swf-bars-li').get(swfCount) ); // toggle swfnavBars
          $('.swf-bars-txt').html( swfName[ swfCount ].name );
        }
      }
    })
  }
  //
  swfOn = function ( ID, navnum ) {
    if (navnum != null) { // called from subbar, ajax.js + into.js
      swfCount = navnum; // or swfTranzOut and swfbars
      first = true;
      active = true;
    }
    if ( active ){ // if swf has finished loading
      if (!first) { // skip first pass
        if (ID == 'next') {
          swfCount++;
        }else if (swfCount > 0){ // stop swfCount from -1
          swfCount--;
        }else{
          first = true; // back to first pass
          swfCount = 0; //reset to 0
          return; // if prev is pressed to many times
        }
      }
      loadSWF (swfName[swfCount], 'SwfCont'); // load swf
      first = false; // first pass no ++
      active = false; // stop untill swf has loaded
    }
  }
  //
  // Swf Nav and bars
  swfNavBars = function (aB) { //get bar section range a, b
    var swful = '<ul class="swf-bars-ul">';
    for(var i=0; i < swfName.length; i++){
      swful += '<li class="swf-bars-li"><a href="#"></a></li>';
    }
    swful += '</ul>';
    $('.swf-bars').append(swful);
    for(var i=0; i < swfName.length; i++){
      if (i >= aB.a && i <= aB.b) { // change bg css for sect li's
        var ab = $('.swf-bars-li').get(i);
        $(ab).css({backgroundColor: '#bffff7'});
      }
    }
    //
    togNavBars( $('.swf-bars-li').get(swfCount) ); // set first bar heighlight
    //
    $('.swf-bars-li').on('click', (function(e) {
        swfCount = $(this).index(); // get index of li $(this).index()
        swfTranzOut('next', swfCount);
        togNavBars(this);// call after click on swfBars
    }));

    $('.swf-bars-li').on('mouseenter', (function(e) {
      $('.swf-bars-txt').html( swfName[ $(this).index() ].name );
    }));

    $('.swf-bars-li').on('mouseleave', (function(e) {
      $('.swf-bars-txt').html( swfName[ swfCount ].name );
    }));
    //
    $('.swf-bars-txt').html( swfName[ swfCount ].name );
  }
  //
  var togNavBars = function (togg) { // Toggle if from...
    if ( lastog ) { // subbar, swfBars or next, prev
      $(lastog).css({backgroundColor: '#bffff7', opacity: .5});
    }
    $(togg).css({backgroundColor: '#ffa800', opacity: 1});
    lastog = togg;
  }
});

var navHeight; // called from animate.js. resize window
$(document).ready(function() {
  // Init vars for top nav section select, enter and leave animation
  var tog = '#About', lastog, subup, blaster, slowenter, slowleave, slow, clicked;
  //
  // Top nav animation
  var subSectTxt =  function (id) {
    ajaxLoad(
      null, // after load do nothing
      ajaxpath + "/subbar.html", // File to load
      id, // ID to retrive from file
      "#SubAnimate" // ID to put into
    );
  }
  subSectTxt("#SubNavCreate"); // init subnav menus
  subSectTxt("#SubNavTech");
  subSectTxt("#SubNavAbout");
  //
  // Resize subnav menus
  navHeight = function (){
      var top = $("#TopNav").height();
      var sub = -$("#SubAnimate").height() + top;
      return {top:top, sub:sub}
  }
  //
  $(".top-nav-li").on("mouseenter",(function(e) {
    slowleave = false;
    slowenter = setTimeout(function (){ //pause before activating
      slowleave = true;
      subup = false;

      if (this.id == "Create") { subSectTxt("#SubNavCreate"); }
      else if (this.id == "Tech") { subSectTxt("#SubNavTech"); }
      else if (this.id == "About") { subSectTxt("#SubNavAbout"); }

      $("#SubAnimate").css({ transform: "translateX(" + 0 + "px)"}); // Subnav set X to 0
      hoverRemove();

      tog = "#" + this.id; // Add class to new hover
      if (clicked != tog ){
        $(tog).addClass("top-nav-li");
        tranzInOut(clicked, .5); // clicked tab fade to .5
      }
      // Animate open subnav
      $("#MainContainer").velocity({
        translateY: navHeight().top,
      }, {
        queue: false,
        duration: 300,
        easing: "easeOutSine",
      });
    }.bind(this), 300);
  }));
  //
  // Keep button state with top-nav-out
  $(".top-nav-li").on("mouseleave", (function(e) {
    clearTimeout(slowenter);
    if (slowleave){
      if (e.pageY < navHeight().top) {
        slow = this.id;
        slowenter = setTimeout(function(){ // slow call to subUp()
          slow = null;
          subUp(); // Animate close subnav
        }, 300);
      }else { // only add hover if tab is active
        tog = "#"+this.id;
        $(tog).addClass("top-nav-out");
      }
    }
  }));
  //
  // Remove hover from last selected or rolled over
  var hoverRemove = function () {
    tranzInOut(lastog, 1); // catch lasttog before change. Fade it in
    if (clicked != tog){ // don't remove overstate if subbar clicked
      $(tog).removeClass("top-nav-out"); // remove if not the active tab
    }else { // access to last active tog
      if (tog != lastog){ // remove only if tog has changed through link click
        $(lastog).removeClass("top-nav-out"); // remove last held butt state
      }
      lastog = tog; // capture last tog
    }
  }
  //
  var tranzInOut = function (id, inout) {
    $(id).velocity ( {opacity: inout}, {queue: false, duration: 300}); // clicked tab focus
  }
  $("#SubAnimate").on("click", (function(e) {
    clicked = tog; // Set clicked, get id of topnav for hilite
    blaster = true;
    hoverRemove(); // remove previous active hover
  }));
  //
  // Subnav leave animation
  $("#SubAnimate").on("mouseenter", (function(e) {
    clearTimeout(slowenter); // Set by top or sub leave. lazy for 300ms
    if (typeof slow === 'string') { // slow set to id of top leave. or false
      $('#'+slow).addClass("top-nav-out"); // use slow string id to keep hover active
      slow = null; // reset to false
    }
    subup = true;
  }));
  $("#SubAnimate").on("mouseleave", (function(e) {
    slowenter = setTimeout(function () { // lazy close sub menu
      if (e.pageY > navHeight().top || subup) { // Collaps subnav if mouseY > 75px
        subUp (); // Animate close subnav
      }
      if (blaster) { headBlast(); } // blast section headline if true
      blaster = false;
    }, 300);
  }));
  // Animate close subbar
  var subUp = function (){
    hoverRemove(); // remove previous active hover
    $("#MainContainer").velocity({
      translateY: navHeight().sub // get subnav size
    }, {
      queue: false,
      duration: 200,
      easing: "easeInSine",
    });
  }
});
