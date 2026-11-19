jackamias.space, but in bits
============================

this used to be one giant file. now its split into a few smaller ones so its easier to edit.
the formatting is a bit uneven in places, some parts are dense and some are spread out.


what is what
------------
index.html ........ the page. all the words are in here
css/style.css ..... every style. the colours are at the top in :root
js/main.js ........ everything that moves. the variable names are short
js/leaf-data.js ... the leaf the plotter draws. its a very long list of numbers, no need to open it
images/ ........... photos. only photo-1.jpg is a real one so far, the rest are placeholders
favicon.svg ....... the tiny leaf in the browser tab


how to see it
-------------
double click index.html. thats it. no installing, no build step, no npm, nothing
keep the folders where they are or things break


where to change stuff (use search in your editor)
-------------------------------------------------
the words on the page ..... index.html
my photos ................. main.js, search:  var PHOTOS
                            photo-1.jpg is used for the first one, the rest are placeholders
my music .................. main.js, search:  var TR=
my plotter drawings ....... main.js, search:  var DR=
my tournaments ............ index.html, search:  id="tournaments"
my games .................. index.html, search:  id="playing"
                            its a cartridge case now. every pocket is a <div class="slot">.
                            to add a game, swap the empty <div class="wch"></div> inside a slot for
                              <div class="wch full"><i style="background-image:url(images/NAME.png),linear-gradient(#e9f6fd,#bfe4f6)"></i><b>name</b><small>platform</small></div>
                            (small is optional, it shows on hover and when you pull the cart out)
                            art goes in images/ as png, any box art works, it gets cropped to the label.
                            no file = plain blue label. click a cart to pull it out, click again to blow on it
                            plastic colours cycle by pocket, search: plastic colours (in style.css)
the tab title phrases ..... main.js, search:  var T=[document.title
colours ................... style.css, search:  :root


if it breaks
------------
refresh. if it still breaks check the folders are where they should be. if it STILL breaks its probably the js
the "currently:" phrases ..... main.js, search:  var M =
the tab messages ............. main.js, search:  needy
project stickers ............. index.html, search:  class="stat"
the 404 page ................. 404.html (github pages shows it by itself for pages that dont exist)
konami code, name pokes, lamp bubble, scroll counter, cookie banner and guestbook
.............................. all at the very bottom of main.js
more easter eggs ............. the very last block in main.js (typed words, lamp, cassette, doodles, counter, idle)


new in this version
-------------------
js/extras.js ...... loads after main.js. the lamp character (wanders, dodges, blinks, eyes follow the cursor),
                    the little garden (a leaf per thing found), idle mode (nags, then a screensaver),
                    
proof section ..... index.html, search:  id="proof"  (empty, there is a commented template inside)
misread section ... index.html, search:  id="misread"  (the card wording is a first draft, rewrite freely)
garden ............ extras.js, search:  var DISCOVERIES
idle timings ...... extras.js, search:  var IDLE_STEPS

the lamp (js/extras.js, search:  the lamp is a character now)
-------------------------------------------------------------
moods and faces ........ search:  var MOODS   (neutral, happy, curious, shy, grumpy, sleepy, surprised, squint, relieved, dizzy, tired)
things it visits ....... search:  var VISITS  (a selector and the lines it says when it gets there)
what it says per section search:  SECTION_LINES
you can pick it up ..... drag it. a click still turns the lights on/off
it sleeps if you leave it alone: grumpy at 50s, sleepy at 110s, screensaver at 140s
the face drawing ....... index.html, the <svg> inside id='lamp' (brows, eyes, lids, blush)
the lamp does NOT like bright light: it squints in light mode, scowls when you switch the light on, and is relieved in dark mode.


dialogue (everything that talks now comes out shuffled, so nothing repeats until the whole list has been used)
------------------------------------------------------------------------------------------------------------
the picker .................. main.js, very top: window.nextLine  (extras.js uses it too). give it a list, it gives you a line
lamp click lines ............ main.js, search:  DARKS  /  LIGHTS
tab titles (away / back) .... main.js, search:  needy  /  var back
"currently:" phrases ........ main.js, search:  var M =   (new order every visit, the first one stays first)
fencing button .............. main.js, search:  var P =  (the hits)  and  var F =  (the final line)
cartridge blow .............. main.js, search:  PUFF  /  BLOW   (keep them short, the little screen is tiny)
scroll counter .............. main.js, search:  s0  s25  s60  s90  s100   (one wording per visit)
easter eggs (typed words etc) main.js, the very last block. any list in there goes through nextLine
lamp when it's shy .......... extras.js, search:  SHY_LINES  /  CALM_LINES
lamp visiting things ........ extras.js, search:  var VISITS   (add a line to any list, or add a new { sel, lines })
lamp picked up / dropped .... extras.js, search:  GRAB_LINES  GRAB_MORE  DROP_LINES  DROP_MORE
                              the first four pickups go in order (it's a tiny story), after that it uses the _MORE lists
lamp per section ............ extras.js, search:  SECTION_LINES   (a list means it picks one per visit, a plain string means always that)
idle nudges and screensaver . extras.js, search:  IDLE_STEPS  /  NAGS  /  BACK_LINES
corner hits ................. extras.js, search:  atCorner


the lamp keeps up with the scrolling (js/extras.js, search:  keeping up with the scrolling)
-------------------------------------------------------------------------------------------
scroll and the lamp gets dragged along with the page (it's stuck to it), then it hops back to where it was standing.
scroll fast and it can't keep up: it hangs off the top or bottom edge until you stop, then it hops back in.
scroll a LOT and it runs out of puff. when you stop it slumps, pants, droops its eyes and sweats, then slowly recovers.
tune it ................ search:  SCROLL_STAMINA  (px of scrolling that tires it out completely, smaller = tires faster)
                         search:  TIRED_AT  (how tired it must be when you stop to slump and sweat, 0 to 1.2)
hop size and speed ..... search:  chaseY  in nextHop  (the 150 is the longest hop in px, tired hops are shorter and slower)
what it says ........... search:  CHASE_LINES  /  TIRED_LINES  /  RECOVER_LINES
the sweat drops ........ index.html, class='sweat' inside the lamp svg.  style.css, search:  sweatdrop
it doesn't do any of this with reduced motion on, or while you're holding it or using the keyboard on it
