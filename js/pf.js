var ajaxLoad;
var ajaxpath = "../";
$(document).ready(function() {
  ajaxLoad = function ( cb, loadPath, ID, indId ) {
    var pathID = loadPath + " " + ID;
    $.get( loadPath, {
        userId: 1234,
        data: '',
        cache: false
    }, function( resp ) {
      $(indId).load( pathID, function( html ) {
        //"#MainContent" -"/Sites/pf01/public/swf.html"
        if (cb == "splash"){ // callback to transition in
          splashDivs();
        } else if (cb == "About") { // Any about
          genPageTranzIn(ID); // specific about
        } else if (cb == "Create") {
          introSwf (ID);
        } else if (cb == "Tech") { // Any about
          genPageTranzIn(ID); // specific about
        }
      })
    })
  }
});

var headBlast;
var splashBlast;
var footerScroll;
$(document).ready(function() {
  //
  // Register custom velocity UI effects
  $.Velocity.RegisterUI("headColorIn", {
      defaultDuration: 100,
      calls: [
        [ { color: "#ffa800" }, 1, {easing: "easeOutCubic"} ]
      ],
      reset: { color: "#a4dee6" }
  });
  $.Velocity.RegisterUI("splashHeadIn", {
      defaultDuration: 100,
      calls: [
        [ { color: "#a4dee6" }, 1, {easing: "easeOutCubic"} ]
      ],
      reset: { color: "#152c33" }
  });
  // Blast and call effects
  headBlast = function () { //
    $("h1").blast({delimiter: "character"}) // perspectiveLeftIn, bounceLeftIn
    .velocity("headColorIn", { stagger: 50 });
  }
  splashBlast = function () { //
    $(".splash-big-txt").blast({delimiter: "character"}) // perspectiveLeftIn, bounceLeftIn
    .velocity("splashHeadIn", { stagger: 50 });
  }

  footerScroll = function () {
    $("#TopNav").velocity("scroll", { duration: 1500, easing: "spring" })
  }
});

var introSwf;
var genPageTranzIn;
var genPageTranzOut;
$(document).ready(function() {
  var swflastid, genlastid = "#SplashAjax";
  introSwf = function (ID) {
    headBlast();
    if (swflastid != undefined) {
      if (swflastid == "#SwfAutoIntro"){
        swfOn("next", 0); // go to section start
      }else if (swflastid == "#SwfCusIntro"){
        swfOn("next", 8);
      }else if (swflastid == "#SwfMediaIntro"){
        swfOn("next", 14);
      }else if (swflastid == "#SwfMiscIntro"){
        swfOn("next", 20);
      }
      footer ("footer");
      swfNavBars ();
      genlastid = ID; // assign main swf id for tranz out
      swflastid = undefined; // clear var for next load
    } else if (ID == "#SwfArchIntro"){
      return;
    }
    $(ID).velocity({
      opacity: 1,
    }, {
      duration: 1300,
      easing: "easeOutCubic",
      complete: function(e) {
        if (ID != "#SwfAjax"){ // fade in intro, fade in swf, bounce
          ajaxLoad(
            "Create", // Unique after load key eg. after load fade-in
            ajaxpath + "/swf.html", // File to load
            "#SwfAjax", // ID to retrive from file
            "#MainContent" // ID to put into
          );
          swflastid = ID;
        }
      }
    })
  }
  genPageTranzIn = function (id) { //Trans in new
    $(id).velocity({
      opacity: 1
    }, {
      duration: 300,
      easing: "easeInCubic"
    })
  }
  genPageTranzOut = function (id, subsec) { //Trans out old
    clicked = "#"+subsec;
    // broadcast clicked tab globaly
    $(genlastid).velocity({
      opacity: 0
    }, {
      duration: 300,
      easing: "easeOutCubic",
      complete: function(e) {
          if (subsec == "About"){
            about(id); // call to subbar.js, load ajax id
          }else if (subsec == "Create") {
            swfIntro(id); // call to subbar.js, load ajax id
          }else if (subsec == "Tech") {
            tech(id); // call to subbar.js, load ajax id
          }
        }
    });
    genlastid = "#"+id;
  }
});

