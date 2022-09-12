

// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.

function Shape(x, y, w, h, fill, text) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = fill || '#5F5654';
    this.type = "target";
    this.text = text;
}



// Draws this shape to a given context (rectangle)
Shape.prototype.draw = function(ctx) {
    //console.log(width);
    ctx.fillStyle = this.fill;
    ctx.font = "20px Helvetica";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.fillText(this.text, this.x, this.y-5);
}


// Determine if a point is inside the shape's bounds
Shape.prototype.contains = function(mx, my) {
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
        (this.y <= my) && (this.y + this.h >= my);

}

Shape.prototype.checkCollision = function(objectB) {
  if (this.x <= objectB.x + objectB.w &&
   this.x + this.width >= objectB.x &&
   this.y <= objectB.y + objectB.h &&
   this.y + this.h >= objectB.y) {
    console.log("collision between: " + this.text + " and " + objectB.gameObject_i)
    return true;
}
}


function ShapeImage(x, y, w, h, img, right) {

    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 50;
    this.h = h || 50;
    var shape= this;
    var image= document.createElement('img');
    image.src=img;
    this.img= image;
    this.type = "element";
    this.right = right;
}

ShapeImage.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.drawImage(this.img, this.x, this.y , this.w, this.h);
    ctx.closePath();

}

ShapeImage.prototype.contains = function(mx, my) {
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
        (this.y <= my) && (this.y + this.h >= my);
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Width) and its Y and (Y + Height)
}

function ShapeRectangle(x, y, w, h, fill, right) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = fill || '#AAAAAA';
    this.type = "element";
    this.right = right;
}

ShapeRectangle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y , this.w, this.h, 0, true);
    ctx.fill();
    ctx.closePath();

}

ShapeRectangle.prototype.contains = function(mx, my) {
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
        (this.y <= my) && (this.y + this.h >= my);
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Width) and its Y and (Y + Height)
}

function ShapeCircle(x, y, r, fill, right) {
    this.x = x || 0;
    this.y = y || 0;
    this.r = r || 1;
    this.fill = fill || '#AAAAAA';
    this.type = "element";
    this.right = right;
}


// Draws this shape to a given context (circle)
ShapeCircle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.fill;
    ctx.arc(this.x, this.y , this.r, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();

}

// vriskw an to shmeio einai mesa ston kuklo
ShapeCircle.prototype.contains = function(mx, my) {
    var distancesquared = (mx - this.x) * (mx - this.x) + (my - this.y) * (my - this.y);
    return distancesquared <= this.r* this.r;
}

function ShapeText(x, y, w, fill, right, text) {

    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 150;
    this.fill = fill || '#5F5654';
    this.type = "element";
    this.right = right;
    this.text = text;
}


ShapeText.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.font = "20px Arial";
    ctx.fillText(this.text, this.x, this.y + 30, this.w );
    ctx.fillStyle = this.fill;
    ctx.fill();
    ctx.closePath();
    var measure = ctx.measureText(this.text);
    //this.w=measure.width;
    this.h=30;

}

ShapeText.prototype.contains = function(mx, my) {
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
        (this.y <= my) && (this.y + this.h >= my);
}

