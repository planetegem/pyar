// 1. GAMESTATE DECISION TREE

document.getElementById("promptRequest").addEventListener("click", () => {
    document.getElementById("targetField").innerHTML = "prompt incoming";
    getPrompt();
    resetLayers();
});
window.addEventListener("load", () => {
    getPrompt();
    evaluate(1000);
});

function shortMenu(){
    document.getElementById("previewImage").style.display = "none";
    document.getElementById("finalCanvasPreview").style.display = "none";
    document.getElementById("submitPrompt").style.display = "none";
    document.getElementById("submitForm").style.display = "none";
    document.getElementById("exitChoices").style.display = "none";
    document.getElementById("exitChoicesFinal").style.display = "flex";
    document.getElementById("visitDB").style.display = "block";
        
    document.getElementById("evaluating").style.display = "none";
    document.getElementById("submitMenu").style.display = "flex";
}
function stateChange(){
    // A. GO TO DRAW SCREEN 
    if (gamestate === "draw"){
        let overlays = document.getElementsByClassName("overlay");
    
        for (let overlay of overlays){
            overlay.style.display = "none";
        }
    }
    // B. GO TO END SCREEN
    if (gamestate === "end"){
        let text = replies.submit;
        text = text.replace("USERNAME", usernameNew);
        document.getElementById("conclusion").innerHTML = text;
        document.getElementById("nextPromptLabel").innerHTML = "next prompt";
        document.getElementById("submitHeader").innerHTML = "automatic confirmation";
        
        shortMenu();
    }
    // C. GO TO BLANK SCREEN
    if (gamestate === "blank"){
        document.getElementById("conclusion").innerHTML = replies.empty;
        document.getElementById("nextPromptLabel").innerHTML = "start drawing";
        document.getElementById("submitHeader").innerHTML = "automatic refusal";
            
        shortMenu();
    }
    // D. GO TO SUBMIT FORM
    if (gamestate === "submit"){
        let randomIndex = Math.floor(Math.random()*conclusion.length);
        
        document.getElementById("conclusion").innerHTML = conclusion[randomIndex];
        document.getElementById("submitPrompt").innerHTML = '"' + document.getElementById("targetField").innerHTML + '"';
        document.getElementById("submitHeader").innerHTML = "automatic report";
        
        document.getElementById("previewImage").style.display = "block";
        document.getElementById("finalCanvasPreview").style.display = "block";
        document.getElementById("submitPrompt").style.display = "block";
        document.getElementById("submitForm").style.display = "flex";
        document.getElementById("exitChoices").style.display = "flex";
        document.getElementById("exitChoicesFinal").style.display = "none";
        
        document.getElementById("evaluating").style.display = "none";
        document.getElementById("submitMenu").style.display = "flex";
        document.getElementById("username").value = username;
    }
    // E. IN CASE OF ERROR
    if (gamestate === "error"){
        document.getElementById("conclusion").innerHTML = phpError;
        document.getElementById("submitHeader").innerHTML = "error report";
            
        shortMenu();
    }
    // F. START SCREEN
    if (gamestate === "start"){
        document.getElementById("evaluating").style.display = "none";
        document.getElementById("captcha").style.display = "flex";
    }
    // G. TUTORIAL SCREEN
    if (gamestate === "tutorial"){
        document.getElementById("conclusion").innerHTML = replies.tutorial;
        document.getElementById("nextPromptLabel").innerHTML = "start drawing";
        document.getElementById("submitHeader").innerHTML = "automatic acceptance";
        shortMenu();
        
        document.getElementById("visitDB").style.display = "none";
    }
}

// 2. LOAD SCREEN
let duration, animationStart, currentAnimationFrame;

function evaluate(loadtime){
    let overlays = document.getElementsByClassName("overlay");
    
    for (let overlay of overlays){
        overlay.style.display = "none";
    }
    document.getElementById("overlay").style.display = "block";
    document.getElementById("evaluating").style.display = "flex";
    
    duration = loadtime;
    
    let buttons = document.getElementsByClassName("button");
    for (let button of buttons){
        button.classList.remove("active");
    }
    drawTool.type = null;
    
    animationStart = Date.now();
    cancelAnimationFrame(currentAnimationFrame);
    currentAnimationFrame = requestAnimationFrame(animateEval);
}
function animateEval(){
    let runtime = Date.now() - animationStart,
        currentStep = Math.floor(runtime/400),
        text = "evaluating";
    
    if (currentStep >= 5){
        currentStep %= 5;
    }
    for (let i = 0; i < currentStep; i++){
        text += ".";
    }
    document.getElementById("evalText").innerHTML = text;
    document.getElementById("cog").style.transform = "rotate(" + runtime/45 + "deg)";
    
    if (runtime < duration || constructingPrompt){
        currentAnimationFrame = requestAnimationFrame (animateEval);
    } else {
        cancelAnimationFrame(currentAnimationFrame);
        stateChange();
    }
}

// 3. SUBMIT SCREEN 
let createdImage, canvasBlank;

