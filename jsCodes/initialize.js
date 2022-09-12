
$(document).ready(function () {
         var canvas = document.getElementById("myCanvas");
         var categories=[];
         var gameObjects=[];
         var elementPerRound = 20;
         SorterGame = new  SorterGame(canvas, gameObjects, categories, elementPerRound);
           checkUrl();
        loadIntro();
        eventListeners(SorterGame);
  $('[data-toggle="tooltip"]').tooltip();

});

function checkUrl (){
    var filename = window.location.href.split( '?' );
    if (filename.length >1) {
      openOnlineExamlpe (filename[1])
    }
}
function eventListeners (game){
  var stopButton = document.getElementById("stopButton");
  var playButton = document.getElementById ("playButton");
  var editButton = document.getElementById ("editButton");
  var downloadButton = document.getElementById ("downloadButton");
  var designButton = document.getElementById ("designButton");
  var startButton = document.getElementById("startButton");
  var homeButton = document.getElementById("homeButton");
    startButton.addEventListener("click", function (){
      //  game.end();
        game.start();                //initialize lists of elements

    })

   stopButton.addEventListener("click", function (){   game.end();   })
   playButton.addEventListener("click", function (){   game.saveGame(); game.loadPlayMode();   })
   editButton.addEventListener("click", function (){   game.loadDesignMode();   })
   designButton.addEventListener("click", function (){   game.loadDesignMode();   })
   downloadButton.addEventListener("click", function (){   game.createFile();   })
   homeButton.addEventListener("click", function (){   loadIntro();   })
  document.getElementById('loadGame').addEventListener('change', readFile, false);
}

function closeModal (){
  $("#gameOverModal").hide();
}
