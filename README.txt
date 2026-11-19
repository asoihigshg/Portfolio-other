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
                    and the working demos in the Proof section
proof section ..... index.html, search:  id="proof"
misread section ... index.html, search:  id="misread"  (the card wording is a first draft, rewrite freely)
garden ............ extras.js, search:  var DISCOVERIES
idle timings ...... extras.js, search:  var IDLE_STEPS