var splashDivs; // called from ajax.js
var randColor;
$(document).ready(function() {
  ajaxLoad(
    "splash", // Do something after it loads, not before!
    ajaxpath + "/splash.html", // File to load
    "#SplashAjax", // ID to retrive from file
    "#MainContent" // ID to put into
  );
  var divTitles = [
    'Perception',
    'The Web',
    'Ideas',
    'Everything',
    'Money',
    'Our Lives',
    'Design',
    'Approtch',
    'Change',
    'Desire',
    'Expectation',
    'Direction',
    'Future'
  ];
  var divGrow = [], divcolor, divspeed, divwidth, divheight;
  var easyIn = [ "easeInSine", "easeInCubic", "easeInQuad", "easeInExpo", "easeInBack", "easeInCirc", "easeInQuint"];
  var easyOut = [ "easeOutSine", "easeOutCubic", "easeOutQuad", "easeOutExpo", "easeOutBack", "easeOutCirc", "easeOutQuint"];
  /*var modSeq = function ( i, mod ) {
    return ( ( i - 1 ) % mod ) + 1;
  }*/
  splashDivs = function () {
    for (var i = 0; i < 10; i++){
      divGrow.push( {
        ID: "#GrowDiv"+String(i),
        div:"<div id='GrowDiv"+i+"' class='grow-div'></div>"
      });
      $(".splash-div").append(divGrow[i].div);
      $(divGrow[i].ID).css("height", randNum(1, 100));
      //$(divGrow[i].ID).css({
        //transform: "translateY(" + randNum(80, 300) + "px)"
      //});
      //$(divGrow[i].ID).velocity({translateY: 0})
      if ( i % 3 == 1 ){ // keep every second div in the centre
        //$(divGrow[i].ID).css("align-self", "flex-end");
      } else if ( i % 3 == 0 ) {
        //$(divGrow[i].ID).css("align-self", "flex-start");
        //$(divGrow[i].ID).velocity({rotateZ: "90deg"});
      }
      $(divGrow[i].ID).css("background-color", "#a4dee6");
      moveDivs(divGrow[i].ID);
      /*var seqnz = [
        { e: $(id), p: { translateX: [0, -300] }, o: { duration: 2000 } },
        { e: $(".sp-two"), p: { translateX: [0, -300] }, o: { duration: 1000, sequenceQueue: false } },
        { e: $(".sp-three"), p: { translateX: -300 }, o: { duration: 1000 } }
      ];*/
      //$.Velocity.RunSequence(seqnz);
    }
  }
  var moveDivs = function (id) {
    if (topover){ // if mouse is over menu
      //divwidth = randNum(winWidth/2, winWidth);
      //divheight = randNum(winHeight/4, winHeight/2);
      //divcolor = randColor();
      //divspeed = randNum(500, 2000);
    } else {
      //divcolor = "#a4dee6";
    }
    divheight = randNum(1, winHeight/4);
    divwidth = randNum(winWidth/4, winWidth);
    divspeed = randNum(1000, 5000);
    var eez = randNum(0, easyIn.length-1);
    var randY = randNum((winHeight/4 - divheight/2)-100, (winHeight/4 - divheight/2) + 200)
    $(id).velocity({  translateX: winWidth/2 - divwidth/2, translateY: randY});
    // Animation start
    $(id).velocity({
      width: divwidth,
      rotateZ: randNum(-45, 45),
      translateY: "+=" + String(randNum(-100, 100))+"px",

      height: divheight,

      //backgroundColor: divcolor,
      opacity: 1
    }, {
      duration: divspeed,
      easing: easyOut[eez]
    })
    .velocity({
      width:0,
      opacity: 0
    }, {
      duration: divspeed,
      easing: easyIn[eez],
      complete: function (){
        moveDivs(id);
      }
    });
  }
  var randNum = function (min, max) {
    max = max - min;
    var r = Math.round((Math.random()*max)+min);
    return r;
  }
  randColor = function() {
    var letters = '0123456789ABCDEF';
    //var letters = '789ABCD'.split('');
    //var letters = '012DEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 16)];
        //color += letters[Math.round(Math.random() * 6)];
    }
    return color;
  }
});

