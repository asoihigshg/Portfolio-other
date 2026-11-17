jackamias.space, but in bits
============================

ok so this used to be one giant file. now its a few smaller ones so an actual human can edit it.
the code is still a mess though. i did not tidy it. you are welcome (or sorry)


what is what
------------
index.html ........ the page. all the words are in here
css/style.css ..... every style. the colours are at the top in :root
js/main.js ........ everything that moves. still messy, still works, dont ask
js/leaf-data.js ... the leaf the plotter draws. its massive. please dont open it
images/ ........... photos. only photo-1.jpg is a real one so far, the rest are placeholders waiting for me to get my act together
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
refresh. if it still breaks check the folders are where they should be. if it STILL breaks its probably the js (sorry)
