// MOBILE BRUSH MENU
document.getElementById("pencilMob").addEventListener("click", () => {
    if (drawTool.type != "pencil"){
        markActive(document.getElementById("pencilMob"));
        drawTool.type = "pencil";
    } else {
        document.getElementById("pencilMob").classList.remove("active");
        drawTool.type = null;
    }
});
document.getElementById("lineMob").addEventListener("click", () => {
    if (drawTool.type != "line"){
        markActive(document.getElementById("lineMob"));
        drawTool.type = "line";
    } else {
        document.getElementById("lineMob").classList.remove("active");
        drawTool.type = null;
    }
});
document.getElementById("eraserMob").addEventListener("click", () => {
    if (drawTool.type != "eraser"){
        markActive(document.getElementById("eraserMob"));
        drawTool.type = "eraser";
    } else {
        document.getElementById("eraserMob").classList.remove("active");
        drawTool.type = null;
    }
});

// MOBILE SIZE SLIDER
function mobSizeSlider(){
    let canvas = document.getElementById("mobSizeSlider"),
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
    let sizeMin = 0.2, sizeMax = 5;
    if (size.temp < 0.5){
        size.multiplier = 2*size.temp*(1-sizeMin) + sizeMin;
    } else if (size.temp === 0.5){
        size.multiplier = 1;
    } else if (size.temp > 0.5){
        size.multiplier = 1 + (size.temp*2-1)*(sizeMax-1);
    }
    size.multiplier = size.multiplier.toFixed(1);
    document.getElementById("mobSizeModifier").innerHTML = "X" + size.multiplier;
    if (drawTool.type === "limitCollage"){
        drawSelector();
    }
}

/* VERTICAL SLIDER
function mobSizeSlider(){
    let canvas = document.getElementById("mobSizeSlider"),
        ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height*sliderMin);
    ctx.lineTo(canvas.width/2, canvas.height*sliderMax);
    ctx.lineWidth = canvas.height*0.010;
    ctx.strokeStyle = "#d4d4d4";
    ctx.stroke();
    
    // SET SLIDER
    let yPos = (size.temp*(sliderMax - sliderMin) + sliderMin)*canvas.height,
        height = canvas.height*0.025,
        width = canvas.width*0.45;
    
    ctx.beginPath();
    ctx.rect(canvas.width/2 - width*0.20, yPos, width*0.40, canvas.height*sliderMax - yPos);
    ctx.fillStyle = "#6f6f6f";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(canvas.width/2 - width, yPos - height, width*2, height*2);
    ctx.fillStyle = "#6f6f6f";
    ctx.fill();
    ctx.lineWidth = canvas.height*0.005;
    ctx.strokeStyle = pyarYellow;
    ctx.stroke();

    // CALCULATE REAL SIZE MULTIPLIER
    size.temp = 1 - size.temp;
    let sizeMin = 0.2, sizeMax = 5;
    if (size.temp < 0.5){
        size.multiplier = 2*size.temp*(1-sizeMin) + sizeMin;
    } else if (size.temp === 0.5){
        size.multiplier = 1;
    } else if (size.temp > 0.5){
        size.multiplier = 1 + (size.temp*2-1)*(sizeMax-1);
    }
    size.multiplier = size.multiplier.toFixed(1);
    document.getElementById("mobSizeModifier").innerHTML = "X" + size.multiplier;
}
function calculatePositionY(y, canvas){
    let position = (y - canvas.height*sliderMin)/(canvas.height*(sliderMax - sliderMin));
    position = Math.min(1, Math.max(0, position));
    return position;
} */

// MOBILE COLOR WHEEL
let mobWheel = {};
function mobColorWheel(){
    const canvas = document.getElementById("mobColorWheel"),
          ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // WHEEL VARIABLES
    mobWheel.x = canvas.width * 0.5;
    mobWheel.y = canvas.height * 0.5;
    mobWheel.r = canvas.width *0.48;
    mobWheel.i = mobWheel.r*0.5;
    
    // DRAW SHADOW
    ctx.beginPath();
    ctx.arc(mobWheel.x, mobWheel.y, mobWheel.r*1.005, 0, 2*Math.PI);
    ctx.fillStyle = "#6f6f6f";
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // DRAW WHEEL
    let interval = Math.PI/180;
    for (let i = 0; i < 180; i++){
        ctx.beginPath();
        ctx.fillStyle = "hsl(" + i*2 + ", " + color.s + "%," + color.l + "%)";
        ctx.arc(mobWheel.x, mobWheel.y, mobWheel.r, interval*(i-0.6)*2, interval*(i+0.6)*2, false);
        ctx.lineTo(mobWheel.x, mobWheel.y);
        ctx.closePath();
        ctx.fill();
    }

    // DRAW SHADOW
    ctx.beginPath();
    ctx.arc(mobWheel.x, mobWheel.y, mobWheel.i, 0, 2*Math.PI);
    ctx.fillStyle = "#6f6f6f";
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.beginPath();
    ctx.arc(mobWheel.x, mobWheel.y, mobWheel.i*0.99, 0, 2*Math.PI);
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // DRAW SELECTOR
    ctx.beginPath();
    ctx.arc(mobWheel.x, mobWheel.y, mobWheel.r + canvas.width*0.005, angle - 0.2, angle + 0.2, false);
    ctx.arc(mobWheel.x, mobWheel.y, mobWheel.i - canvas.width*0.005, angle + 0.2, angle - 0.2, true);
    ctx.closePath();
    ctx.lineWidth = canvas.width*0.015;
    ctx.strokeStyle = "#6f6f6f";
    ctx.stroke();
    
    // DRAW SHADOW
    ctx.beginPath();
    ctx.arc(mobWheel.x, mobWheel.y, mobWheel.i*0.61, 0, 2*Math.PI);
    ctx.fillStyle = "#6f6f6f";
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // DRAW SELECTION
    color.h = angle*(180/Math.PI);
    ctx.beginPath();
    ctx.arc(mobWheel.x, mobWheel.y, mobWheel.i*0.6, 0, Math.PI*2);
    ctx.fillStyle = "hsl(" + color.h + ", " + color.s + "%," + color.l + "%)";
    ctx.fill();
}