function SorterGame(canvas, gameObjects, categories, elementsPerRound) {
    // **** First some setup! ****
    this.score=0;
    this.addElementTimeouts= [];            //gia na mhn vgainoune thn idia stigmh
    this.currentgameObjects = [];
    this.elementsPerRound = elementsPerRound;
    this.gameObjects = gameObjects;
    this.defaultValues = {right: [],text:"sometext",type: "text",num:1}
    this.categories= categories;
    this.playAnswers= [];
    this.defaultColour= 	"#5F5654" //"#72e7ff"
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.dataTable = document.getElementById("datatable");      //for the design table
    this.fields = [{name: "OBJECT"}, {name: "Field1"}, {name: "Field2"}];                                           //for the design table
    this.idCounter=0;
    this.dataTableHeader = document.getElementById("datatable").tHead;
    this.images =[];
    this.fieldsCounter=0;
    //console.log("categories: ",categories);
    //console.log("gameObjects: ",gameObjects)


    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
        this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
        this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
        this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;


    // **** Keep track of state! ****

    this.valid = false; // when set to false, the canvas will redraw everything
    this.shapes = [];  // the collection of things to be drawn
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;
    var myState = this;


    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e) {
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var shapes = myState.shapes;
        var l = shapes.length;
        for (var i = l-1; i >= 0; i--) {
            if (shapes[i].contains(mx, my)) {
                var mySel = shapes[i];
                if (mySel.type=="target"){
                    return;
                }
                // Keep track of where in the object we clicked
                // so we can move it smoothly (see mousemove)
                myState.dragoffx = mx - mySel.x;
               // myState.dragoffy = my - mySel.y;
                myState.dragging = true;

                myState.selection = mySel;
                myState.valid = false;
                return;
            }
        }
        // havent returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        if (myState.selection) {
            myState.selection = null;
            myState.valid = false; // Need to clear the old selection border
        }
    }, true);
    canvas.addEventListener('mousemove', function(e) {
        if (myState.dragging){
            var mouse = myState.getMouse(e);
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
            myState.selection.x = mouse.x - myState.dragoffx;
           // myState.selection.y = mouse.y - myState.dragoffy;
            myState.valid = false; // Something's dragging so we must redraw
        }
    }, true);
    canvas.addEventListener('mouseup', function(e) {
        myState.dragging = false;
    }, true);

    myState.fitShapes(categories);

    // **** Options! ****
    this.selectionWidth = 2;
    this.interval = 30; //30
    this.d=50; //50
    this.containerNumber= categories.length;
    setInterval(function() { myState.draw(); }, myState.interval); //myState.interval
}

SorterGame.prototype.start = function() {
    $("#startButton").hide();
    $("#stopButton").show();
    this.score=0;
    this.currentgameObject = -1;
    this.unusedgameObjects = [];
    this.interval=30;
    for(var i = 0; i<this.gameObjects.length; i++){
        this.unusedgameObjects.push(i);
    }
    for(var i = 0; i<this.playAnswers.length; i++){
        this.playAnswers[i].answers = [];
    }
    this.usedgameObjects = [];
    this.pickManyElements();
    this.updateScore();

}

SorterGame.prototype.stop = function() {
  $("#stopButton").hide();
  $("#startButton").show();
    this.end();
    this.removeElements();
    for(var i =0; i <this.addElementTimeouts.length; i++){
        clearTimeout(this.addElementTimeouts[i]);
    }

}

SorterGame.prototype.ScoreText= function(x,y,color,text){
    this.x=x;
    this.y=y;
    this.text=text;
    var ctx=this.ctx;
    //this.score= score;
    ctx.font = this.width + " " + this.height;
    ctx.fillStyle = color;
    ctx.fillText(this.text, this.x, this.y);

}



SorterGame.prototype.pickManyElements = function() {           //pick gameObject
    var self= this;
    this.totalCurrentgameObjects=0;
    this.currentgameObjects=[];
    this.removeElements();
    for (var i =0 ; i< getRandNumber(Math.min(this.elementsPerRound,this.unusedgameObjects.length)) +1; i++){   //an menoun ligotera apo osa exei kanei pick tha parei tosa osa prepei
        var unusedgameObject = getRandNumber(this.unusedgameObjects.length);
        var currentgameObject = this.unusedgameObjects[unusedgameObject];
        this.currentgameObjects.push(currentgameObject);
        this.unusedgameObjects.splice(unusedgameObject,1);
        this.usedgameObjects.push(this.currentgameObject);
    }
    function addElementClosure (gameObject, gameObject_i) {             // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
       return function() {
           self.addElement(gameObject, gameObject_i);
       }
       }

    for (var j=0; j<this.currentgameObjects.length; j++) {            //drawing gameObject
        var gameObject = this.gameObjects[this.currentgameObjects[j]];
        this.addElementTimeouts.push(setTimeout(addElementClosure(gameObject, j), 1500 * j));    //cancel to timeout
        //console.log("gameObject sto pickmnay",gameObject);
    }
}

