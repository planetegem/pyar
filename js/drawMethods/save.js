// Save progress feature
const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", () => {
    generateSaveFile();
});

// GENERATE SAVE FILE: PNG TO TXT
function generateSaveFile(){
    
    // Make txt-file of canvas png's, one for every layer; layers are split by '#LAYER' (used when decoding again)
    let pngCompilation;
    for (let i = 1; i <= layerNumber; i++){
        let currentLayer = "canvas-layer" + i,
            copiedCanvas = document.getElementById(currentLayer).toDataURL("image/png");
         
        pngCompilation += "#LAYER" + copiedCanvas;
    }
    // Save the prompt (marked with #PTOMPT for decoding)
    let save = pngCompilation + "#PROMPT" + document.getElementById("targetField").innerHTML;
     
    // Prepare the txt file
    let blob = new Blob([save], { type: "text/plain;charset=utf-8" });
     
    // Allow user to download newly created txt
    let download = document.createElement("a"),
        blobUrl = URL.createObjectURL(blob);
     
    download.download = "pyar.txt";
    download.href = blobUrl;
    download.click();
}

// Load game feature
const loadButton = document.getElementById("loadButton"),
      saveReader = document.getElementById("saveReader");

loadButton.addEventListener("click", () => {
    saveReader.value = "";
    saveReader.click();
});

// When clicking load button, open a file reader
saveReader.addEventListener("change", (e) => {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
        decodeSave(reader.result);
    });
    if (saveReader.files[0].value !== ""){
        reader.readAsText(document.getElementById("saveReader").files[0]);
    }
});

// Decode the txt file and transpose everything to canvas (creating extra layers if necessary)
function decodeSave(string){
    //SEPERATE PROMPT & UPDATE
    let splitSave = string.split("#PROMPT");
    document.getElementById("targetField").innerHTML = splitSave[1];
     
    //SPLIT LAYERS
    let newLayers = splitSave[0].split("#LAYER");
    newLayers.splice(0, 1);
    resetLayers();
     
    for(let i = 0; i < newLayers.length; i++){
        let canvas = document.getElementById(drawTool.layer),
            ctx = canvas.getContext("2d"),
            newLayer = new Image();
         
        newLayer.onload = () => {
            ctx.drawImage(newLayer, 0, 0, canvas.width, canvas.height);
        }
        newLayer.src = newLayers[i];
         
        if (i === newLayers.length - 1){
            continue;
        } else {
            addLayer();
        }
    }
}
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 