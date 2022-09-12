
loadIntro = function (){
    $("#introArea").show();
    $("#gameScene").hide();
    $("#designArea").hide();
    $("#playButton").hide();
    $("#downloadButton").hide();
    $("#editButton").hide();
    if (SorterGame!= undefined) {
      SorterGame.setDefaultData();
    }

}
SorterGame.prototype.loadDesignMode = function (){
    $("#introArea").hide();
    $("#gameScene").hide();
    $("#designArea").show();
    $("#playButton").show();
    $("#downloadButton").show();
    $("#editButton").hide();

}

SorterGame.prototype.loadPlayMode = function (){
    $("#introArea").hide();
    $("#gameScene").show();
    $("#designArea").hide();
    $("#playButton").hide();
    $("#downloadButton").show();
    $("#editButton").show();
    $("#stopButton").hide();
    $("#startButton").show();
}


    SorterGame.prototype.clearContainers = function(){
        var c = document.getElementById ("myCanvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, this.width, this.height);
    }



    SorterGame.prototype.processCel = function(cel,gameObjects){
        var typeElement= cel.querySelector(".type");
        var quantity= cel.querySelector(".how-many").value;
        if(quantity==""){
            quantity=1;

        }
        //var type = typeElement[selectedIndex].value;
        if(typeElement!=null){
        var type = typeElement.options[typeElement.selectedIndex].value;
        switch (type){
            case "text":
                gameObjects.push({

                    right: [],
                    text: cel.querySelector(".text-type").value,
                    type: type,
                    num: quantity,
                    used: 0
                })
                console.log("type",type);
                break;
            case "image":
                gameObjects.push({
                    right: [],
                    img: cel.querySelector(".image-thumb").src,
                    type: type,
                    num: quantity,
                    used: 0

                })
                break;
            case "shape":
                gameObjects.push({
                    right: [],
                    selIndex: cel.querySelector(".shape-type").index,
                    type: type,
                    num: quantity,
                    used: 0

                })
                break;

        }
        }
    }

    SorterGame.prototype.processField = function(cel,categories){
        var typeContainer= cel.querySelector(".tableField");
        if(typeContainer!=null) {
            categories.push({

                text: typeContainer.value,
            })

        }
    }


    SorterGame.prototype.processCorrects = function(cel,gameObjects,right){
        var checkboxElement= cel.querySelector(".correct");
        var checked = checkboxElement.checked;
        if(checked==true){
            gameObjects[gameObjects.length-1].right.push(right);
        }

    }


        SorterGame.prototype.saveGame = function(){
            this.playAnswers = [];
            this.categories = [];
            this.gameObjects = [];
            this.dataTableRows = [];
            var gameObjects =[];
            var newgameObjects= [];
            var categories=[];
            var thead = this.dataTableHeader;
            var trsh = thead.getElementsByTagName("tr");
            var tdsh = null;
            tdsh = trsh[0].getElementsByTagName("th");
            if(tdsh!=null) {
                for (var m = 1; m < tdsh.length; m++) {
                    this.processField(tdsh[m], categories);
                }
            }
            var trs = this.dataTable.getElementsByTagName("tr");
            var tds = null;
            for (var i=0; i<trs.length; i++) {
                tds = trs[i].getElementsByTagName("td");
                for (var n=0; n<tds.length;n++)     {
                    if(n==0) {
                        this.processCel(tds[n], gameObjects);
                    }else{
                        this.processCorrects(tds[n], gameObjects,n);
                    }

                }
                }
                for (var q=0; q<gameObjects.length;q++){
                  this.dataTableRows.push(gameObjects[q])
                    for(var j=0;j<gameObjects[q].num;j++){
                        newgameObjects.push(gameObjects[q]);

                }
                }
            this.shapes=[];
            this.gameObjects=newgameObjects;
          //  console.log("gameObjects mesa sto design",gameObjects)
            this.categories=categories;
            var playAnswer;
            for (var i=0; i<categories.length; i++) {
              playAnswer = {category: categories[i].text+": ", answers: []}
              this.playAnswers.push(playAnswer);
            }
            playAnswer =  {category: "Unclassified: ", answers: []}
            this.playAnswers.push (playAnswer)
            this.clear();
            this.fitShapes(categories);
        }

    SorterGame.prototype.createFile = function() {
        this.saveGame();
        var fileName = prompt("Please enter a name for the game:", "name");
        var JSONdata =  { "gameObjects": this.dataTableRows, "categories":this.categories};
        var textToWrite = JSON.stringify (JSONdata);
        const a = document.createElement("a");
        const file = new Blob([textToWrite], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

SorterGame.prototype.clearDataTable = function () {               //clears the dataTable from all rows and columns
  var dt = this.dataTable.tBodies[0]; var headerTable = this.dataTableHeader;
	var tableRows = dt.rows.length;
	for (var i=tableRows-1; i>=0; i--){
		dt.deleteRow(i)
	}
	var tableCells = headerTable.rows[0].cells.length;
	for (var i = tableCells-1; i>0; i--){
		headerTable.rows[0].deleteCell(i)
    this.fields.splice(i, 1)
	}
}
SorterGame.prototype.setDefaultData = function () {   //sets default data to the game (when going back to intro screen)
this.gameObjects =[];
this.categories = [{"text":"Field1"},{"text":"Field2"}]
this.fields = [{name: "ID"}, {name: "Field1"}, {name: "Field2"}];
this.score=0;
this.fieldsCounter=0;
this.idCounter=0;
this.loadData();
}

SorterGame.prototype.loadData = function () {     //loads the data to the dataTable
  this.clearDataTable ();
	for (var i =0; i < this.categories.length ; i++){       //loads the header fields (categories)
	this.addField(this.categories[i].text)
  }
  for (var i =0; i < this.gameObjects.length ; i++){       //loads the rows data (game objects)
    this.newEntry(i, this.gameObjects[i])
  }
}

        SorterGame.prototype.newTh = function(name){     //adds new th in the dataTableHeader
        var newField,th,checkbox,i;
        th = document.createElement('th');

        newField= document.createElement("input");
        newField.type = "text";
        newField.style.width="78%" ;
        newField.style.height="98%";
        newField.value = name;
        newField.className = "tableField";
        //newField.classList.add("container");

       // newField.onchange = function (){SorterGame.updateField(this)};
        th.appendChild (newField);
        checkbox = document.createElement('input');
        checkbox.type="checkbox";
        checkbox.setAttribute('id', this.fieldsCounter-1 +"_check");
        checkbox.onclick=function(){SorterGame.selectField(this);};
        th.appendChild (checkbox);
       /* var sortArrow =  document.createElement('input');
        sortArrow.type= "image";
        sortArrow.src = "media/imgs/sort_des.png";
        sortArrow.onclick = function () {sortCol(this)};
        sortArrow.title = "sort column";
        th.appendChild (sortArrow);
        var spanEl = document.createElement('span');
        var leftArrow =  document.createElement('input');
        leftArrow.type= "image";
        leftArrow.src = "media/imgs/left.png";
        leftArrow.onclick = function () {moveColumnLeft(leftArrow.closest("th"))};
        leftArrow.title = "move to the left";
        spanEl.appendChild (leftArrow);
        var rightArrow =  document.createElement('input');
        rightArrow.type= "image";
        rightArrow.src = "media/imgs/right.png";
        rightArrow.onclick = function () {moveColumnRight(rightArrow.closest("th"))}
        rightArrow.title = "move to the right";
        spanEl.appendChild (rightArrow);
        th.appendChild (spanEl);*/

        return (this.dataTableHeader.rows[0].appendChild(th));
    }

    SorterGame.prototype.addField = function(fieldName){
        //var tr = table.tHead.children[0];
        var th;
      //  var   newName = "Field" + this.fields.length;
        th = this.newTh (fieldName);
        $(th).find("span").children("input").last().css("visibility", "hidden")
        var elem2 = th.previousElementSibling;
        $(elem2).find("span").children("input").last().css("visibility", "visible")
        this.insertNumberCol();
        this.fieldsCounter++;
        fieldrec = {name: fieldName};
        // fieldrec = {name: newName, type: "number", step: '.1'};
        this.fields.push(fieldrec);
        //this.newEntry(this.idCounter);
    }

   SorterGame.prototype.insertNumberCol = function () {
        for (var i=0; i<this.idCounter; i++){
            cel = this.dataTable.tBodies[0].rows[i].insertCell();
            console.log("counter col",this.idCounter);
            fieldBox1 = document.createElement("input");
            fieldBox1.type = "checkbox";
            fieldBox1.classList.add("correct");
            cel.appendChild(fieldBox1);

        }
        console.log("entrys counter:", this.idCounter);

    }

   /* SorterGame.prototype.updateField = function (f){
        var c = f.parentElement.cellIndex;
        var cleanName = replaceSpecialChars (f.value)
        if (checkDoubleName (cleanName)) {
            alert ('You cannot have two fields with the same name!')
            f.value = this.fields[c-1].name
        }
        else {
            f.value = cleanName;
            this.fields[c-1].name = f.value;}
    }*/

    SorterGame.prototype.selectField  = function (cbx){
        var boxes = $(':checkbox:checked',this.dataTableHeader);
        var i;
        for (i=0; i<boxes.length; i ++){
            if (boxes[i]!=cbx)
                boxes[i].checked = false;
        }
        if(cbx.checked){
            field = cbx.parentElement;
            //field.className = "selectedField";
            this.checkId = cbx.id;
            $("#deleteFieldIcon").css('visibility','visible');
          //  $("#settingsIco").css('visibility','visible');
        }
        else {
            this.checkId = -1 		//uncheck
            $("#deleteFieldIcon").css('visibility','hidden');
          //  $("#settingsIco").css('visibility','hidden');
        }
    }

    SorterGame.prototype.deleteField = function  (){

        var boxes = $(':checkbox:checked',this.dataTableHeader);
        if(boxes.lengh===0){
          alert("Please select a category (column) to delete by clicking on its checkox")
        }
        var fieldNo = boxes[0].parentElement.cellIndex;
        this.dataTableHeader.rows[0].deleteCell(fieldNo);
        for (var i=0; i<this.idCounter; i++){
            this.dataTable.tBodies[0].rows[i].deleteCell(fieldNo)

        }
        this.fieldsCounter --;
        this.fields.splice(fieldNo-1, 1);
    }

    SorterGame.prototype.deleteElement = function  (){
      var  table = this.dataTable.tBodies[0];
      var tableRows = table.rows;
      var boxes = $(':checkbox:checked',this.dataTableHeader);
      var i;
      for (i=tableRows.length-1; i>=0; i--){
        box = $(':checkbox:checked',tableRows[i].cells[0] );
        if(box.length>0){
          if (box[0].checked)
            table.deleteRow(i)
          }
      }
        this.idCounter --;
    }

    SorterGame.prototype.newEntry = function (index, values) {       //adds a new Entry (row) in position 'index' and sets each cell's value either to 'values' or to default if values are not passed. Index is a number values is an array of length the number of fields
        var row, cel, fieldbox1, selector, typeofelements, j, i, thumbnail, laodedData, br, sel, table, wrapper, checkox;
        if (values === undefined) {
          values = this.defaultValues;
        }
        try {
            if (index === undefined) {
                index = this.idCounter
            }
        }
        catch (err) {
            console.log(err)
        }
        table = this.dataTable.tBodies[0];
        row = table.insertRow(index);       //insert a new Row
       for (j = 0; j < this.fields.length; j++) {
           cel = row.insertCell(j);
           if(j==0 ){
             switch (values.type) {
              case "image":
                selector= this.createDropDown (0)
                 break;
              case "text":
              selector= this.createDropDown (1)
              break;
              case "shape":
              selector= this.createDropDown (2)
              break;
               default:  selector= this.createDropDown (1)
             }

               wrapper = document.createElement("div");
               wrapper.classList.add("fields-wrapper");
               checkbox = document.createElement('input');
               checkbox.type="checkbox";
               checkbox.style="float:left;"
               checkbox.onclick=function(){SorterGame.selectRow(this);};
               cel.appendChild (checkbox);
               cel.appendChild(selector);
               cel.appendChild(wrapper);
               selector.onchange();

           }else {
               fieldBox1 = document.createElement("input");
               fieldBox1.type = "checkbox";
               fieldBox1.classList.add("correct");
               cel.appendChild(fieldBox1);
           }
       }
        this.setObjectValues (index, values)
        this.idCounter++;
        //console.log("fields in add field are:",this.fields);
      //  console.log("idcounter:",this.idCounter);
    }

    SorterGame.prototype.createDropDown = function (id) {
      var selector = document.createElement("select");
      selector.type = "select";
      selector.classList.add("type");
      typeofelements = document.createElement("option");
      typeofelements.value = "image";
      typeofelements.text = "image";
      selector.options.add(typeofelements, 1);
      typeofelements = document.createElement("option");
      typeofelements.value = "text";
      typeofelements.text = "text";
      selector.options.add(typeofelements, 2);
      typeofelements = document.createElement("option");
      typeofelements.value = "shape";
      typeofelements.text = "shape";
      selector.options.add(typeofelements, 3);
      selector.onchange = function() {
        SorterGame.changeType(this.value,this.parentNode)
      };
      selector.selectedIndex = id;
       return selector;
    }
    SorterGame.prototype.setObjectValues = function (index, objectValues){      //sets the values of cell[index,0]
      var cell, element, quantity, checkbox;
      var table = this.dataTable.tBodies[0];
      var columns = table.rows[index].cells;
      var rightcategories = objectValues.right;
      if (objectValues === undefined) {var er="no values to set"; consloe.log (er); return 0;}
      cell = columns[0];
      switch (objectValues.type) {
        case "text":
          element = cell.getElementsByClassName("text-type")[0];
          element.value = objectValues.text;
          quantity = cell.getElementsByClassName("how-many")[0];
          quantity.value = parseInt(objectValues.num);
          break;
        case "image":
          element = cell.getElementsByClassName("image-thumb")[0];
          element.src = objectValues.img;
          quantity = cell.getElementsByClassName("how-many")[0];
          quantity.value = parseInt(objectValues.num);
          break;
        case "shape":
          element = cell.getElementsByTagName("select")[1];
          element.selectedIndex = objectValues.selIndex;
          quantity = cell.getElementsByClassName("how-many")[0];
          quantity.value = parseInt(objectValues.num);
          break;
        default:
      }
      for (var i=1; i<columns.length; i++) {
        checkbox = columns[i].getElementsByClassName("correct")[0];
        if (rightcategories.includes(i)){
        checkbox.checked = true;}
        else {checkbox.checked = false;}
      }
    }
    SorterGame.prototype.changeType = function (newType,cel){   //cel
        var wrapper = cel.querySelector(".fields-wrapper");
        while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.lastChild);

        }
        switch (newType) {
           case "text":
                var t = document.createElement("input");
                t.type= "text";
                t.textContent = " to: ";
                t.classList.add("text-type");
                wrapper.appendChild(t);
                var to = document.createElement("input");
                to.type = "number"
                to.step = "1"
                to.min = "0";
                to.value="1"
                to.classList.add("how-many");
                wrapper.appendChild(to)
                to.style.width = "30px"
                break;
            case "image":
                var img = document.createElement("input");
                img.type = "file"
                img.addEventListener('change', loadImgFile, false)
		            img.style.width="50px" ;
				        img.style.float="right";
                var thumbnail = document.createElement("img");
                thumbnail.classList.add("image-thumb")
                thumbnail.src = "";
                thumbnail.style.width = "50px";
                thumbnail.style.height = "50px"
                img.classList.add("image-type");
                wrapper.appendChild(img);
                wrapper.appendChild(thumbnail);
                var to = document.createElement("input");
                to.type = "number"
                to.step = "1"
                to.min = "0";
                to.value="1"
                to.classList.add("how-many");
                wrapper.appendChild(to)
                to.style.width = "30px"
                break;
            case "shape":
                var shSelect = document.createElement("select");
                shSelect.type = "select";
                var sh = document.createElement("option");
                sh.classList.add("shape-type");
                sh.value = "text";
                sh.text = "circle";
                shSelect.options.add(sh, 1);
                sh = document.createElement("option");
                sh.value = "text";
                sh.text = "rectangle";
                shSelect.options.add(sh, 2);
                wrapper.appendChild(shSelect);
                var to = document.createElement("input");
                to.type = "number"
                to.step = "1"
                to.min = "0";
                to.value="1"
                to.classList.add("how-many");
                wrapper.appendChild(to)
                to.style.width = "30px"
                break;
            default :
                var children = cel.childNodes;
                console.log("child:", cel.childNodes);
                if (children.length > 3) {
                    cel.removeChild(children [4])
                    cel.removeChild (children [3])
                }

        }

    }

    SorterGame.prototype.deleteField = function  (){

        var boxes = $(':checkbox:checked',this.dataTableHeader);
        var fieldNo = boxes[0].parentElement.cellIndex;
        if (this.fields[fieldNo-1].type == "file"){
            this.images = [];
        }
        this.dataTableHeader.rows[0].deleteCell(fieldNo);
        for (i=0; i<this.idCounter; i++){
            this.dataTable.tBodies[0].rows[i].deleteCell(fieldNo)

        }
        this.fieldsCounter --;
        this.fields.splice(fieldNo-1, 1);
    }