SorterGame.prototype.addShape = function(shape) {
    this.shapes.push(shape);
    this.valid = false;
    //return shapes
}

SorterGame.prototype.fitShapes = function(categories){
    var zones = (categories.length*2)+1;
    var zoneSize= this.width/zones;
    for(var z=0; z<categories.length; z+=1){
        this.addShape(new Shape((1 + (z * 2)) * zoneSize, 575, zoneSize, 20, this.defaultColour, categories[z].text));
    }       //260
}



//dhmiourgia addelement gia na ftiaxnoume to gameObject
SorterGame.prototype.addElement = function(gameObject, gameObject_i){
    var canvas = this.canvas;
    var shape = null;
    if(gameObject.type=='circle'){
        shape = new ShapeCircle( getRandNumber(canvas.width-20)+10, 5, 10, '#1E1E75', gameObject.right);
    }else if(gameObject.type=='text'){
        shape = new ShapeText( getRandNumber(canvas.width-100), 5, canvas.width*0.2, '#5F5654', gameObject.right, gameObject.text );
    }
    else if(gameObject.type=='rectangle'){
        shape = new ShapeRectangle( getRandNumber(canvas.width-20)+10, 5, 60, 20, '#1E1E75', gameObject.right);
    }
    else if(gameObject.type=='image'){
        var image = new Image();
        var w,h, maxWidth, maxHeight ;
        maxWidth = Math.round(canvas.width*0.05);
        maxHeight = Math.round(canvas.height*0.08);
        image.src = gameObject.img;
        h = Math.round(image.height);
        w = Math.round(image.width);
        if (h>maxHeight){
          h =  h * Math.min( maxHeight / h);
        }
       if (w>maxWidth){
          w =  w * Math.min( maxWidth / w);
       }
  //  w = 30;
  // h = 30;
        shape = new ShapeImage( getRandNumber(canvas.width-100), 5, w,h, gameObject.img , gameObject.right);
    }
    shape.gameObject_i= gameObject_i;
    this.addShape(shape); //gia na min einai sta oria
}

SorterGame.prototype.removeElement = function(gameObject_i){
    for(var i=0; i<this.shapes.length; i++) {

        if(this.shapes[i].type =='element' && gameObject_i == this.shapes[i].gameObject_i){
            this.shapes.splice(i, 1);
            break;

        }
    }
}

SorterGame.prototype.removeElements = function() {
    var i = this.shapes.length;
    while(i--){
        if(this.shapes[i].type =='element'){
            this.shapes.splice(i, 1);
        }
    }
}

SorterGame.prototype.checkRoundEnd = function() {
    if(this.totalCurrentgameObjects==this.currentgameObjects.length) {       //edw elegxoume an exei teleiwsei to paixnidi
        if (this.unusedgameObjects.length > 0) {      //edw elegxoume an exei teleiwsei o guros
           // this.interval=this.interval*2;          //auksanoume thn taxuthta se kathe guro
            this.pickManyElements();
        } else {
            this.end();
        }
    }

}

SorterGame.prototype.checkElementTarget = function(element) {
    var mystate = this;
    var shapes = this.shapes;
    var l = shapes.length;
    var proceed=false;
    if(element.finish){                         //clears animation
        return;
    }

    for (var i = l - 1; i >= 0; i--) {
        var mySel = shapes[i];
        if (mySel.type == "element") {
            continue;
        }
        if (mySel.contains (element.x, element.y) ) {               //Check if the object hits a category (container)
            if(element.img!=undefined) {
              this.playAnswers[i].answers.push({type:"img", uri: element.img.currentSrc});
            }
            else{
            this.playAnswers[i].answers.push({type:"text", text: element.text});
          }
            for(var k=0; k<=element.right.length;k++) {
                if (element.right[k] == i+1) {   //i = rand value
                    mySel.fill = '#00e600';
                    this.score++;
                    this.updateScore();
                    break;
                } else {
                    mySel.fill = '#CC0000';
                }
            }
            proceed=true;
            element.finish=true;
            this.totalCurrentgameObjects++;
            break;
        }
        else if (element.x > this.width || element.y > this.height ||
            element.x + element.w < 0 || element.y + element.h < 0){          // else check if object is out of bounds
                element.outOfBounds=true;
              //  if(element.outOfBounds && !element.finish){       //object out of bounds = missed object
                    element.finish=true;
                    var length = this.playAnswers.length;
                    if(element.img!=undefined) {
                      this.playAnswers[length-1].answers.push({type:"img", uri: element.img.currentSrc});
                    }
                    else{
                    this.playAnswers[length-1].answers.push({type:"text", text: element.text});
                  }
                    this.totalCurrentgameObjects++;
                    this.checkRoundEnd();
                    return;
          }

    }

    if(proceed==true){
    //this.removeElement(element.gameObject_i);
        setTimeout(function(){
            mySel.fill = mystate.defaultColour;
           // console.log(mystate.totalCurrentgameObjects,mystate.currentgameObjects.length);
        mystate.checkRoundEnd();
        },1000);

    }
}

