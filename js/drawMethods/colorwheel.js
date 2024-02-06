let angle = 0, wheel = {};

// HELPER FUNCTIONS:
// Find angle at which mouse click occurred
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
// Check if click occurred on color wheel or outside
function wheelHit(x, y){
    let distance = (wheel.x - x)*(wheel.x - x) + (wheel.y - y)*(wheel.y - y);
    if (distance < wheel.r*wheel.r && distance > wheel.i*wheel.i){
        return true;
    } else {
        return false;
    }
}
// Calculate real position of mouse click on slider
function calculatePosition(x, canvas){
    let position = (x - canvas.width*sliderMin)/(canvas.width*(sliderMax - sliderMin));
    position = Math.min(1, Math.max(0, position));
    return position;
}
// Fill rgb values based on hsl
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

// DRAW FUNCTIONS
// Draw the color wheel
function drawColorWheel(){
    const canvas = document.getElementById("colorWheel"),
          ctx = canvas.getContext("2d");
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Prepare wheel variables (centerX, centerY, outer radius, inner radius)
    wheel.x = canvas.width * 0.5;
    wheel.y = canvas.height * 0.5;
    wheel.r = canvas.width *0.48;
    wheel.i = wheel.r*0.5;
    
    // Draw shadow underneath wheel
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.r*1.005, 0, 2*Math.PI);
    ctx.fillStyle = "#6f6f6f";
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Draw the wheel itself (colors corrected for saturation and lightness)
    let interval = Math.PI/180;
    for (let i = 0; i < 180; i++){
        ctx.beginPath();
        ctx.fillStyle = "hsl(" + i*2 + ", " + color.s + "%," + color.l + "%)";
        ctx.arc(wheel.x, wheel.y, wheel.r, interval*(i-0.6)*2, interval*(i+0.6)*2, false);
        ctx.lineTo(wheel.x, wheel.y);
        ctx.closePath();
        ctx.fill();
    }

    // Draw inner shadow
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
    
    // Draw selector
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.r + canvas.width*0.005, angle - 0.2, angle + 0.2, false);
    ctx.arc(wheel.x, wheel.y, wheel.i - canvas.width*0.005, angle + 0.2, angle - 0.2, true);
    ctx.closePath();
    ctx.lineWidth = canvas.width*0.015;
    ctx.strokeStyle = "#6f6f6f";
    ctx.stroke();
    
    // Draw shadow underneath selection orb
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.i*0.61, 0, 2*Math.PI);
    ctx.fillStyle = "#6f6f6f";
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Draw selection orb
    color.h = angle*(180/Math.PI);
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.i*0.6, 0, Math.PI*2);
    ctx.fillStyle = "hsl(" + color.h + ", " + color.s + "%," + color.l + "%)";
    ctx.fill();
    outputFields();
}
// Draw sliders
const sliderMin = 0.1,
      sliderMax = 0.9;

function drawSlider(element, value){
    let canvas = element,
        ctx = canvas.getContext("2d");

    // Main line
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(canvas.width*sliderMin, canvas.height/2);
    ctx.lineTo(canvas.width*sliderMax, canvas.height/2);
    ctx.lineWidth = canvas.width*0.010;
    ctx.strokeStyle = "#d4d4d4";
    ctx.stroke();
    
    // Slider
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
// Complete color fields
function outputFields(){
    convertToRgb(color.h, color.s, color.l)
    
    document.getElementById("hue").innerHTML = Math.round(color.h);
    document.getElementById("sat").innerHTML = Math.round(color.s);
    document.getElementById("light").innerHTML = Math.round(color.l);
    document.getElementById("red").innerHTML = color.r;
    document.getElementById("green").innerHTML = color.g;
    document.getElementById("blue").innerHTML = color.b;
}