function validateCanvas(canvas){
    let blankCanvas = document.createElement("canvas");
    blankCanvas.width = canvas.width;
    blankCanvas.height = canvas.height;
    return canvas.toDataURL() === blankCanvas.toDataURL();   
}
document.getElementById("submitButton").addEventListener("click", () => {
    gamestate = "submit";
    
    // COMBINE ALL LAYERS FOR FINAL IMAGE
    let canvas = document.getElementById("final-canvas"),
        ctx = canvas.getContext("2d");
    
    for (let i = 1; i <= layerNumber; i++){
        let currentLayer = "canvas-layer" + i,
            copiedCanvas = document.getElementById(currentLayer);
        
        ctx.drawImage(copiedCanvas, 0, 0);
    }
    
    // CHECK IF BLANK
    canvasBlank = validateCanvas(canvas);
    if (canvasBlank){
        gamestate = "blank";
    }
    
    // ATTACH FINAL IMAGE TO SUBMIT FORM
    createdImage = canvas.toDataURL("image/png");
    document.getElementById("finalCanvasPreview").src = createdImage;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // START EVALUATION SCREEN
    evaluate(5000);
});


//1C. SUBMIT SCREEN BUTTONS
function cancelSubmit(){
    if(document.getElementById("username").value !== ""){
        username = document.getElementById("username").value;
    }
    gamestate = "draw";
    stateChange();
}
document.getElementById("cancelSubmit").addEventListener("click", cancelSubmit);
document.getElementById("nextPrompt").addEventListener("click", cancelSubmit);
document.getElementById("restartButton").addEventListener("click", () => {
    getPrompt();
    resetLayers();
    cancelSubmit();
});

document.getElementById("download").addEventListener("click", () => {
    let download = document.createElement("a");
    
    let filename = document.getElementById("targetField").innerHTML;
    filename = filename.replace(/ /g,"_");
    filename = filename.replace(/\,/g,"_");

    download.download = filename;
    download.href = document.getElementById("finalCanvasPreview").src;
    download.click();
});

function isAlphanumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}
document.getElementById("submitImageFinal").addEventListener("click", () => {
    // DOWNSIZE CANVAS PNG AND ATTACH TO FORM
    let image = document.getElementById("finalCanvasPreview");
        canvas = document.getElementById("downsizer");
        ctx = canvas.getContext("2d");
    
    canvas.setAttribute("width", "450");
    canvas.setAttribute("height", "450");
    
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    document.getElementById("sendImage").value = canvas.toDataURL("image/png");
    
    // ATTACH PROMPT TO FORM
    let prompt = document.getElementById("targetField").innerHTML;
    prompt = prompt.replace(/ /g,"_");
    prompt = prompt.replace(/\,/g,"_");
    document.getElementById("sendPrompt").value = prompt;
    
    // MORPH USERNAME
    if (document.getElementById("username").value === ""){
        document.getElementById("username").value = "anonymous";
    }
    let username = document.getElementById("username").value,
        randomIndex = Math.floor(Math.random()*(morphTable.length));
        
    username = username.toLowerCase();
    if (morphTable[randomIndex].type === "suffix"){
        let lastLetter = username.charAt(username.length-1),
            firstLetter = morphTable[randomIndex].name.charAt(0);
        
        if (isAlphanumeric(lastLetter) && lastLetter === firstLetter){
            username += "-";
        }
        username += morphTable[randomIndex].name;
    } else if (morphTable[randomIndex].type === "prefix"){
        let firstLetter = username.charAt(0),
            lastLetter = morphTable[randomIndex].name.charAt(morphTable[randomIndex].name.length-1);
        
        if (isAlphanumeric(firstLetter) && lastLetter === firstLetter){
            username = "-" + username;
        }
        username = morphTable[randomIndex].name + username;
        
    } else if (morphTable[randomIndex].type === "suffixnumber"){
        let random = Math.floor(Math.random()*15);
        username += morphTable[randomIndex].name + random;
    }
    document.getElementById("usernameNew").value = username;

    document.getElementById("imageFormSubmit").click();
});

// LOADERS
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
function resizeCanvas(canvas){
    canvas.setAttribute("width", canvas.offsetWidth);
    canvas.setAttribute("height", canvas.offsetHeight);
}
function resizer(){
    resizeCanvas(document.getElementById("colorWheel"));
    colorWheel();
    
    let sliders = document.getElementById("colorOptions").getElementsByClassName("slider");
    for (let slider of sliders){
        resizeCanvas(slider);
    }
    drawSlider("saturation", color.s);
    drawSlider("lightness", color.l);
    drawSlider("opacity", color.o);

    let mainCanvas = document.getElementById("workspace").getElementsByClassName("canvas");
    for (let can of mainCanvas){
        protectCanvas(can);
    }
    
    resizeCanvas(document.getElementById("sizeSlider"));
    drawSizeSlider();
    
    resizeCanvas(document.getElementById("collageSelector"));
    resizeCanvas(document.getElementById("collageExample"));
    resizeCanvas(document.getElementById("collageSlider"));
    drawCollageSlider();
    
    resizeCanvas(document.getElementById("mobSizeSlider"));
    mobSizeSlider();
    resizeCanvas(document.getElementById("mobColorWheel"));
    mobColorWheel()
    
    resizeCanvas(document.getElementById("mobOpacity"));
    resizeCanvas(document.getElementById("mobSaturation"));
    resizeCanvas(document.getElementById("mobLightness"));
    drawSlider("mobSaturation", color.s);
    drawSlider("mobLightness", color.l);
    drawSlider("mobOpacity", color.o);
}
window.addEventListener("resize", resizer);
window.addEventListener("load", resizer);


