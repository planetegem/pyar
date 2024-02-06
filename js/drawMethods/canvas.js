// Canvas mouse down: check current draw tool, remember if and what you're dragging
function canvasMouseDown(clientX, clientY){
    let canvas = document.getElementById(drawTool.layer),
        ctx = canvas.getContext("2d");

    if (drawTool.type === "pencil"){
        drawPencil(ctx, clientX, clientY);
            
        dragging.active = true;
        dragging.type = "pencil";
            
    } else if (drawTool.type === "line"){
        startX = clientX;
        startY = clientY;
                
        dragging.active = true;
        dragging.type = "line";
            
    } else if (drawTool.type === "eraser"){
        drawEraser(ctx, clientX, clientY);
            
        dragging.active = true;
        dragging.type = "eraser";
            
    } else if (drawTool.type === "collage"){
        dragging.type = "collage";
        dragging.active = true;
        if (cropping){
            drawLimitCollage(ctx, clientX, clientY);
        } else {
            drawCollage(ctx, clientX, clientY);
        }
    }
}

// Draw preview of what you're drawing on the cursor canvas
function canvasPreview(mouseX, mouseY){
    const ctx = cursorCanvasElement.getContext("2d");

    switch (drawTool.type) {
        case "pencil":
            ctx.clearRect(0, 0, cursorCanvasElement.width, cursorCanvasElement.height);
            drawPencil(ctx, mouseX, mouseY);
            break;
        
        case "line":
            if (!dragging.active){
                ctx.clearRect(0, 0, cursorCanvasElement.width, cursorCanvasElement.height);
            }
            let length = Math.min(cursorCanvasElement.width*0.08, Math.max(cursorCanvasElement.width*0.02, size.pen*size.multiplier*0.5));
            
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

            break;
        
        case "eraser":
            ctx.clearRect(0, 0, cursorCanvasElement.width, cursorCanvasElement.height);
            ctx.beginPath();
            ctx.globalAlpha = 0.2;
            ctx.strokeStyle = "black";
            ctx.lineWidth = size.line*0.25;
            ctx.arc(mouseX, mouseY, size.pen*size.multiplier, 0, Math.PI*2);
            ctx.stroke();
            ctx.globalAlpha = 1;

            break;
        
        case "collage":
            ctx.clearRect(0, 0, cursorCanvasElement.width, cursorCanvasElement.height);
        
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
            break;
    }    
}