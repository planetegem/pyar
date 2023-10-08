let color = {h: 0, s: 100, l: 50, r: 0, g: 0, b: 0, o: 100};
let pyarYellow = "#fff8a3";

// 1. COLOR SELECTOR
let angle = 0, wheel = {};

function findAngle(x, y, centerX, centerY){
    let xPos = x - centerX,
        yPos = centerY - y,
        angle;
    
    if (xPos > 0 && yPos < 0){
        angle = Math.atan(yPos/xPos) + 2*Math.PI;
    } else if (xPos > 0){
        angle = Math.atan(yPos/xPos);
    } else if (xPos < 0){
        angle = Math.atan(yPos/xPos) + Math.PI;
    } else if (xPos === 0){
        angle = y < 0 ? 1.5*Math.PI : 0.5*Math.PI;
    }
    angle = 2*Math.PI - angle;
    return angle;
}
function colorWheel(){
    const canvas = document.getElementById("colorWheel"),
          ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // WHEEL VARIABLES
    wheel.x = canvas.width * 0.5;
    wheel.y = canvas.height * 0.5;
    wheel.r = canvas.width *0.48;
    wheel.i = wheel.r*0.5;
    
    // DRAW SHADOW
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.r*1.005, 0, 2*Math.PI);
    ctx.fillStyle = "#6f6f6f";
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // DRAW WHEEL
    let interval = Math.PI/180;
    for (let i = 0; i < 180; i++){
        ctx.beginPath();
        ctx.fillStyle = "hsl(" + i*2 + ", " + color.s + "%," + color.l + "%)";
        ctx.arc(wheel.x, wheel.y, wheel.r, interval*(i-0.6)*2, interval*(i+0.6)*2, false);
        ctx.lineTo(wheel.x, wheel.y);
        ctx.closePath();
        ctx.fill();
    }

    // DRAW SHADOW
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.i, 0, 2*Math.PI);
    ctx.fillStyle = "#6f6f6f";
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.i*0.99, 0, 2*Math.PI);
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // DRAW SELECTOR
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.r + canvas.width*0.005, angle - 0.2, angle + 0.2, false);
    ctx.arc(wheel.x, wheel.y, wheel.i - canvas.width*0.005, angle + 0.2, angle - 0.2, true);
    ctx.closePath();
    ctx.lineWidth = canvas.width*0.015;
    ctx.strokeStyle = "#6f6f6f";
    ctx.stroke();
    
    // DRAW SHADOW
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.i*0.61, 0, 2*Math.PI);
    ctx.fillStyle = "#6f6f6f";
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // DRAW SELECTION
    color.h = angle*(180/Math.PI);
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.i*0.6, 0, Math.PI*2);
    ctx.fillStyle = "hsl(" + color.h + ", " + color.s + "%," + color.l + "%)";
    ctx.fill();
    outputFields();
}
// 1B. COLOR SLIDERS
let sliderMin = 0.1, sliderMax = 0.9;
function drawSlider(word, value){
    let canvas = document.getElementById(word),
        ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(canvas.width*sliderMin, canvas.height/2);
    ctx.lineTo(canvas.width*sliderMax, canvas.height/2);
    ctx.lineWidth = canvas.width*0.010;
    ctx.strokeStyle = "#d4d4d4";
    ctx.stroke();
    
    // SET SLIDER
    let xPos = ((value/100)*(sliderMax - sliderMin) + sliderMin)*canvas.width,
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
}
// 1C. COLOR OUTPUT FIELDS
function convertToRgb(h, s, l){
    s /= 100;
    l /= 100;
    
    let d = s*(1 - Math.abs(2*l - 1)),
        x = d*(1 - Math.abs((h/60)%2 - 1)),
        m = l - d/2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
        r = d; g = x; b = 0;  
    } else if (60 <= h && h < 120) {
        r = x; g = d; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = d; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = d;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = d;
    } else if (300 <= h && h < 360) {
        r = d; g = 0; b = x;
    }
    color.r = Math.round((r + m) * 255);
    color.g = Math.round((g + m) * 255);
    color.b = Math.round((b + m) * 255);
}
function outputFields(){
    convertToRgb(color.h, color.s, color.l)
    
    document.getElementById("hue").innerHTML = Math.round(color.h);
    document.getElementById("sat").innerHTML = Math.round(color.s);
    document.getElementById("light").innerHTML = Math.round(color.l);
    document.getElementById("red").innerHTML = color.r;
    document.getElementById("green").innerHTML = color.g;
    document.getElementById("blue").innerHTML = color.b;
}

