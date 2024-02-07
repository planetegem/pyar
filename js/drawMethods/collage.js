let selectorX, selectorY, imageWidth, imageHeight;
let cropping = false;

// DRAW FUNCTIONS
// Draw preview on cursor canvas
function drawCollage(ctx, mouseX, mouseY){
    let img = document.getElementById("collageExample"),
        imgRadius = size.pen*size.multiplier;
    ctx.drawImage(img, mouseX - imgRadius, mouseY - imgRadius, imgRadius*2, imgRadius*2);
}

// If clipping, draw clip area on image preview
function drawSelector(){
    let canvas = document.getElementById("collageSelector"),
        ctx = canvas.getContext("2d"),
        radius = size.pen*size.collageMultiplier;
    
    // Correct x & y value against canvas size
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
    
    // Draw the selector
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
// Draw clip selection on canvas
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

// Slider used for clip area size
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

    // Calculate real size multiplier
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

// SPECIFIC LISTENERS
const collageShortcut = document.getElementById("collage"),
      collageButton = document.getElementById("collageButton"),
      cropCheckbox = document.getElementById("crop");

// Helper function: select collage tool both as shortcut (brush options) and in collage tool interface
function activateCollage(){
    markActive(collageShortcut);
    drawTool.type = "collage";
    if (cropping){
        drawSelector();
    }
}
// Start collage tool from bush options shortcut
collageShortcut.addEventListener("click", () => {
    if (drawTool.type != "collage"){
        if (collageButton.value === ""){
            collageButton.click();
        } else {
            activateCollage();
        }
    } else {
        collageShortcut.classList.remove("active");
        drawTool.type = null;
    }
});
// Listen for activation and deactivation of crop tool
cropCheckbox.addEventListener("change", () => {
    if (cropCheckbox.checked){
        let canvas = document.getElementById("collageSelector");

        selectorX = canvas.width/2;
        selectorY = canvas.height/2;
        
        cropping = true;
        
        if (collageButton.value != ""){
            drawSelector();
        }
        
    } else {
        let canvas = document.getElementById("collageSelector"),
            ctx = canvas.getContext("2d");
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cropping = false;
    }
});
// Load selected image for collage tool
collageButton.addEventListener("change", (e) => {
    let tempImg = new Image();
    tempImg.onload = () => {
        imageWidth = tempImg.width;
        imageHeight = tempImg.height;
        activateCollage();
    };
    tempImg.src = URL.createObjectURL(collageButton.files[0]);
        
    let img = document.getElementById("collageExample");
    img.src = URL.createObjectURL(collageButton.files[0]);
    quickSave();
});

// Collage size slider
function drawCollageSizeSlider(){
    let canvas = document.getElementById("collageSizeSlider"),
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
    document.getElementById("collageSizeModifier").innerHTML = "X" + size.multiplier;
}