// TOUCH EVENT HANDLERS   
function mobWheelHit(x, y){
    let distance = (mobWheel.x - x)*(mobWheel.x - x) + (mobWheel.y - y)*(mobWheel.y - y);
    if (distance < mobWheel.r*mobWheel.r && distance > mobWheel.i*mobWheel.i){
        return true;
    } else {
        return false;
    }
}
document.getElementById("mobColorWheel").addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - document.getElementById("mobColorWheel").getBoundingClientRect().left,
        touchY = e.changedTouches[0].clientY - document.getElementById("mobColorWheel").getBoundingClientRect().top;
    
    e.stopPropagation();
    e.preventDefault();
    
    if (mobWheelHit(touchX, touchY)){
        dragging.active = true;
        dragging.type = "mobColorWheel";
        angle = findAngle (touchX, touchY, mobWheel.x, mobWheel.y);
        mobColorWheel();
    }
}, { passive: false });
document.getElementById("mobSaturation").addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - document.getElementById("mobSaturation").getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "mobSat";
    color.s = calculatePosition(touchX, document.getElementById("mobSaturation"))*100;
    mobColorWheel();
    drawSlider("mobSaturation", color.s);
}, { passive: false });
document.getElementById("mobLightness").addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - document.getElementById("mobLightness").getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "mobLum";
    color.l = calculatePosition(touchX, document.getElementById("mobLightness"))*100;
    colorWheel();
    drawSlider("mobLightness", color.l);
}, { passive: false });
document.getElementById("mobOpacity").addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - document.getElementById("mobOpacity").getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "mobOpacity";
    color.o = calculatePosition(touchX, document.getElementById("mobOpacity"))*100;
    drawSlider("mobOpacity", color.o);
}, { passive: false });

document.getElementById("mobSizeSlider").addEventListener("touchstart", (e) => {
    let touchX = e.changedTouches[0].clientX - document.getElementById("mobSizeSlider").getBoundingClientRect().left;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragging.active = true;
    dragging.type = "mobSize";
    
    size.temp = calculatePosition(touchX, document.getElementById("mobSizeSlider"));
    mobSizeSlider();
}, { passive: false });

window.addEventListener("touchmove", (e) => {
    if (dragging.active) {
        if (dragging.type === "mobColorWheel"){
            let touchX = e.changedTouches[0].clientX - document.getElementById("mobColorWheel").getBoundingClientRect().left,
                touchY = e.changedTouches[0].clientY - document.getElementById("mobColorWheel").getBoundingClientRect().top;
    
            angle = findAngle (touchX, touchY, mobWheel.x, mobWheel.y);
            mobColorWheel();
            
        } else if (dragging.type === "mobSat"){
            let touchX = e.changedTouches[0].clientX - document.getElementById("mobSaturation").getBoundingClientRect().left;
            color.s = calculatePosition(touchX, document.getElementById("mobSaturation"))*100;
        
            mobColorWheel();
            drawSlider("mobSaturation", color.s);
            
        } else if (dragging.type === "mobLum"){
            let touchX = e.changedTouches[0].clientX - document.getElementById("mobLightness").getBoundingClientRect().left;
            color.l = calculatePosition(touchX, document.getElementById("mobLightness"))*100;
            
            mobColorWheel();
            drawSlider("mobLightness", color.l);
            
        } else if (dragging.type === "mobOpacity"){
            let touchX = e.changedTouches[0].clientX - document.getElementById("mobOpacity").getBoundingClientRect().left;
            color.o = calculatePosition(touchX, document.getElementById("mobOpacity"))*100;
            
            drawSlider("mobOpacity", color.o);
            
        } else if (dragging.type === "mobSize"){
            let touchX = e.changedTouches[0].clientX - document.getElementById("mobSizeSlider").getBoundingClientRect().left;
            size.temp = calculatePosition(touchX, document.getElementById("mobSizeSlider"));
            
            mobSizeSlider();
        }
    e.stopPropagation();
    e.preventDefault();    
    }
}, { passive: false });

// CANVAS TOUCH EVENT
document.getElementById("workspace").addEventListener("touchstart", (e) => {
    let canvas = document.getElementById(drawTool.layer),
        ctx = canvas.getContext("2d"),
        touchX = e.changedTouches[0].clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
        touchY = e.changedTouches[0].clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
    
    if (drawTool.type === "pencil"){
        drawPencil(ctx, touchX, touchY);
        
        dragging.active = true;
        dragging.type = "pencil";
        
    } else if (drawTool.type === "line"){
        startX = touchX,
        startY = touchY;
            
        dragging.active = true;
        dragging.type = "line";
        
    } else if (drawTool.type === "eraser"){
        drawEraser(ctx, touchX, touchY);
        
        dragging.active = true;
        dragging.type = "eraser";
    }
    e.stopPropagation();
    e.preventDefault();
}, { passive: false });
document.getElementById("workspace").addEventListener("touchmove", (e) => {
    let canvas = document.getElementById(drawTool.layer),
        ctx = canvas.getContext("2d"),
        touchX = e.changedTouches[0].clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
        touchY = e.changedTouches[0].clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
    
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