// 1D. MOUSE EVENT CALCULATORS
function wheelHit(x, y){
    let distance = (wheel.x - x)*(wheel.x - x) + (wheel.y - y)*(wheel.y - y);
    if (distance < wheel.r*wheel.r && distance > wheel.i*wheel.i){
        return true;
    } else {
        return false;
    }
}
function calculatePosition(x, canvas){
    let position = (x - canvas.width*sliderMin)/(canvas.width*(sliderMax - sliderMin));
    position = Math.min(1, Math.max(0, position));
    return position;
}
document.getElementById("colorWheel").addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - document.getElementById("colorWheel").getBoundingClientRect().left,
        mouseY = e.clientY - document.getElementById("colorWheel").getBoundingClientRect().top;
    
    e.stopPropagation();
    e.preventDefault();
    
    if (wheelHit(mouseX, mouseY)){
        console.log("test");
        dragging.active = true;
        dragging.type = "colorWheel";
        angle = findAngle (mouseX, mouseY, wheel.x, wheel.y);
        colorWheel();
    }
});
document.getElementById("saturation").addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - document.getElementById("saturation").getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "sat";
    color.s = calculatePosition(mouseX, document.getElementById("saturation"))*100;
    
    colorWheel();
    drawSlider("saturation", color.s);
});
document.getElementById("lightness").addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - document.getElementById("lightness").getBoundingClientRect().left;

    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "lum";
    color.l = calculatePosition(mouseX, document.getElementById("lightness"))*100;
    
    colorWheel();
    drawSlider("lightness", color.l);
});
document.getElementById("opacity").addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - document.getElementById("opacity").getBoundingClientRect().left;

    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "opacity";
    color.o = calculatePosition(mouseX, document.getElementById("opacity"))*100;
    
    drawSlider("opacity", color.o);
});

// 2. SIZE SLIDER
let size = {};
size.multiplier = 1;
size.temp = 0.5;

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
document.getElementById("sizeSlider").addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - document.getElementById("sizeSlider").getBoundingClientRect().left;

    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "size";
    
    size.temp = calculatePosition(mouseX, document.getElementById("sizeSlider"));
    drawSizeSlider();
});

// 3. DRAW TOOLS
let drawTool = {};
drawTool.layer = "canvas-" + "layer1";

// 3A. LAYER MANAGER
let layerNumber = 1,
    layerMax = 6;

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
    }
}
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


// 3B. TOOLS
size.pen = document.getElementById("cursorCanvas").width/25; // BASE SIZE PEN
size.line = document.getElementById("cursorCanvas").width/50; // BASE SIZE LINE TOOL

function drawPencil(ctx, mouseX, mouseY){
    ctx.globalAlpha = color.o*0.01;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, size.pen*size.multiplier, 0, Math.PI*2);
    ctx.fillStyle = "hsl(" + color.h + ", " + color.s + "%," + color.l + "%)";
    ctx.fill();
    ctx.globalAlpha = 1;
}
function drawEraser(ctx, mouseX, mouseY){
    ctx.save();
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, size.pen*size.multiplier, 0, Math.PI*2);
    ctx.clip();
    ctx.clearRect(0, 0, document.getElementById("cursorCanvas").width, document.getElementById("cursorCanvas").height);
    ctx.restore();
}
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

// 4. COLLAGE TOOL
let selectorX, selectorY, imageWidth, imageHeight;

function drawCollage(ctx, mouseX, mouseY){
    let img = document.getElementById("collageExample"),
        imgRadius = size.pen*size.multiplier;
    ctx.drawImage(img, mouseX - imgRadius, mouseY - imgRadius, imgRadius*2, imgRadius*2);
}

