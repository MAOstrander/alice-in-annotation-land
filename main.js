
var outputSection = document.getElementById("output");
var loadButtons = document.getElementById("load-buttons");
var editControls = document.getElementById("edit-controls");

var chapterRequest = new XMLHttpRequest();
var annotationRequest = new XMLHttpRequest();


function runAfterRequestLoads(dataEvent) {
  //quick and dirty export to the DOM
  outputSection.innerHTML = dataEvent.target.responseText
}
function ifXMLRequestLoads(XMLdataEvent) {
  editControls.className = "show"
  console.log("DATA", XMLdataEvent.target.responseText);
}
function errorIfRequestFails(errorData) {
  alert("Sorry, something went wrong with the request", errorData);
}
function ifXMLRequestFails(errorXML) {
  alert("Sorry, something went wrong with the request", errorXML);
}


function loadParticularChapter(event){
  var loadWhich = event.target.id;
  if (loadWhich) {
    chapterRequest.open("GET", `${loadWhich}.txt`);
    chapterRequest.send();

    annotationRequest.open("GET", `${loadWhich}.txt.xml`);
    annotationRequest.send();
  } else {
    console.log("Something went wrong, could not find that chapter");
  }
}

loadButtons.addEventListener("click", loadParticularChapter);
chapterRequest.addEventListener("load", runAfterRequestLoads);
chapterRequest.addEventListener("error", errorIfRequestFails);
annotationRequest.addEventListener("load", ifXMLRequestLoads);
annotationRequest.addEventListener("error", ifXMLRequestFails);
