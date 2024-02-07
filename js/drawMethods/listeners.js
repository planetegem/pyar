// HTML Elements
const colorWheel = document.getElementById("colorWheel");
const saturationSlider = document.getElementById("saturation");
const lightnessSlider = document.getElementById("lightness");
const opacitySlider = document.getElementById("opacity");
const sizeSlider = document.getElementById("sizeSlider");
const clipSizeSlider = document.getElementById("collageSlider");
const collageCanvas = document.getElementById("collageSelector");
const collageSizeSlider = document.getElementById("collageSizeSlider");

// Canvas elements: cursor canvas is used as overlay to give preview of what you're drawing
const cursorCanvasElement = document.getElementById("cursorCanvas"),
      mainCanvasElement = document.getElementById("workspace");

// MOUSE DOWN & TOUCH START EVENTS
// Color wheel
colorWheel.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - colorWheel.getBoundingClientRect().left,
        mouseY = e.clientY - colorWheel.getBoundingClientRect().top;
    
    e.stopPropagation();
    e.preventDefault();
    
    if (wheelHit(mouseX, mouseY)){
        dragging.active = true;
        dragging.type = "colorWheel";
        angle = findAngle (mouseX, mouseY, wheel.x, wheel.y);
        drawColorWheel();
        quickSave();
    }
});
colorWheel.addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - colorWheel.getBoundingClientRect().left,
        touchY = e.changedTouches[0].clientY - colorWheel.getBoundingClientRect().top;
    
    e.stopPropagation();
    e.preventDefault();
    
    if (wheelHit(touchX, touchY)){
        dragging.active = true;
        dragging.type = "colorWheel";
        angle = findAngle (touchX, touchY, wheel.x, wheel.y);
        drawColorWheel();
        quickSave();
    }
}, { passive: false });

// Color sliders
saturationSlider.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - saturationSlider.getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "sat";
    color.s = calculatePosition(mouseX, saturationSlider)*100;
    
    drawColorWheel();
    drawSlider(saturationSlider, color.s);
    quickSave();
});
saturationSlider.addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - saturationSlider.getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "sat";
    color.s = calculatePosition(touchX, saturationSlider)*100;
    drawColorWheel();
    drawSlider(saturationSlider, color.s);
    quickSave();
}, { passive: false });

lightnessSlider.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - lightnessSlider.getBoundingClientRect().left;

    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "lum";
    color.l = calculatePosition(mouseX, lightnessSlider)*100;
    
    drawColorWheel();
    drawSlider(lightnessSlider, color.l);
    quickSave();
});
lightnessSlider.addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - lightnessSlider.getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "lum";
    color.l = calculatePosition(touchX, lightnessSlider)*100;
    drawColorWheel();
    drawSlider(lightnessSlider, color.l);
    quickSave();
}, { passive: false });

opacitySlider.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - opacitySlider.getBoundingClientRect().left;

    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "opacity";
    color.o = calculatePosition(mouseX, opacitySlider)*100;
    
    drawSlider(opacitySlider, color.o);
    quickSave();
});
opacitySlider.addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - opacitySlider.getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "opacity";
    color.o = calculatePosition(touchX, opacitySlider)*100;
    drawSlider(opacitySlider, color.o);
    quickSave();
}, { passive: false });

// Pen size slider
sizeSlider.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - sizeSlider.getBoundingClientRect().left;

    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "size";
    
    size.temp = calculatePosition(mouseX, sizeSlider);
    drawSizeSlider();
    drawCollageSizeSlider();
    quickSave();
});
sizeSlider.addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - sizeSlider.getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "size";
    
    size.temp = calculatePosition(touchX, sizeSlider);
    drawSizeSlider();
    drawCollageSizeSlider();
    quickSave();
}, { passive: false });

// Same size slider in the collage tool
collageSizeSlider.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - collageSizeSlider.getBoundingClientRect().left;

    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "collageSize";
    
    size.temp = calculatePosition(mouseX, collageSizeSlider);
    drawCollageSizeSlider();
    drawSizeSlider();
    quickSave();
    
});
collageSizeSlider.addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - collageSizeSlider.getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "collageSize";
    
    size.temp = calculatePosition(touchX, collageSizeSlider);
    drawCollageSizeSlider();
    drawSizeSlider();
    
}, { passive: false });


// Collage clip size slider
clipSizeSlider.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - clipSizeSlider.getBoundingClientRect().left;

    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "collageSlider";
    
    size.collageTemp = calculatePosition(mouseX, clipSizeSlider);
    drawCollageSlider();
});
clipSizeSlider.addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - clipSizeSlider.getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();

    dragging.active = true;
    dragging.type = "collageSlider";
    
    size.collageTemp = calculatePosition(touchX, clipSizeSlider);
    drawCollageSlider();

}, { passive: false });

