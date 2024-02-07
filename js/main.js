
const dialogs = document.getElementsByTagName("dialog");
let gamestate, username, usernameNew;

// WHEN EVERYTHING HAS LOADED, START GAME
window.addEventListener("load", () => {
    // Check session storage
    let sessionGamestate = sessionStorage.getItem("gamestate");
    gamestate = sessionGamestate ?? "start";

    if (phpError !== null){
        gamestate = "error";
    }
    document.getElementById("overlay").remove();

    let sessionUsername = sessionStorage.getItem("username");
    username = sessionUsername ?? "anonymous";

    let sessionUsernameNew = sessionStorage.getItem("usernameNew");
    usernameNew = sessionUsernameNew ?? "anonymous";

    // Check if canvas needs to be quickloaded
    quickLoad();

    evaluate(1000);
});

// PROMPT LOADER
let promptReceived = false;
const promptIncoming = document.getElementById("promptIncoming");
const promptField = document.getElementById("promptField");

function startPromptRequest(){
    getPrompt();

    promptReceived = true;
    animationStart = Date.now();
    promptField.style.visibility = "hidden";
    promptField.style.scale = 0;
    promptIncoming.style.visibility = "visible";

    // Make buttons inactive
    document.getElementById("promptRequest").disabled = true;
    document.getElementById("submitButton").disabled = true;

    animatePrompt();
}

function animatePrompt(){
    let runtime = Date.now() - animationStart,
        max = 3000, step = 400;

    if (Math.round(runtime/step) % 2 === 0){
        promptIncoming.style.visibility = "hidden";
    } else {
        promptIncoming.style.visibility = "visible";
    }
    
    if (runtime < max || constructingPrompt){
        currentAnimationFrame = requestAnimationFrame(animatePrompt);
    } else {
        cancelAnimationFrame(currentAnimationFrame);
        promptField.style.visibility = "visible";
        promptField.style.scale = 1;
        promptIncoming.style.visibility = "hidden";
        document.getElementById("promptRequest").disabled = false;
        document.getElementById("submitButton").disabled = false;
    }
}

// GAMESTATE DECISION TREE
function stateChange(){
    // First close all dialogs
    for (let dialog of dialogs){
        dialog.close();
    }

    // Save current gamestate to session storage
    sessionStorage.setItem("gamestate", gamestate);

    // Check current gamestate and retrieve appropriate dialog
    switch (gamestate){
        case "start":
            document.getElementById("captcha").showModal();
            break;
        case "tutorial":
            document.getElementById("feedback").showModal();
            buildTutorial();
            break;
        case "blank":
            document.getElementById("feedback").showModal();
            buildBlankError();
            break;
        case "end":
            document.getElementById("feedback").showModal();
            buildSubmissionConfirmed();
            break;
        case "error":
            document.getElementById("feedback").showModal();
            buildErrorFeedback();
            break;
        case "submit":
            document.getElementById("submitMenu").showModal();
            prepareSubmission();
            break;

        case "drawing":
            if (promptReceived === false){
                startPromptRequest();
            }
            break;
    }    
}

// SUBMIT LOGIC
let createdImage, canvasBlank;

// Helper function: compares provided canvas with an empty one
function validateCanvas(canvas){
    let blankCanvas = document.createElement("canvas");
    blankCanvas.width = canvas.width;
    blankCanvas.height = canvas.height;
    return canvas.toDataURL() === blankCanvas.toDataURL();   
}
// On submit, start preparing final image
document.getElementById("submitButton").addEventListener("click", () => {
    gamestate = "submit";
    
    // COMBINE ALL LAYERS FOR FINAL IMAGE
    let canvas = document.getElementById("finalCanvas"),
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

// Cancel submit
function cancelSubmit(){
    if(document.getElementById("username").value !== ""){
        // Register any changes to username before leaving
        username = document.getElementById("username").value;
        sessionStorage.setItem("username", username);
    }
    gamestate = "drawing";
    stateChange();
}
document.getElementById("cancelSubmit").addEventListener("click", cancelSubmit);

// Post form data
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

    sessionStorage.setItem("username", username);

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
    sessionStorage.setItem("usernameNew", username);
    gamestate = "end";
    sessionStorage.setItem("gamestate", gamestate);

    document.getElementById("imageFormSubmit").click();
    clearSave();

    constructingPrompt = true;
    evaluate(1000);
});


// Request new prompt 
document.getElementById("promptRequest").addEventListener("click", () => {
    resetLayers();
    clearSave();
    startPromptRequest();
});

// Download image (possible in submit menu)
document.getElementById("download").addEventListener("click", () => {
    let download = document.createElement("a");
    
    let filename = document.getElementById("targetField").innerHTML;
    filename = filename.replace(/ /g,"_");
    filename = filename.replace(/\,/g,"_");

    download.download = filename;
    download.href = document.getElementById("finalCanvasPreview").src;
    download.click();
});