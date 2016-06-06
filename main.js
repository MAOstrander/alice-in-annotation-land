
var banner = document.getElementById("banner");
var outputSection = document.getElementById("output");
var loadButtons = document.getElementById("load-buttons");
var exportButton = document.getElementById("export");
var saveEditButton = document.getElementById("edit-save");
var editControls = document.getElementById("edit-controls");
var editIndex = document.getElementsByName("index")[0];
var editChars = document.getElementsByName("charseq")[0];
var editCategory = document.getElementsByName("category")[0];
var editStart = document.getElementsByName("START")[0];
var editEnd = document.getElementsByName("END")[0];

var chapterRequest = new XMLHttpRequest();
var annotationRequest = new XMLHttpRequest();
var currentChapter = '';
var annotationArray = [];

function saveAnnotation() {
  console.log("You wanna save", annotationArray[editIndex.value]);

  annotationArray[editIndex.value] = {
    "category": editCategory.value,
    "charseq": editChars.value,
    "START": editStart.value,
    "END": editEnd.value
  }
  applyAllAnnotations(annotationArray);
}

function exportJSON() {
  var exportAll = {
    "document": {
      "created": new Date()
    },
    "annotations": annotationArray
  }
  console.log(exportAll);
}

function selectNote(annotationClicked){
  var clickedWhich = annotationClicked.target.id
  console.log("Clicked on: ", clickedWhich);
  console.log(annotationArray[clickedWhich]);

  editIndex.value = clickedWhich;
  editChars.value = annotationArray[clickedWhich].charseq;
  editCategory.value = annotationArray[clickedWhich].category;
  editStart.value = annotationArray[clickedWhich].START;
  editEnd.value = annotationArray[clickedWhich].END;

}

function applyAllAnnotations(allAnnotations){
  var outputChapter = currentChapter;

  // Loop backwards through all the annotations applying them from the end to the begining
  for (var i = allAnnotations.length - 1; i >= 0; i--) {
    var currentEnd = parseInt(allAnnotations[i].END) + 1;
    var currentStart = parseInt(allAnnotations[i].START);
    var currentCategory = allAnnotations[i].category;

    outputChapter = outputChapter.slice(0, currentEnd) + "</span>" + outputChapter.slice(currentEnd);
    outputChapter = outputChapter.slice(0, currentStart) + `<span id='${i}' class='${currentCategory}'>` + outputChapter.slice(currentStart);
  }
  outputSection.innerHTML = outputChapter;
}

// Borrowed function to convert xml to json from David Walsh
// https://davidwalsh.name/convert-xml-json
xmlToJson = function(xml) {
    var obj = {};
    if (xml.nodeType == 1) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        obj = xml.nodeValue;
    }
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}
// End David Walsh's function


function runAfterRequestLoads(dataEvent) {
  // Quick and dirty export to the DOM
  currentChapter = dataEvent.target.responseText;
  outputSection.innerHTML = currentChapter;

  // Pull the chapter from the response received, replacing the current url with an empty string.
  var whichChapter = dataEvent.target.responseURL.replace(window.location.href, '')

  annotationRequest.open("GET", `${whichChapter}.xml`);
  annotationRequest.send();
}

function ifXMLRequestLoads(XMLdataEvent) {
  // Let the user know that there is info in the console and give controls to modify annotations
  editControls.className = "";
  banner.className = "top-spacer";

  // Convert the XML to a javascript object
  var beforeConversionXML = XMLdataEvent.target.responseXML;
  var convertedXML = xmlToJson(beforeConversionXML);
  var onlyAnnotations = convertedXML.document.span;
  // console.log("convertedXML", convertedXML);

  // Convert the new XML object into a more usable array
  for (var i = 0; i < onlyAnnotations.length; i++){
    annotationArray[i] = {
      "category": onlyAnnotations[i]["@attributes"].category,
      "charseq": onlyAnnotations[i].extent.charseq["#text"],
      "START": onlyAnnotations[i].extent.charseq["@attributes"].START,
      "END": onlyAnnotations[i].extent.charseq["@attributes"].END
    }
    // console.log(annotationArray[i]);
  }
  // Build the initial annotations from converted object
  applyAllAnnotations(annotationArray);
  var spans = document.getElementsByTagName('span');
  for (var j = 0; j < spans.length; j++){
    spans[j].addEventListener("click", selectNote)
  }
}

function errorIfRequestFails(errorData) {
  alert("Sorry, something went wrong with the request", errorData);
}
function ifXMLRequestFails(errorXML) {
  alert("Sorry, something went wrong with the request", errorXML);
}

function loadParticularChapter(clickEvent){
  var loadWhich = clickEvent.target.id;
  if (loadWhich) {
    chapterRequest.open("GET", `${loadWhich}.txt`);
    chapterRequest.send();

  } else {
    console.log("Something went wrong, could not find that chapter");
  }
}

// Event Handlers
loadButtons.addEventListener("click", loadParticularChapter);
saveEditButton.addEventListener("click", saveAnnotation);
exportButton.addEventListener("click", exportJSON);
chapterRequest.addEventListener("load", runAfterRequestLoads);
chapterRequest.addEventListener("error", errorIfRequestFails);
annotationRequest.addEventListener("load", ifXMLRequestLoads);
annotationRequest.addEventListener("error", ifXMLRequestFails);