// Collage clip area selector
collageCanvas.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (document.getElementById("collageButton").value === ""){
        document.getElementById("collageButton").click();
    } else if (cropping){
        selectorX = e.clientX - collageCanvas.getBoundingClientRect().left;
        selectorY = e.clientY - collageCanvas.getBoundingClientRect().top;
        
        drawSelector();
        dragging.active = true;
        dragging.type = "collageSelector";
    }
});
collageCanvas.addEventListener("touchstart", (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (document.getElementById("collageButton").value === ""){
        document.getElementById("collageButton").click();
    } else if (cropping){
        selectorX = e.changedTouches[0].clientX - collageCanvas.getBoundingClientRect().left;
        selectorY = e.changedTouches[0].clientY - collageCanvas.getBoundingClientRect().top;
        
        drawSelector();
        dragging.active = true;
        dragging.type = "collageSelector";
    }
}, { passive: false });

// Canvas drawing
window.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - cursorCanvasElement.getBoundingClientRect().left,
        mouseY = e.clientY - cursorCanvasElement.getBoundingClientRect().top;
    
    canvasMouseDown(mouseX, mouseY);
});
mainCanvasElement.addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - cursorCanvasElement.getBoundingClientRect().left,
        touchY = e.changedTouches[0].clientY - cursorCanvasElement.getBoundingClientRect().top;

    e.stopPropagation();
    e.preventDefault();
    
    canvasMouseDown(touchX, touchY);
}, { passive: false });

// MOUSE & TOUCH MOVE EVENTS
// Helper function: checks what you're dragging and then points to the right logic
function checkDragging(clientX, clientY){
    let mouseX, mouseY, canvas, ctx;

    switch (dragging.type){
        case "colorWheel":
            mouseX = clientX - colorWheel.getBoundingClientRect().left,
            mouseY = clientY - colorWheel.getBoundingClientRect().top;
    
            angle = findAngle (mouseX, mouseY, wheel.x, wheel.y);
            drawColorWheel();
            break;

        case "sat":
            mouseX = clientX - saturationSlider.getBoundingClientRect().left;
            color.s = calculatePosition(mouseX, saturationSlider)*100;
    
            drawColorWheel();
            drawSlider(saturationSlider, color.s);
            break;

        case "lum":
            mouseX = clientX - lightnessSlider.getBoundingClientRect().left;
            color.l = calculatePosition(mouseX, lightnessSlider)*100;
        
            drawColorWheel();
            drawSlider(lightnessSlider, color.l);
            break;
        
        case "opacity":
            mouseX = clientX - opacitySlider.getBoundingClientRect().left;
            color.o = calculatePosition(mouseX, opacitySlider)*100;
        
            drawColorWheel();
            drawSlider(opacitySlider, color.o);
            break;

        case "size":
            mouseX = clientX - sizeSlider.getBoundingClientRect().left;

            size.temp = calculatePosition(mouseX, sizeSlider);
            drawSizeSlider();
            drawCollageSizeSlider();
            break;

        case "collageSize":
            mouseX = clientX - collageSizeSlider.getBoundingClientRect().left;

            size.temp = calculatePosition(mouseX, collageSizeSlider);
            drawSizeSlider();
            drawCollageSizeSlider();
            break;

        case "pencil":
            canvas = document.getElementById(drawTool.layer),
            ctx = canvas.getContext("2d"),
            mouseX = clientX - cursorCanvasElement.getBoundingClientRect().left,
            mouseY = clientY - cursorCanvasElement.getBoundingClientRect().top;

            drawPencil(ctx, mouseX, mouseY);
            break;
        
        case "line":
            canvas = cursorCanvasElement,
            ctx = canvas.getContext("2d"),
            mouseX = clientX - cursorCanvasElement.getBoundingClientRect().left,
            mouseY = clientY - cursorCanvasElement.getBoundingClientRect().top;
        
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLine(ctx, mouseX, mouseY);
            break;

        case "eraser":
            canvas = document.getElementById(drawTool.layer),
            ctx = canvas.getContext("2d"),
            mouseX = clientX - cursorCanvasElement.getBoundingClientRect().left,
            mouseY = clientY - cursorCanvasElement.getBoundingClientRect().top;
    
            drawEraser(ctx, mouseX, mouseY);
            break;

        case "collageSelector":
            selectorX = clientX - collageCanvas.getBoundingClientRect().left;
            selectorY = clientY - collageCanvas.getBoundingClientRect().top;
            
            drawSelector();
            break;
        
        case "collage":
            canvas = document.getElementById(drawTool.layer),
            ctx = canvas.getContext("2d"),
            mouseX = clientX - cursorCanvasElement.getBoundingClientRect().left,
            mouseY = clientY - cursorCanvasElement.getBoundingClientRect().top;
                
            if (cropping){
                drawLimitCollage(ctx, mouseX, mouseY);
            } else {
                drawCollage(ctx, mouseX, mouseY);
            }
            break;
        
        case "collageSlider":
            mouseX = clientX - clipSizeSlider.getBoundingClientRect().left;

            size.collageTemp = calculatePosition(mouseX, clipSizeSlider);
            drawCollageSlider();
    }
}

