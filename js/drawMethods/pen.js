// HTML elements
const pencilButton = document.getElementById("pencil"),
      lineButton = document.getElementById("line"),
      eraserButton = document.getElementById("eraser"),
      buttons = document.getElementsByClassName("button");

// Helper function: remove active styling from all buttons, then add it to clicked button
function markActive(clicked){    
    for (let button of buttons){
        button.classList.remove("active");
    }
    clicked.classList.add("active");
    quickSave();
}

// Click handlers: work for both touch and mouse
pencilButton.addEventListener("click", () => {
    if (drawTool.type != "pencil"){
        markActive(pencilButton);
        drawTool.type = "pencil";
    } else {
        pencilButton.classList.remove("active");
        drawTool.type = null;
    }
});
lineButton.addEventListener("click", () => {
    if (drawTool.type != "line"){
        markActive(lineButton);
        drawTool.type = "line";
    } else {
        lineButton.classList.remove("active");
        drawTool.type = null;
    }
});
eraserButton.addEventListener("click", () => {
    if (drawTool.type != "eraser"){
        markActive(eraserButton);
        drawTool.type = "eraser";
    } else {
        eraserButton.classList.remove("active");
        drawTool.type = null;
    }
});

// SIZE SLIDER
function drawSizeSlider(){
    let canvas = document.getElementById("sizeSlider"),
        ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(canvas.width*sliderMin, canvas.height/2);
    ctx.lineTo(canvas.width*sliderMax, canvas.height/2);
    ctx.lineWidth = canvas.width*0.010;
    ctx.strokeStyle = "#d4d4d4";
    ctx.stroke();
    
    // SET SLIDER
    let xPos = (size.temp*(sliderMax - sliderMin) + sliderMin)*canvas.width,
        width = canvas.width*0.025,
        height = canvas.height*0.35;
    
    ctx.beginPath();
    ctx.rect(canvas.width*sliderMin, canvas.height/2 - height*0.15, xPos - canvas.width*sliderMin, height*0.30);
    ctx.fillStyle = "#6f6f6f";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(xPos-width, canvas.height/2 - height, width*2, height*2);
    ctx.fillStyle = "#6f6f6f";
    ctx.fill();
    ctx.lineWidth = canvas.width*0.005;
    ctx.strokeStyle = pyarYellow;
    ctx.stroke();

    // CALCULATE REAL SIZE MULTIPLIER
    let sizeMin = 0.2, sizeMax = 8;
    if (size.temp < 0.5){
        size.multiplier = 2*size.temp*(1-sizeMin) + sizeMin;
    } else if (size.temp === 0.5){
        size.multiplier = 1;
    } else if (size.temp > 0.5){
        size.multiplier = 1 + (size.temp*2-1)*(sizeMax-1);
    }
    size.multiplier = size.multiplier.toFixed(2);
    document.getElementById("sizeModifier").innerHTML = "X" + size.multiplier;
    if (drawTool.type === "collage" && cropping){
        drawSelector();
    }
}

// CANVAS DRAW FUNCTIONS
// Draw circle with mouseX & mouseY on the canvas and make preview on the cursor canvas
function drawPencil(ctx, mouseX, mouseY){
    ctx.globalAlpha = color.o*0.01;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, size.pen*size.multiplier, 0, Math.PI*2);
    ctx.fillStyle = "hsl(" + color.h + ", " + color.s + "%," + color.l + "%)";
    ctx.fill();
    ctx.globalAlpha = 1;
}
// Erase specific circle with center mouseX & mouseY from the canvas
function drawEraser(ctx, mouseX, mouseY){
    ctx.save();
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, size.pen*size.multiplier, 0, Math.PI*2);
    ctx.clip();
    ctx.clearRect(0, 0, cursorCanvasElement.width, cursorCanvasElement.height);
    ctx.restore();
}
// Draw line from startX & startY to current mouseX & mouseY
let startX, startY;
function drawLine(ctx, mouseX, mouseY){
    ctx.globalAlpha = color.o*0.01;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(mouseX, mouseY);
    ctx.strokeStyle = "hsl(" + color.h + ", " + color.s + "%," + color.l + "%)";
    ctx.lineWidth = size.line*size.multiplier;
    ctx.stroke();
    ctx.globalAlpha = 1;
}