var swfIntro;
var about;
var tech;
var footer;
$(document).ready(function() {
  swfIntro = function (swfID) { // Called from subbar.html
    ajaxLoad(
      "Create", // Unique after load key eg. after load fade-in, ajax.js
      ajaxpath + "/swfintro.html", // File to load
      "#"+swfID, // ID to retrive from file
      "#MainContent" // ID to put into
    );
    $("#footer").remove(); // Remove footer
  }
  about = function (aboutID) { // Called from subbar.html
    ajaxLoad(
      "About", // Unique after load key eg. after load fade-in, ajax.js
      ajaxpath + "/" + aboutID + ".html", // File to load
      "#"+aboutID, // ID to retrive from file
      "#MainContent" // ID to put into
    );
    footer ("footer"); // Add footer
  }
  tech = function (techID) { // Called from subbar.html
    ajaxLoad(
      "Tech", // Unique after load key eg. after load fade-in, ajax.js
      ajaxpath + "/" + techID + ".html", // File to load
      "#"+techID, // ID to retrive from file
      "#MainContent" // ID to put into
    );
    footer ("footer");
  }
  footer = function (footerID) { // Called from subbar.html
    ajaxLoad(
      "Footer", // Unique after load key eg. after load fade-in, ajax.js
      ajaxpath + "/" + footerID + ".html", // File to load
      "#"+footerID, // ID to retrive from file
      "#Footer" // ID to put into
    );
  }
});

