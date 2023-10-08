// DRAW MODE SELECTOR

function markActive(clicked){
    let buttons = document.getElementsByClassName("button");
    
    for (let button of buttons){
        button.classList.remove("active");
    }
    clicked.classList.add("active");
}
drawTool.type = null;
document.getElementById("pencil").addEventListener("click", () => {
    if (drawTool.type != "pencil"){
        markActive(document.getElementById("pencil"));
        drawTool.type = "pencil";
    } else {
        document.getElementById("pencil").classList.remove("active");
        drawTool.type = null;
    }
});
document.getElementById("line").addEventListener("click", () => {
    if (drawTool.type != "line"){
        markActive(document.getElementById("line"));
        drawTool.type = "line";
    } else {
        document.getElementById("line").classList.remove("active");
        drawTool.type = null;
    }
});
document.getElementById("eraser").addEventListener("click", () => {
    if (drawTool.type != "eraser"){
        markActive(document.getElementById("eraser"));
        drawTool.type = "eraser";
    } else {
        document.getElementById("eraser").classList.remove("active");
        drawTool.type = null;
    }
});

// COLLAGE LISTENERS
function activateCollage(){
    markActive(document.getElementById("collage"));
    drawTool.type = "collage";
    if (cropping){
        drawSelector();
    }
} 
document.getElementById("collage").addEventListener("click", () => {
    if (drawTool.type != "collage"){
        if (document.getElementById("collageButton").value === ""){
            document.getElementById("collageButton").click();
        } else {
            activateCollage();
        }
    } else {
        document.getElementById("collage").classList.remove("active");
        drawTool.type = null;
    }
});

document.getElementById("crop").addEventListener("change", () => {
    if (document.getElementById("crop").checked){
        let canvas = document.getElementById("collageSelector");

        selectorX = canvas.width/2;
        selectorY = canvas.height/2;
        
        cropping = true;
        
        if (document.getElementById("collageButton").value != ""){
            drawSelector();
        }
        
    } else {
        let canvas = document.getElementById("collageSelector"),
            ctx = canvas.getContext("2d");
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cropping = false;
        
    }
});

let maxFileSize = 3048576;
document.getElementById("collageButton").addEventListener("change", (e) => {
    if (document.getElementById("collageButton").files[0].size > maxFileSize){
        document.getElementById("collageOutput").innerHTML = "file is too big (max 3mb)";
        document.getElementById("collageButton").value = "";
    } else if (document.getElementById("collageButton").files[0].size <= maxFileSize){
        let tempImg = new Image();
        tempImg.onload = () => {
            imageWidth = tempImg.width;
            imageHeight = tempImg.height;
            activateCollage();
        };
        tempImg.src = URL.createObjectURL(document.getElementById("collageButton").files[0]);
        
        let img = document.getElementById("collageExample");
        img.src = URL.createObjectURL(document.getElementById("collageButton").files[0]);
    };
});

document.getElementById("collageSelector").addEventListener("mousedown", (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (document.getElementById("collageButton").value === ""){
        document.getElementById("collageButton").click();
    } else if (cropping){
        selectorX = e.clientX - document.getElementById("collageSelector").getBoundingClientRect().left;
        selectorY = e.clientY - document.getElementById("collageSelector").getBoundingClientRect().top;
        
        drawSelector();
        dragging.active = true;
        dragging.type = "collageSelector";
    }
});

// CANVAS INTERACTION

let dragging = {};
dragging.active = true;
dragging.type = null;

window.addEventListener("mousedown", (e) => {
    let canvas = document.getElementById(drawTool.layer),
        ctx = canvas.getContext("2d"),
        mouseX = e.clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
        mouseY = e.clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
    
    if (drawTool.type === "pencil"){
        drawPencil(ctx, mouseX, mouseY);
        
        dragging.active = true;
        dragging.type = "pencil";
        
    } else if (drawTool.type === "line"){
        startX = e.clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
        startY = e.clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
            
        dragging.active = true;
        dragging.type = "line";
        
    } else if (drawTool.type === "eraser"){
        drawEraser(ctx, mouseX, mouseY);
        
        dragging.active = true;
        dragging.type = "eraser";
        
    } else if (drawTool.type === "collage"){
        dragging.type = "collage";
        dragging.active = true;
        if (cropping){
            drawLimitCollage(ctx, mouseX, mouseY);
        } else {
            drawCollage(ctx, mouseX, mouseY);
        }
    }
});

