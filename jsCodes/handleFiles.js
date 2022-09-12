//document.getElementById('loadGame').addEventListener('change', readFile, false);
// todo load game, fill table
pdfMake.fonts = {
   NotoSans: {
     normal: 'http://etl.ppp.uoa.gr/sorbet/js-libraries/Noto_Sans/NotoSans-Regular.ttf'

   }
}
function openOnlineExamlpe (fname) {
   $("body").css("cursor", "wait");
  fpath = 'examples/' +fname +'.json'
  try{$.get(fpath, function(data) {
                SorterGame.loadGameFile(JSON.parse(data));

           }, "text");
  }
  catch (e) {
    alert ("Ooops! I couldn't open the game with the name: " + fname)
      $("body").css("cursor", "default");
    return 0;
  }
   $("body").css("cursor", "default");
}


function readFile(event){
    var file = event.target.files[0];
  $("body").css("cursor", "wait");
  if (!file) {
      alert("Failed to load file");
        $("body").css("cursor", "default");
  }
  else {
   var r = new FileReader();
   r.onload = function(e) {
     var contents = e.target.result;
     try {var loadedJSON= (JSON.parse (contents))
       console.log (loadedJSON);
       SorterGame.loadGameFile (loadedJSON);
     }
     catch (e) {
       //oldFilesRead (contents)
     }


   }
  r.readAsText(file);
   $("body").css("cursor", "default");
}
}

function downloadScore () {

var playAnswers = SorterGame.getPlayAnswers();
    var scoreModal = document.getElementById("score-modal");
  var categories =[];
  var answers = [];
  for (var i=0; i< SorterGame.categories.length; i++) {
    categories.push(SorterGame.categories[i].text)
  }
  categories.push("unclassified")
  for (var i=0; i< playAnswers.length; i++) {
    var text = "";
    for (var j=0; j<playAnswers[i].answers.length; j++){
      if(playAnswers[i].answers[j].type =="text"){
        text += playAnswers[i].answers[j].text ;
        text +=  ", "
      }

    }
    answers.push(text)

  }
  var dd = {
	content: [
		{text: 'Your Score', style: 'header'},
		{text: scoreModal.innerText, style: 'subheader'},
		'Your Classification',
		{
			style: 'tableExample',
			table: {
				body: [
					categories,
					answers
				]
			}
		},

	],
	styles: {
		header: {
			fontSize: 18,
		//	bold: true,
			margin: [0, 0, 0, 10]
		},
		subheader: {
			fontSize: 16,
			//bold: true,
			margin: [0, 10, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 15]
		},
		tableHeader: {
		//	bold: true,
			fontSize: 13,
			color: 'black'
		}
	},
	defaultStyle: {
	 font: 'NotoSans'
	}

}
pdfMake.createPdf(dd).download();
}
SorterGame.prototype.loadGameFile = function (contents){
  this.gameObjects = contents.gameObjects;
  this.categories = contents.categories;
  this.loadData ();
  this.saveGame();
  this.loadPlayMode();
}

SorterGame.prototype.loadGame = function () {

}

function loadImgFile(evt) {

    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];
	var rowNumber = this.parentNode.parentNode.rowIndex;
	var thumb = this.nextElementSibling;
  if (!f) {
        alert("Failed to load file");
    }
	 else {
      var r = new FileReader();
      r.onload = function(e) {
	     var uri = e.target.result;
       /*var id =   parseInt(SorterGame.dataTable.tBodies[0].rows[rowNumber].cells[0].innerHTML)
		 var newImg = {id: id, imguri: uri}
     var img = myGame.images.find(x=>x.id === id)
     if (img!= undefined)  //image already uploaded for this
      img.imguri = uri;
      else
		 SorterGame.images.push(newImg);*/
		 thumb.src = uri
      }
     r.readAsDataURL(f);
    }
  }
