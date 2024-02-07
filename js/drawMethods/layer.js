let layerNumber = 1, layerMax = 6;

// CLick events: add or select layer
document.getElementById("addLayer").addEventListener("click", addLayer);
document.getElementById("layer1").addEventListener("click", () => {
    clearSelected();
    document.getElementById("layer1").classList.add("selected");
    drawTool.layer = "canvas-" + document.getElementById("layer1").id;
});
function clearSelected(){
    let layers = document.getElementsByClassName("layer");
    for (let layer of layers){
        layer.classList.remove("selected");
    }
}

// Add new layer (as seperate canvas on top of last canvas)
// (When final image is created, all layers are stacked onto each other into a single png)
function addLayer(){
    if (layerNumber < layerMax){
        layerNumber++;
        
        let newCanvas = document.createElement("canvas");
        newCanvas.setAttribute("id", "canvas-layer" + layerNumber);
        newCanvas.classList.add("canvas");
        newCanvas.classList.add("new");
        newCanvas.style.zIndex = layerNumber;
        document.getElementById("workspace").appendChild(newCanvas);
        resizeCanvas(newCanvas);
        
        let newLayer = document.createElement("span");
        newLayer.setAttribute("id", "layer" + layerNumber);
        newLayer.classList.add("new");
        newLayer.classList.add("layer");
        newLayer.innerHTML = "layer " + layerNumber;
        document.getElementById("layers").appendChild(newLayer);
        
        newLayer.addEventListener("click", () => {
            clearSelected();
            newLayer.classList.add("selected");
            drawTool.layer = "canvas-" + newLayer.id;
        });
        clearSelected();
        newLayer.classList.add("selected");
        drawTool.layer = "canvas-" + newLayer.id;
        quickSave();
    }
}
// Clear all layers and reset canvas
function resetLayers(){
    let addedLayers = document.getElementsByClassName("new");
    
    for (let i = addedLayers.length - 1; i >= 0; i--){
        addedLayers[i].remove();
    }
    document.getElementById("layer1").classList.add("selected");
    drawTool.layer = "canvas-" + document.getElementById("layer1").id;
    layerNumber = 1;
    
    let canvas = document.getElementById(drawTool.layer),
        ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}