// MOVEMENT LISTENER
window.addEventListener("mousemove", (e) => {
    if (dragging.active) {
        e.preventDefault();
        if (dragging.type === "colorWheel"){
            let mouseX = e.clientX - document.getElementById("colorWheel").getBoundingClientRect().left,
                mouseY = e.clientY - document.getElementById("colorWheel").getBoundingClientRect().top;
        
            angle = findAngle (mouseX, mouseY, wheel.x, wheel.y);
            colorWheel();
            
        } else if (dragging.type === "sat"){
            let mouseX = e.clientX - document.getElementById("saturation").getBoundingClientRect().left;
            color.s = calculatePosition(mouseX, document.getElementById("saturation"))*100;
        
            colorWheel();
            drawSlider("saturation", color.s);
            
        } else if (dragging.type === "lum"){
            let mouseX = e.clientX - document.getElementById("lightness").getBoundingClientRect().left;
            color.l = calculatePosition(mouseX, document.getElementById("lightness"))*100;
            
            colorWheel();
            drawSlider("lightness", color.l);
            
        } else if (dragging.type === "opacity"){
            let mouseX = e.clientX - document.getElementById("opacity").getBoundingClientRect().left;
            color.o = calculatePosition(mouseX, document.getElementById("opacity"))*100;
            
            colorWheel();
            drawSlider("opacity", color.o);
            
        } else if (dragging.type === "size"){
            let mouseX = e.clientX - document.getElementById("sizeSlider").getBoundingClientRect().left;
    
            size.temp = calculatePosition(mouseX, document.getElementById("sizeSlider"));
            drawSizeSlider();
            
        } else if (dragging.type === "pencil"){
            let canvas = document.getElementById(drawTool.layer),
                ctx = canvas.getContext("2d"),
                mouseX = e.clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
                mouseY = e.clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
    
            drawPencil(ctx, mouseX, mouseY);
            
        } else if (dragging.type === "line"){
            let canvas = document.getElementById("cursorCanvas"),
                ctx = canvas.getContext("2d"),
                mouseX = e.clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
                mouseY = e.clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLine(ctx, mouseX, mouseY);
            
        } else if (dragging.type === "eraser"){
            let canvas = document.getElementById(drawTool.layer),
                ctx = canvas.getContext("2d"),
                mouseX = e.clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
                mouseY = e.clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
    
            drawEraser(ctx, mouseX, mouseY);
            
        } else if (dragging.type === "collageSelector"){
            selectorX = e.clientX - document.getElementById("collageSelector").getBoundingClientRect().left;
            selectorY = e.clientY - document.getElementById("collageSelector").getBoundingClientRect().top;
            
            drawSelector();
            
        } else if (dragging.type === "collage"){
            let canvas = document.getElementById(drawTool.layer),
                ctx = canvas.getContext("2d"),
                mouseX = e.clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
                mouseY = e.clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
                
            if (cropping){
                drawLimitCollage(ctx, mouseX, mouseY);
            } else {
                drawCollage(ctx, mouseX, mouseY);
            }
            
        } else if (dragging.type === "collageSlider"){
            let mouseX = e.clientX - document.getElementById("collageSlider").getBoundingClientRect().left;

            size.collageTemp = calculatePosition(mouseX, document.getElementById("collageSlider"));
            drawCollageSlider();
        }
    }
    
    if (drawTool.type === "pencil"){
        let canvas = document.getElementById("cursorCanvas"),
            ctx = canvas.getContext("2d"),
            mouseX = e.clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
            mouseY = e.clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPencil(ctx, mouseX, mouseY);
        
    } else if (drawTool.type === "line") {
        let canvas = document.getElementById("cursorCanvas"),
            ctx = canvas.getContext("2d"),
            mouseX = e.clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
            mouseY = e.clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
        
        if (!dragging.active){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        let length = Math.min(canvas.width*0.08, Math.max(canvas.width*0.02, size.pen*size.multiplier*0.5));
        
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = "black";
        ctx.lineWidth = size.line*0.25;
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY + length*0.25);
        ctx.lineTo(mouseX, mouseY + length*0.75);
        ctx.moveTo(mouseX, mouseY - length*0.25);
        ctx.lineTo(mouseX, mouseY - length*0.75);
        ctx.moveTo(mouseX + length*0.25, mouseY);
        ctx.lineTo(mouseX + length*0.75, mouseY);
        ctx.moveTo(mouseX - length*0.25, mouseY);
        ctx.lineTo(mouseX - length*0.75, mouseY);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
        
    } else if (drawTool.type === "eraser"){
        let canvas = document.getElementById("cursorCanvas"),
            ctx = canvas.getContext("2d"),
            mouseX = e.clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
            mouseY = e.clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = "black";
        ctx.lineWidth = size.line*0.25;
        ctx.arc(mouseX, mouseY, size.pen*size.multiplier, 0, Math.PI*2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        
    } else if (drawTool.type === "collage"){
        let canvas = document.getElementById("cursorCanvas"),
            ctx = canvas.getContext("2d"),
            mouseX = e.clientX - document.getElementById("cursorCanvas").getBoundingClientRect().left,
            mouseY = e.clientY - document.getElementById("cursorCanvas").getBoundingClientRect().top;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (cropping){
            drawLimitCollage(ctx, mouseX, mouseY);
        } else {
            drawCollage(ctx, mouseX, mouseY);
        }
        ctx.beginPath();
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = "black";
        ctx.lineWidth = size.line*0.25;
        ctx.rect(mouseX - size.pen*size.multiplier, mouseY - size.pen*size.multiplier, size.pen*size.multiplier*2, size.pen*size.multiplier*2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
});

// RESET WHEN LET GO
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