// Movement listeners
window.addEventListener("mousemove", (e) => {
    if (dragging.active) {
        e.preventDefault();

        let mouseX = e.clientX, mouseY = e.clientY;
        checkDragging(mouseX, mouseY);           
    }
    if (drawTool.type !== null){
        let mouseX = e.clientX - cursorCanvasElement.getBoundingClientRect().left,
            mouseY = e.clientY - cursorCanvasElement.getBoundingClientRect().top;

        canvasPreview(mouseX, mouseY);
    }
});
window.addEventListener("touchmove", (e) => {
    if (dragging.active) {
        let touchX = e.e.changedTouches[0].clientX, touchY = e.changedTouches[0].clientY;
        checkDragging(touchX, touchY);        

        e.stopPropagation();
        e.preventDefault();    
    }
}, { passive: false });

// Seperate touch move event for drawing on canvas
mainCanvasElement.addEventListener("touchmove", (e) => {
    let canvas = document.getElementById(drawTool.layer),
        ctx = canvas.getContext("2d"),
        touchX = e.changedTouches[0].clientX - cursorCanvasElement.getBoundingClientRect().left,
        touchY = e.changedTouches[0].clientY - cursorCanvasElement.getBoundingClientRect().top;
    
    if (dragging.active) {
        if (dragging.type === "pencil"){
            drawPencil(ctx, touchX, touchY);
            
        } else if (dragging.type === "line"){
            let canvas = document.getElementById("cursorCanvas"),
                ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLine(ctx, touchX, touchY);
            
        } else if (dragging.type === "eraser"){
            drawEraser(ctx, touchX, touchY);
            
        }
        e.stopPropagation();
        e.preventDefault();
    }
}, { passive: false });

// RELEASE EVENTS
window.addEventListener("mouseup", (e) => {
    if (dragging.type === "line" && dragging.active){
        let canvas = document.getElementById(drawTool.layer),
            ctx = canvas.getContext("2d"),
            mouseX = e.clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
            mouseY = e.clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
        
            drawLine(ctx, mouseX, mouseY);
    }
    dragging.active = false;
    dragging.type = null;
});
window.addEventListener("touchend", (e) => {
    if (dragging.type === "line" && dragging.active){
        let canvas = document.getElementById(drawTool.layer),
            ctx = canvas.getContext("2d"),
            touchX = e.changedTouches[0].clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
            touchY = e.changedTouches[0].clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
        
            drawLine(ctx, touchX, touchY);
    }
    dragging.active = false;
    dragging.type = null;
});

// LOADER & RESIZER LISTENERS
// Helper function: makes copy of canvas before resizing, then pasts resized copy (to avoid resolution loss)
function protectCanvas(canvas){
    canvasBlank = validateCanvas(canvas);
    if (!canvasBlank){
        let backup = canvas.toDataURL("image/png"),
            tempImg = new Image();
            
        tempImg.onload = () => {
            resizeCanvas(canvas);
            canvas.getContext("2d").drawImage(tempImg, 0, 0, canvas.width, canvas.height);
        };
        tempImg.src = backup;
    } else {
        resizeCanvas(canvas);
    }
}
// Helper function: set width & height of canvas
function resizeCanvas(canvas){
    canvas.setAttribute("width", canvas.offsetWidth);
    canvas.setAttribute("height", canvas.offsetHeight);
}
// Resize canvas elements when screen is resized
function resizer(){
    resizeCanvas(document.getElementById("colorWheel"));
    drawColorWheel();
    
    let sliders = document.getElementById("colorOptions").getElementsByClassName("slider");
    for (let slider of sliders){
        resizeCanvas(slider);
    }
    drawSlider(saturationSlider, color.s);
    drawSlider(lightnessSlider, color.l);
    drawSlider(opacitySlider, color.o);

    let mainCanvas = mainCanvasElement.getElementsByClassName("canvas");
    for (let can of mainCanvas){
        protectCanvas(can);
    }
    
    resizeCanvas(sizeSlider);
    drawSizeSlider();
    
    resizeCanvas(collageCanvas);
    resizeCanvas(document.getElementById("collageExample"));
    resizeCanvas(clipSizeSlider);
    drawCollageSlider();
    resizeCanvas(collageSizeSlider);
    drawCollageSizeSlider();
}
window.addEventListener("resize", resizer);
window.addEventListener("load", resizer);