var swfTranzOut;
var swfOn;
var swfNavBars;
$(document).ready(function() {
  // swf params array
  var path = "media/swf";
  var swfName = [
    {name: "Mercedes", url: path + "/merc_160x600.swf", width: "160", height: "600", des: "Clemmenger BBDO, Melbourne", int: "No", size: "23k"},
    {name: "Mercedes", url: path + "/merc_300x250.swf", width: "300", height: "250", des: "Clemmenger BBDO, Melbourne", int: "No", size: "40k"},
    {name: "Mercedes", url: path + "/merc_Eclass_300x250.swf", width: "300", height: "250", bg: "#ffffff", des: "Clemmenger BBDO, Melbourne", int: "No", size: "33k"},
    {name: "Ford Mondeo", url: path + "/ford_120x600_lig.swf", width: "120", height: "600", des: "Wunderman, London", int: "No", size: "29k"},
    {name: "Ford Mondeo", url: path + "/ford_120x600.swf", width: "120", height: "600", des: "Wunderman, London", int: "No", size: "33k"},
    {name: "Ford Mondeo", url: path + "/ford_300x250.swf", width: "300", height: "250", des: "Wunderman, London", int: "No", size: "22k"},
    {name: "Nissan Navara", url: path + "/nissan_300X250.swf", width: "300", height: "250", des: "Untitled, London", int: "No", size: "30k"},
    {name: "Nissan Navara", url: path + "/nissan_800X600.swf", width: "600", height: "400", des: "Untitled, London", int: "No", size: "980k"},
    {name: "Waitrose", url: path + "/waitrose_500x300.swf", width: "500", height: "300", des: "Twenty Six, London", int: "Yes", size: "106k"},
    {name: "Weet-Bix", url: path + "/weetbix_940x660.swf", width: "600", height: "421", bg: "#000000", des: "Sputnik Agency, Melbourne", int: "No", size: "194k"},
    {name: "Splenda", url: path + "/splenda_300x600_01.swf", width: "300", height: "600", des: "Sputnik Agency, Melbourne", int: "No", size: "36k"},
    {name: "Splenda", url: path + "/splenda_300x600.swf", width: "300", height: "600", des: "Sputnik Agency, Melbourne", int: "Yes", size: "40k"},
    {name: "Carlton Draught", url: path + "/carlton_300x250.swf", width: "300", height: "250", des: "Clemmenger BBDO, Melbourne", int: "No", size: "30k"},
    {name: "Quorn", url: path + "/quorn_300x250.swf", width: "300", height: "250", des: "BWM, Melbourne", int: "No", size: "41k"},
    //{name: "Carlton Draught", url: path + "/carlton_728x90.swf", width: "728", height: "90", des: "Banner", int: "No", size: "15k"},
    {name: "Australian Idol", url: path + "/ausIdol_760x450.swf", width: "600", height: "355", des: "Igloo, Melbourne", int: "Yes", size: "179k"},
    {name: "Paradise Lost", url: path + "/palmLeafs08.swf", width: "300", height: "250", des: "Green Room, London", int: "No", size: "57k"},
    {name: "Haven Holidays", url: path + "/haven_300X250.swf", width: "300", height: "250", des: "Souk, London", int: "Yes", size: "78k"},
    {name: "BMI", url: path + "/bmi_300X250.swf", width: "300", height: 250, des: "Twenty Six, London", int: "No", size: "30k"},
    {name: "TeleWest", url: path + "/elle.swf", width: "300", height: "250", bg: "#ffffff", des: "Twenty Six, London", int: "No", size: "30k"},
    {name: "ntl", url: path + "/NTL_300x250.swf", width: "300", height: "250", des: "Twenty Six, London", int: "No", size: "30k"},
    //{name: "Showtime", url: path + "/jeremiah_kick.swf", width: "450", height: "300", des: "Banner", int: "No", size: "15k"},
    //{name: "Toys R Us| Rzone", url: path + "/rzoneMovie.swf", width: "500", height: "500", des: "Banner", int: "No", size: "15k"},
    //{name: "Quorn| 01", url: path + "/quorn_160x300.swf", width: "160", height: "300", des: "Banner", int: "No", size: "15k"},
    {name: "White Pages", url: path + "/whitepages_300x250.swf", width: "300", height: "250", des: "Clemmenger BBDO, Melbourne", int: "Yes", size: "37k"},
    {name: "PA Consulting", url: path + "/paConsult.swf", width: "600", height: "400", des: "PA Consulting", int: "Yes", size: "106k"},
    {name: "Save the Children", url: path + "/STC_03.swf", width: "600", height: "450", bg: "#000000", des: "Proximity, London", int: "No", size: "785k"}
  ];
  // swf loading
  var swfLoadEvent = function (swftranzin){
    //Ensure fn is a valid function
    if(typeof fn !== "function"){ return false; }
    //This timeout ensures we don't try to access PercentLoaded too soon
    var initialTimeout = setTimeout(function (){
        //Ensure Flash Player's PercentLoaded method is available and returns a value
        if(typeof e.ref.PercentLoaded !== "undefined" && e.ref.PercentLoaded()){
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
     if(el && (el.nodeName === "OBJECT" || el.nodeName === "EMBED")){
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
        var div = document.createElement("div");
        el.parentNode.insertBefore(div, el);
        //Remove the SWF
        swfobject.removeSWF(targetID);
        //Give the new DIV the old element's ID
        div.setAttribute("id", targetID);
     }
  }
  var loadSWF = function (swf, targetID ){
     //Check for existing SWF
     if(isObject(targetID)){
        //replace object/element with a new div
        replaceSwfWithEmptyDiv(targetID);
     }
     //Embed SWF
     if (swfobject.hasFlashPlayerVersion("9")) {
        var attributes = {
          //data: swf.url,
          //width: swf.width,
          //height: swf.height,
          class: "swf-class"
        };
        var bgColor = "#152c33";
        if (swf.bg) {
          bgColor = swf.bg;
        }
        var params = {
          //align: "l",
          wmode: "direct",
          bgcolor: bgColor
        };

        var obj = swfobject.embedSWF(
          swf.url,
          targetID,
          swf.width,
          swf.height,
          "9",
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
  // Transitions and init loading for swfs
  var swfCount = 0, first = true, active = true;
  //
  var swfTranzIn = function () { // transition swf in
    $('#SwfTranz').velocity({
      opacity: 1,
    }, {
      duration: 300,
      easing: "easeInCubic",
      complete: function(e) {
        active = true; // swf has loaded, activate buttons
      }
    })
  }
  swfTranzOut = function (ID, navnum) { // transition swf out
    if (swfCount >= swfName.length-1 && // bounce if...
      ID == "next" || // end of array is reached by next.
      first && ID == "prev" // and if previous is pressed at start
      ){
      return;
    }
    $('#SwfTranz').velocity({
      opacity: 0,
    }, {
      duration: 300,
      easing: "easeOutCubic",
      complete: function(e) {
        if (navnum != null) { // called from swfbars
          swfOn (ID, navnum);
        }else{ // called from prev, next
          active = true;
          swfOn (ID, null);
          tog = "#"+String(swfCount);
          togNavBars(tog); // toggle swfnavBars
          $(".swf-bars-txt").html( swfName[ swfCount ].name );
        }
      }
    })
  }
  swfOn = function ( ID, subnum ) {
    if (subnum != null) { // called from subbar, ajax.js + into.js
      swfCount = subnum; // or swfTranzOut and swfbars
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
  var tog, lastog;
  swfNavBars = function () {
    var swfulli = "<ul class='swf-bars-ul'>";
    for(var i=0; i < swfName.length; i++){
       swfulli += "<li id='"+i+"' class='swf-bars-li'><a href='#' onclick=\"swfTranzOut('next',"+i+")\"></a></li>";
    }
    swfulli += "</ul>";
    $(".swf-bars").append(swfulli);
    // Hold state for li hovers
    tog = "#"+String(swfCount);
    togNavBars(tog); // auto call after subbar load
    // On click swf-bars-li
    $(".swf-bars-li").on("click", (function(e) {
      tog = "#"+this.id; // from swfNavBars()
      if (tog != lastog){
        togNavBars(tog);// call after click on swfBars
      }
    }));
    // Show names on mouse over, current mouse leave
    $(".swf-bars-li").on("mouseenter", (function(e) {
      $(".swf-bars-txt").html( swfName[ Number(this.id) ].name );
    }));
    $(".swf-bars-li").on("mouseleave", (function(e) {
      $(".swf-bars-txt").html( swfName[ swfCount ].name );
    }));
    $(".swf-bars-txt").html( swfName[ swfCount ].name );
  }
  var togNavBars = function (idnum) { // Toggle if from...
    if ( lastog != undefined) { // subbar, swfBars or next, prev
      $(lastog).removeClass("swf-bars-out");
      $(lastog).addClass("swf-bars-li");
    }
    $(tog).removeClass("swf-bars-li");
    $(tog).addClass("swf-bars-out");
    lastog = tog;
  }
});

var winWidth;
var winHeight;
var clicked;
var topover;
$(document).ready(function() {
  // Init vars for top nav section select, enter and leave animation
  var tog, lastog, subup, blaster, slowenter, slowleave, maincontLeave, maincontEnter;
  //
  // Resize subnav menus
  var winresize = function (){
    winWidth = $(window).width();
    winHeight = $(window).height();
    //if (clicked != undefined){colorBar(true);}// move color bar on resize
    maincontEnter = $("#TopNav").height();
    maincontLeave = -$("#SubAnimate").height() + maincontEnter;
  }
  window.addEventListener("resize", winresize );
  winresize();
  //
  // Top nav animation
  $(".top-nav-li").on("mouseenter",(function(e) {
    slowleave = false;
    slowenter = setTimeout(function (){ //pause before activating
      slowleave = true;
      winresize();
      splashBlast();
      subup = false;
      topover = true;
      if (this.id == "Create") {
        ajaxLoad(
          null, // after load do nothing
          ajaxpath + "/subbar.html", // File to load
          "#SubNavCreate", // ID to retrive from file
          "#SubAnimate" // ID to put into
        );
      } else if (this.id == "Tech") {
        ajaxLoad(
          null,
          ajaxpath + "/subbar.html", //
          "#SubNavTech", //
          "#SubAnimate" //
        );
      } else if (this.id == "About") {
        ajaxLoad(
          null,
          ajaxpath + "/subbar.html", //
          "#SubNavAbout", //
          "#SubAnimate" //
        );
      }
      $("#SubAnimate").css({ transform: "translateX(" + 0 + "px)"}); // Subnav set X to 0
      if (tog && clicked != tog){ // remove last hover if exists
        $(tog).removeClass("top-nav-out");
      }else{
        lastog = tog; // fist pass only, setup for mouseleave
      }
      tog = "#" + this.id; // Add class to new hover
      if (clicked != tog ){
        $(tog).addClass("top-nav-li");
        tranzInOut(clicked, .5); // clicked tab fade to .5
      }
      // Animate open subnav
      $("#MainContainer").velocity({
        translateY: maincontEnter,
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
      winresize();
      topover = false; // global out
      if (e.clientY < maincontEnter) {
        subUp(); // Animate close subnav
      } else { // only add hover if tab is active
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
    blaster = true;
    hoverRemove(); // remove previous active hover
  }));
  //
  // Subnav leave animation
  $("#SubAnimate").on("mouseenter", (function(e) {
    subup = true;
    //topover = true;
  }));
  $("#SubAnimate").on("mouseleave", (function(e) {
    if (blaster) { headBlast(); } // blast section headline if true
    blaster = false;
    //topover = false;
    if (e.clientY > maincontEnter || subup) { // Collaps subnav if mouseY > 75px
      subUp (); // Animate close subnav
    }
  }));
  // Animate close subbar
  var subUp = function ( ){
    hoverRemove(); // remove previous active hover
    $("#MainContainer").velocity({
      translateY: maincontLeave,
    }, {
      queue: false,
      duration: 200,
      easing: "easeInSine",
    });
  }
});
