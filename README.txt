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
the tab title phrases ..... main.js, search:  var T=[document.title
colours ................... style.css, search:  :root


if it breaks
------------
refresh. if it still breaks check the folders are where they should be. if it STILL breaks its probably the js