// 4B. IMAGE CLIPPER
let cropping = false;

function drawSelector(){
    let canvas = document.getElementById("collageSelector"),
        ctx = canvas.getContext("2d"),
        radius = size.pen*size.collageMultiplier;
    
    // CORRECT X & Y AGAINST CANVAS LIMITS
    if (selectorX + radius > canvas.width){
        selectorX = canvas.width - radius;
    }
    if (selectorX - radius < 0){
        selectorX = radius;
    }
    if (selectorY + radius > canvas.height){
        selectorY = canvas.height - radius;
    }
    if (selectorY - radius < 0){
        selectorY = radius;
    }
    
    // DRAW THE ACTUAL SELECTOR
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = size.line*0.45;
    ctx.rect(selectorX - radius + size.line*0.45, selectorY - radius + size.line*0.45, radius*2 - size.line*0.90, radius*2 - size.line*0.90);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = pyarYellow;
    ctx.rect(selectorX - radius , selectorY - radius, radius*2, radius*2);
    ctx.stroke();
    ctx.globalAlpha = 1;
}
function drawLimitCollage(ctx, mouseX, mouseY){
    let img = document.getElementById("collageExample"),
        paintSize = size.pen*size.multiplier*2,
        imgX = mouseX - paintSize/2,
        imgY = mouseY - paintSize/2,
        selectorWidth = document.getElementById("collageSelector").width,
        selectorHeight = document.getElementById("collageSelector").height,
        ratioX = imageWidth/selectorWidth,
        ratioY = imageHeight/selectorHeight,
        clipX = (selectorX - size.pen*size.collageMultiplier)*ratioX,
        clipY = (selectorY - size.pen*size.collageMultiplier)*ratioY,
        clipSizeX = size.pen*size.collageMultiplier*ratioX*2;
        clipSizeY = size.pen*size.collageMultiplier*ratioY*2;

    ctx.drawImage(img, clipX, clipY, clipSizeX, clipSizeY, imgX, imgY, paintSize, paintSize);
}

// 4C. COLLAGE SIZE ADJUSTER
size.collageMultiplier = 1;
size.collageTemp = 0.5;

function drawCollageSlider(){
    let canvas = document.getElementById("collageSlider"),
        ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(canvas.width*sliderMin, canvas.height/2);
    ctx.lineTo(canvas.width*sliderMax, canvas.height/2);
    ctx.lineWidth = canvas.width*0.010;
    ctx.strokeStyle = "#d4d4d4";
    ctx.stroke();
    
    // SET SLIDER
    let xPos = (size.collageTemp*(sliderMax - sliderMin) + sliderMin)*canvas.width,
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
    let sizeMin = 0.5, sizeMax = 5;
    if (size.collageTemp < 0.5){
        size.collageMultiplier = 2*size.collageTemp*(1-sizeMin) + sizeMin;
    } else if (size.collageTemp === 0.5){
        size.collageMultiplier = 1;
    } else if (size.collageTemp > 0.5){
        size.collageMultiplier = 1 + (size.collageTemp*2-1)*(sizeMax-1);
    }

    if (document.getElementById("collageButton").value !== "" && cropping){
        drawSelector();
    }
}
document.getElementById("collageSlider").addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - document.getElementById("collageSlider").getBoundingClientRect().left;

    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "collageSlider";
    
    size.collageTemp = calculatePosition(mouseX, document.getElementById("collageSlider"));
    drawCollageSlider();
});

// RELIC
function drawLimitCollage2(ctx, mouseX, mouseY){
    let img = document.getElementById("collageExample"),
        imgRadius = size.pen*size.multiplier;
    
    let clipSize = size.pen*size.multiplier*2,
        imgX = mouseX - imgRadius,
        imgY = mouseY - imgRadius,
        clipX = imgX,
        clipY = imgY,
        imgWidth = document.getElementById("collageSelector").width,
        imgHeight = document.getElementById("collageSelector").height;
        
    ctx.drawImage(img, clipX, clipY, imgWidth, imgHeight, imgX, imgY, clipSize, clipSize);
}

