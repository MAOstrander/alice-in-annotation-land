
var outputSection = document.getElementById("output");
var loadButtons = document.getElementById("load-buttons");
var editControls = document.getElementById("edit-controls");

var chapterRequest = new XMLHttpRequest();
var annotationRequest = new XMLHttpRequest();
var currentChapter = '';

// https://davidwalsh.name/convert-xml-json
// Borrowed function to convert xml to json from David Walsh
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


function applyAllAnnotations(annotationArray){
  console.log("Length of chapter", currentChapter.length);
  console.log("annotationArray", annotationArray);
  for (var i = annotationArray.length - 1; i >= 0; i--) {
    console.log(annotationArray[i].START);
  }
}

function runAfterRequestLoads(dataEvent) {
  // Quick and dirty export to the DOM
  currentChapter = dataEvent.target.responseText;
  outputSection.innerHTML = currentChapter

  // Pull the chapter from the response received, replacing the current url with an empty string.
  var whichChapter = dataEvent.target.responseURL.replace(window.location.href, '')

  annotationRequest.open("GET", `${whichChapter}.xml`);
  annotationRequest.send();
}

function ifXMLRequestLoads(XMLdataEvent) {
  // Let the user know that there is info in the console and give controls to modify annotations
  editControls.className = "show";

  // Convert the XML to a javascript object
  var beforeConversionXML = XMLdataEvent.target.responseXML;
  var convertedXML = xmlToJson(beforeConversionXML);
  var onlyAnnotations = convertedXML.document.span;
  // console.log("convertedXML", convertedXML);

  // Convert the new XML object into a more usable array
  var buildAnnotations = [];
  for (var i = 0; i < onlyAnnotations.length; i++){
    buildAnnotations[i] = {
      "category": onlyAnnotations[i]["@attributes"].category,
      "charseq": onlyAnnotations[i].extent.charseq["#text"],
      "START": onlyAnnotations[i].extent.charseq["@attributes"].START,
      "END": onlyAnnotations[i].extent.charseq["@attributes"].END
    }
    // console.log(buildAnnotations[i]);
  }
  // Build the initial annotations from converted object
  applyAllAnnotations(buildAnnotations);
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
chapterRequest.addEventListener("load", runAfterRequestLoads);
chapterRequest.addEventListener("error", errorIfRequestFails);
annotationRequest.addEventListener("load", ifXMLRequestLoads);
annotationRequest.addEventListener("error", ifXMLRequestFails);
