var ajaxLoad,ajaxpath="/Sites/pf02/public";$(document).ready(function(){ajaxLoad=function(e,t,n,a){var o=t+" "+n;$.get(t,{userId:1234,data:"",cache:!1},function(t){$(a).load(o,function(t){"splash"==e?(setTimeout(splashInit,6e3),polyInit()):"About"==e?genPageTranzIn(n):"Create"==e?introSwf(n):"Tech"==e?genPageTranzIn(n):"Footer"==e&&genPageTranzIn(n)})})}});var headBlast,footerScroll,shuffle,randNum,randColor;$(document).ready(function(){var e=!0;$.Velocity.RegisterUI("headColorIn",{defaultDuration:100,calls:[[{color:"#ffa800"},1,{easing:"easeOutCubic"}]],reset:{color:"#a4dee6"}}),headBlast=function(){$(window).width()>930&&$("h1").blast({delimiter:"character"}).velocity("headColorIn",{stagger:50})},footerScroll=function(){$("#TopNav").velocity("scroll",{duration:1500,easing:"spring"})},shuffle=function(e){for(var t,n,a=e.length;a;t=parseInt(Math.random()*a),n=e[--a],e[a]=e[t],e[t]=n);return e},randNum=function(e,t,n){if(n){t-=e;var a=Math.random()*t+e;return a}t-=e;var a=Math.round(Math.random()*t+e);return a},randColor=function(){for(var e="0123456789ABCDEF",t="#",n=0;6>n;n++)t+=e[Math.round(16*Math.random())];return t},window.addEventListener("resize",function(t){e&&this.innerWidth<768?(e=!1,$("#MainContainer").css({transform:"translateY("+navHeight().sub+"px)"})):!e&&this.innerWidth>768&&(e=!0)},!1)});var introSwf,genPageTranzIn,genPageTranzOut;$(document).ready(function(){var e,t,n="#SplashAjax";introSwf=function(t){if(headBlast(),void 0!=e)"#SwfAutoIntro"==e?(swfOn("next",0),swfNavBars({a:0,b:7})):"#SwfCusIntro"==e?(swfOn("next",8),swfNavBars({a:8,b:13})):"#SwfMediaIntro"==e?(swfOn("next",14),swfNavBars({a:14,b:19})):"#SwfMiscIntro"==e&&(swfOn("next",20),swfNavBars({a:20,b:22})),n=t,e=void 0;else if("#SwfArchIntro"==t)return;$(t).velocity({opacity:1},{duration:1300,easing:"easeOutCubic",complete:function(n){"#SwfAjax"!=t&&(ajaxLoad("Create",ajaxpath+"/swf.html","#SwfAjax","#MainContent"),e=t)}})},genPageTranzIn=function(e){console.log(e),$(e).velocity({opacity:1},{duration:300,easing:"easeInCubic"})},genPageTranzOut=function(e,a,o){$(n).velocity({opacity:0},{duration:300,easing:"easeOutCubic",complete:function(i){"#SplashAjax"==n&&($("#Splash").remove(),splashInit(!0),reMorph(null,null,!0)),"About"==a?(o&&t!==a&&($($(".top-nav-li").get(0)).addClass("top-nav-out"),$($(".top-nav-li").get(0)).triggerHandler("mouseleave"),$("#SubAnimate").trigger("click")),about(e)):"Create"==a?swfIntro(e):"Tech"==a&&tech(e),t=a,n="#"+e}})}});var polyInit,reMorph;$(document).ready(function(){var e,t,n=[],a=[],o={a:0,b:1,c:2,tog:0},i=0,r=70,s=2*r,u=60,l=u/4,d=0,f=0;polyInit=function(){e=SVG("Poly").addClass("svg-poly"),e.size(r*l+r,u/l*s+r),h()};var c=function(t){t%l==0?(0!=t&&f++,d=0):d++;var n=t%2==0?[[r,i],[i,s],[s,s]]:n=[[i,i],[s,i],[r,s]],a="poly-"+String(t),o=e.polygon(n).fill("#152c33").stroke({color:"#a4dee6",opacity:.3,width:1}).move(d*r,f*s).addClass(a).addClass("polygon");return o.animate(20).plot(n),{id:a,pts:n,poly:o}},h=function(){for(var e=0,t=0,i=0;u>i;i++)n.push(c(i)),e+=s,d<Math.floor(l/2)&&(d%l==0&&(t+=s,f%2==0?e=s:(e=s+r,a.push({x:[r,g({m:!0}),g({m:!0}),g({m:!0})],y:[t,g({y:t}),g({y:t}),g({y:t})],xt:!1,yt:!1}))),a.push({x:[e,g({x:e}),g({x:e}),g({x:e})],y:[t,g({y:t}),g({y:t}),g({y:t})],xt:!1,yt:!1}));o.cid=[],n.forEach(function(e){o.cid.push(e.id)}),shuffle(o.cid),o.cid.forEach(function(e,t){m("."+e,t)}),setTimeout(function(){p(3e3)},10)},m=function(e,t){$(e).velocity({opacity:randNum(0,10,!0)/10,fill:randColor()},{duration:randNum(500,1e3),delay:t*randNum(50,200)}).velocity({opacity:randNum(2,10,!0)/10,fill:"#152c33"})},g=function(e){var t;return e.x?t=randNum(e.x-r,e.x+r):e.y?t=randNum(e.y-r,e.y+r):e.m&&(t=randNum(r-r/2,r+r/2)),t},p=function(e){o.dur=e,v(o),t=setTimeout(function(){reMorph(250,8e3)},5e3)};reMorph=function(e,i,r){return r?void clearTimeout(t):(i&&(o.rpt=e),o.dur=randNum(3e3,8e3),0==o.tog?(o.a=1,o.b=2,o.c=3,o.tog=1):(o.a=3,o.b=2,o.c=1,o.tog=0),a.forEach(function(e){e.x[o.b]=g({x:e.x[0]}),e.y[o.b]=g({y:e.y[0]})}),n.forEach(function(e){e.poly.animate(200).plot(e.pts)}),setTimeout(function(){v(o)},100),o.cid.forEach(function(e,t){t%3==0&&m("."+e,t)}),void(t=setTimeout(function(){o.rpt--,0!==o.rpt&&reMorph()},o.dur)))};var v=function(e){for(var t=0,o=2,i=Math.round(l/2),r=0;r<a.length-1;r++){for(var s=0;6>s;s++)w(a[r],n[t],e),t==o?r<a.length-i?t+=l-2:null:t++;t-=r<a.length-i?l+1:3,o+=2}},w=function(e,t,n){for(var a=0;3>a;a++)t.pts[a].forEach(function(t,a){0==a?t==e.x[n.a]?e.xt=!0:e.xt=!1:t==e.y[n.a]?e.yt=!0:e.yt=!1}),e.xt&&e.yt&&(t.pts[a][0]=e.x[n.b],t.pts[a][1]=e.y[n.b],t.poly.animate(n.dur).plot(t.pts),e.x[n.c]=e.x[n.b],e.y[n.c]=e.y[n.b],e.xt=!1,e.yt=!1)}});var splashInit;$(document).ready(function(){ajaxLoad("splash",ajaxpath+"/splash.html","#SplashAjax","#Splash");var e=["WEB","DESIGN","IDEAS","CODE","SHARING","SKILLS","MONEY","LIFE","HEALTH","TRUST","MIND","DESIRE","NEED"];$.Velocity.RegisterUI("splashHeadIn",{defaultDuration:100,calls:[[{color:"#ffa800"},1,{easing:"easeOutCubic"}],[{scale:.7},1,{easing:"easeOutCubic"}]],reset:{color:"#a4dee6",opacity:1}});var t=0;splashInit=function(n){if(n)return clearTimeout(a),void $(".poly-sub-txt",".poly-txt").velocity("stop");$(".poly-txt").blast({delimiter:"character"}).velocity("splashHeadIn",{stagger:100}).velocity({opacity:0},{duration:3e3,delay:500}),$(".poly-sub-txt").text(e[t]),t<e.length-1?t++:t=0;var a=setTimeout(function(){$(".poly-sub-txt").blast({delimiter:"character"}).velocity("splashHeadIn",{stagger:100}).velocity({opacity:0},{duration:3e3,delay:1e3,complete:function(){splashInit()}})},1e3)}});var swfIntro,about,tech;$(document).ready(function(){swfIntro=function(e){ajaxLoad("Create",ajaxpath+"/swfintro.html","#"+e,"#MainContent"),$("#Footer").is(":parent")&&$("#Footer").html("")},about=function(t){ajaxLoad("About",ajaxpath+"/"+t+".html","#"+t,"#MainContent"),"aboutcnt"==t?$("#Footer").html(""):e("footer")},tech=function(t){ajaxLoad("Tech",ajaxpath+"/"+t+".html","#"+t,"#MainContent"),e("footer")};var e=function(e){$("#Footer").is(":empty")&&ajaxLoad("Footer",ajaxpath+"/"+e+".html","#"+e,"#Footer")}});var swfTranzOut,swfOn,swfNavBars;$(document).ready(function(){var t,n="media/swf",a=0,o=!0,i=!0,r=[{name:"Mercedes",url:n+"/merc_160x600.swf",width:"160",height:"600",des:"Clemmenger BBDO, Melbourne","int":"No",size:"23k"},{name:"Mercedes",url:n+"/merc_300x250.swf",width:"300",height:"250",des:"Clemmenger BBDO, Melbourne","int":"No",size:"40k"},{name:"Mercedes",url:n+"/merc_Eclass_300x250.swf",width:"300",height:"250",bg:"#ffffff",des:"Clemmenger BBDO, Melbourne","int":"No",size:"33k"},{name:"Ford Mondeo",url:n+"/ford_120x600_lig.swf",width:"120",height:"600",des:"Wunderman, London","int":"No",size:"29k"},{name:"Ford Mondeo",url:n+"/ford_120x600.swf",width:"120",height:"600",des:"Wunderman, London","int":"No",size:"33k"},{name:"Ford Mondeo",url:n+"/ford_300x250.swf",width:"300",height:"250",des:"Wunderman, London","int":"No",size:"22k"},{name:"Nissan Navara",url:n+"/nissan_300X250.swf",width:"300",height:"250",des:"Untitled, London","int":"No",size:"30k"},{name:"Nissan Navara",url:n+"/nissan_800X600.swf",width:"600",height:"400",des:"Untitled, London","int":"No",size:"980k"},{name:"Waitrose",url:n+"/waitrose_500x300.swf",width:"500",height:"300",des:"Twenty Six, London","int":"Yes",size:"106k"},{name:"Weet-Bix",url:n+"/weetbix_940x660.swf",width:"600",height:"421",bg:"#000000",des:"Sputnik Agency, Melbourne","int":"No",size:"194k"},{name:"Splenda",url:n+"/splenda_300x600_01.swf",width:"300",height:"600",des:"Sputnik Agency, Melbourne","int":"No",size:"36k"},{name:"Splenda",url:n+"/splenda_300x600.swf",width:"300",height:"600",des:"Sputnik Agency, Melbourne","int":"Yes",size:"40k"},{name:"Carlton Draught",url:n+"/carlton_300x250.swf",width:"300",height:"250",des:"Clemmenger BBDO, Melbourne","int":"No",size:"30k"},{name:"Quorn",url:n+"/quorn_300x250.swf",width:"300",height:"250",des:"BWM, Melbourne","int":"No",size:"41k"},{name:"Australian Idol",url:n+"/ausIdol_760x450.swf",width:"600",height:"355",des:"Igloo, Melbourne","int":"Yes",size:"179k"},{name:"Paradise Lost",url:n+"/palmLeafs08.swf",width:"300",height:"250",des:"Green Room, London","int":"No",size:"57k"},{name:"Haven Holidays",url:n+"/haven_300X250.swf",width:"300",height:"250",des:"Souk, London","int":"Yes",size:"78k"},{name:"BMI",url:n+"/bmi_300X250.swf",width:"300",height:250,des:"Twenty Six, London","int":"No",size:"30k"},{name:"TeleWest",url:n+"/elle.swf",width:"300",height:"250",bg:"#ffffff",des:"Twenty Six, London","int":"No",size:"30k"},{name:"ntl",url:n+"/NTL_300x250.swf",width:"300",height:"250",des:"Twenty Six, London","int":"Yes",size:"30k"},{name:"White Pages",url:n+"/whitepages_300x250.swf",width:"300",height:"250",des:"Clemmenger BBDO, Melbourne","int":"Yes",size:"37k"},{name:"PA Consulting",url:n+"/paConsult.swf",width:"600",height:"400",des:"PA Consulting","int":"Yes",size:"106k"},{name:"Save the Children",url:n+"/STC_03.swf",width:"600",height:"450",bg:"#000000",des:"Proximity, London","int":"No",size:"785k"}],s=function(t){if("function"!=typeof fn)return!1;setTimeout(function(){if("undefined"!=typeof e.ref.PercentLoaded&&e.ref.PercentLoaded())var n=setInterval(function(){100===e.ref.PercentLoaded()&&(t(),clearInterval(n))},1500)},200)},u=function(e){return e.success&&e.ref?void s(c()):!1},l=function(e){var t=!1,n=document.getElementById(e);return!n||"OBJECT"!==n.nodeName&&"EMBED"!==n.nodeName||(t=!0),t},d=function(e){var t=document.getElementById(e);if(t){var n=document.createElement("div");t.parentNode.insertBefore(n,t),swfobject.removeSWF(e),n.setAttribute("id",e)}},f=function(e,t){if(l(t)&&d(t),swfobject.hasFlashPlayerVersion("9")){var n={"class":"swf-class"},a="#152c33";e.bg&&(a=e.bg);var o={wmode:"direct",bgcolor:a};swfobject.embedSWF(e.url,t,e.width,e.height,"9",!1,!1,o,n,u)}$(".swf-head").html('<div class="flex-head">'+e.name+"<div>"),$(".swf-text").html('<div class="flex-text">Agency: '+e.des+"<br>Interactive: "+e["int"]+"<br>Size: "+e.size+"</div>")},c=function(){$("#SwfCont").velocity({opacity:1},{duration:300,easing:"easeInCubic",complete:function(e){i=!0}})};swfTranzOut=function(e,t){"next"==e&&a==r.length||"next"==e&&a==r.length-1&&null==t||"prev"==e&&0==a||$("#SwfCont").velocity({opacity:0},{duration:300,easing:"easeOutCubic",complete:function(n){null!=t?swfOn(e,t):(i=!0,swfOn(e,null),h($(".swf-bars-li").get(a)),$(".swf-bars-txt").html(r[a].name))}})},swfOn=function(e,t){if(null!=t&&(a=t,o=!0,i=!0),i){if(!o)if("next"==e)a++;else{if(!(a>0))return o=!0,void(a=0);a--}f(r[a],"SwfCont"),o=!1,i=!1}},swfNavBars=function(e){for(var t='<ul class="swf-bars-ul">',n=0;n<r.length;n++)t+='<li class="swf-bars-li"><a href="#"></a></li>';t+="</ul>",$(".swf-bars").append(t);for(var n=0;n<r.length;n++)if(n>=e.a&&n<=e.b){var o=$(".swf-bars-li").get(n);$(o).css({backgroundColor:"#bffff7"})}h($(".swf-bars-li").get(a)),$(".swf-bars-li").on("click",function(e){a=$(this).index(),swfTranzOut("next",a),h(this)}),$(".swf-bars-li").on("mouseenter",function(e){$(".swf-bars-txt").html(r[$(this).index()].name)}),$(".swf-bars-li").on("mouseleave",function(e){$(".swf-bars-txt").html(r[a].name)}),$(".swf-bars-txt").html(r[a].name)};var h=function(e){t&&$(t).css({backgroundColor:"#bffff7",opacity:.5}),$(e).css({backgroundColor:"#ffa800",opacity:1}),t=e}});var navHeight;$(document).ready(function(){var e,t,n,a,o,i,r,s="#About",u=function(e){ajaxLoad(null,ajaxpath+"/subbar.html",e,"#SubAnimate")};u("#SubNavCreate"),u("#SubNavTech"),u("#SubNavAbout"),navHeight=function(){var e=$("#TopNav").height(),t=-$("#SubAnimate").height()+e;return{top:e,sub:t}},$(".top-nav-li").on("mouseenter",function(e){o=!1,a=setTimeout(function(){o=!0,t=!1,"Create"==this.id?u("#SubNavCreate"):"Tech"==this.id?u("#SubNavTech"):"About"==this.id&&u("#SubNavAbout"),$("#SubAnimate").css({transform:"translateX(0px)"}),l(),s="#"+this.id,r!=s&&($(s).addClass("top-nav-li"),d(r,.5)),$("#MainContainer").velocity({translateY:navHeight().top},{queue:!1,duration:300,easing:"easeOutSine"})}.bind(this),300)}),$(".top-nav-li").on("mouseleave",function(e){clearTimeout(a),o&&(e.pageY<navHeight().top?(i=this.id,a=setTimeout(function(){i=null,f()},300)):(s="#"+this.id,$(s).addClass("top-nav-out")))});var l=function(){d(e,1),r!=s?$(s).removeClass("top-nav-out"):(s!=e&&$(e).removeClass("top-nav-out"),e=s)},d=function(e,t){$(e).velocity({opacity:t},{queue:!1,duration:300})};$("#SubAnimate").on("click",function(e){r=s,n=!0,l()}),$("#SubAnimate").on("mouseenter",function(e){clearTimeout(a),"string"==typeof i&&($("#"+i).addClass("top-nav-out"),i=null),t=!0}),$("#SubAnimate").on("mouseleave",function(e){a=setTimeout(function(){(e.pageY>navHeight().top||t)&&f(),n&&headBlast(),n=!1},300)});var f=function(){l(),$("#MainContainer").velocity({translateY:navHeight().sub},{queue:!1,duration:200,easing:"easeInSine"})}});