SorterGame.prototype.updateScore = function() {
    document.getElementById("score").innerHTML=this.score + "/" + this.gameObjects.length;
}


SorterGame.prototype.clear = function() {
    //this.canvas.width = this.canvas.width;
    // Store the current transformation matrix
// Use the identity matrix while clearing the canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
}

SorterGame.prototype.end = function() {
  var playAnswersTable = document.getElementById("playAnswersTable").tBodies;
  var scoreModal = document.getElementById("score-modal");
  var newRow, newCell, text, answer;
  $("#gameOverModal").show();
  $("#stopButton").hide();
  $("#startButton").show();
    this.removeElements();
    for(var i =0; i <this.addElementTimeouts.length; i++){
        clearTimeout(this.addElementTimeouts[i]);
    }
  text = "Correct: " + this.score + " out of " + this.gameObjects.length;
  scoreModal.innerHTML = text;
  text = "";
    if (playAnswersTable.length>0){
    var tableRows = playAnswersTable[0].rows;
  if (tableRows.length>0){
    for (var i=tableRows.length-1; i>=0; i--) {
      playAnswersTable[0].deleteRow(i);
    }
  }
}
  for (var i=0; i<this.playAnswers.length; i++) {
    newRow= playAnswersTable[0].insertRow(i);
    newCell = newRow.insertCell (0);
    newCell.innerHTML = this.playAnswers[i].category;
    newCell = newRow.insertCell (1);
    text = ""
    for (var j=0; j<this.playAnswers[i].answers.length; j++){
      if(this.playAnswers[i].answers[j].type =="text"){
        text = "    " + this.playAnswers[i].answers[j].text;
      newCell.innerHTML +=  text;
      }
      else {
        thumbnail = document.createElement("img");
        thumbnail.src = this.playAnswers[i].answers[j].uri;
        thumbnail.style.width = "40px"
        thumbnail.style.height = "40px"
        newCell.appendChild(thumbnail)
      }

    }
  }

}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
SorterGame.prototype.draw = function() {     //edw mesw tou x,y orizoume tin kinisi
    // if our state is invalid, redraw and validate!
    if (true) {
        var ctx = this.ctx;
        this.clear();
        // ** Add stuff you want drawn in the background all the time here **

        // draw all shapes
        var l = this.shapes.length;
        for (var i = 0; i < l; i++) {
            var shape = this.shapes[i];
            // We can skip the drawing of elements that have moved off the screen:

            if(shape.type=="element"){
              //  if((this.selection!=null)&&(this.selection.gameObject_i == shape.gameObject_i)) { uncomment an theloume na stamataei h kinhsh tou selected element
                 //   if (!this.dragging) {
                        shape.y += this.d / 1000 * this.interval;
                        this.valid = false;

                 //   }
              //  }
                this.checkElementTarget(shape);

            }
            shape.draw(ctx);
        }


        this.valid = true;
    }
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
SorterGame.prototype.getMouse = function(e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
}

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();


SorterGame.prototype.getPlayAnswers = function () {
  return this.playAnswers ;
}
function getRandNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
// Now go make something amazing!
