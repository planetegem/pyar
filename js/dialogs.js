// Variables used in animations
let duration, animationStart, currentAnimationFrame;

// LOADING DIALOG
const loadDialog = document.getElementById("evaluating");

function evaluate(loadtime){
    loadDialog.showModal();
    
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
    
    if (runtime < duration){
        currentAnimationFrame = requestAnimationFrame (animateEval);
    } else {
        cancelAnimationFrame(currentAnimationFrame);
        stateChange();
    }
}

// CAPTCHA DIALOG & LOGIC
const captchaBox = document.getElementById("captchaCheckbox");
const captchaField = document.getElementById("captchaField");
const topMask = document.getElementById("topMask");
const bottomMask = document.getElementById("bottomMask");

let loadingCaptcha = false, loadingCaptchaComplete = false; // To avoid clicking more than once
let captchaFieldRatio;
let borderOffset = 0;

captchaBox.addEventListener("click", startCaptcha);

// When you confirm you're a robot: replace checkbox with rotating arrows, then prepare captcha field
function startCaptcha(){
    // Only runs once
    if (!loadingCaptcha){
        loadingCaptcha = true;

        // Remove checkbox
        let checkbox = captchaBox.querySelectorAll("span");
        checkbox[0].remove();
        
        // Create rotating arrows image
        let image = document.createElement("img");
        image.src = "assets/recycle.svg";
        captchaBox.appendChild(image);
        image.id = "rotCaptcha";
        
        // Retain animation start time
        animationStart = Date.now();
    }

    // Check how long animation has been running
    let runtime = Date.now() - animationStart;
    max = 1500;

    // apply rotation to image
    if (!loadingCaptchaComplete){
        document.getElementById("rotCaptcha").style.transform = "rotate(" + runtime/-2 + "deg)";
    } else {
        // Wipe away borders
        max = 500;
        let maxWidth = captchaField.offsetWidth, maxHeight = captchaField.offsetHeight,
            segmentDuration = max / (2 + captchaFieldRatio*2);
        
        let progressTop = Math.min(1, Math.max(0, runtime / (segmentDuration*captchaFieldRatio))),
            progressRight = Math.min(1, Math.max(0, (runtime - segmentDuration*captchaFieldRatio) / segmentDuration)),
            progressBottom = Math.min(1, Math.max(0, (runtime - (1 + segmentDuration)*captchaFieldRatio) / (segmentDuration*captchaFieldRatio))),
            progressLeft = Math.min(1, Math.max(0, (runtime - (1 + 2*segmentDuration)*captchaFieldRatio)) / segmentDuration);

        topMask.style.width = progressTop*maxWidth + "px";
        topMask.style.height = Math.max(borderOffset, progressRight*maxHeight - borderOffset) + "px";
        bottomMask.style.width = progressBottom*maxWidth + "px";
        bottomMask.style.height = Math.max(borderOffset, progressLeft*maxHeight - borderOffset) + "px";
    }
    
    if (runtime < max){
        currentAnimationFrame = requestAnimationFrame(startCaptcha);
    } else if (!loadingCaptchaComplete) {
            loadingCaptchaComplete = true;
            captchaFieldRatio = captchaField.offsetWidth / captchaField.offsetHeight;
            document.getElementById("rotCaptcha").style.transform = "rotate(0deg)";
            document.getElementById("rotCaptcha").src = "assets/checkmark.svg";
            borderOffset = topMask.offsetHeight;

            animationStart = Date.now();
            currentAnimationFrame = requestAnimationFrame(startCaptcha);
    } else {
        cancelAnimationFrame(currentAnimationFrame);
        currentAnimationFrame = requestAnimationFrame(createCaptcha);
    }
}

// Helper function: shuffle array of captcha images 
function shuffle(array) {
    let index = array.length,  random;
    
    while (index != 0){
        random = Math.floor(Math.random() * index);
        index--;
        [array[index], array[random]] = [array[random], array[index]];
    }
  return array;
}

// Build captcha field
function createCaptcha() {
    // Remove current content
    while(captchaField.firstChild){
        captchaField.removeChild(captchaField.lastChild);
    }
    document.getElementById("captcha").querySelector("p").remove();
    
    // Make captcha container
    let container = document.createElement("div");
    container.id = "captchaContainer";
    container.style.maxHeight = "0px";
    captchaField.appendChild(container);
    
    // Add header
    let header = document.createElement("p");
    header.innerHTML = "Oh really? Why don't you <h3>prove it</h3>?";
    container.appendChild(header);
    
    // Instructions
    let headerText = document.createElement("p");
    headerText.innerHTML = "Select at least 3 images that show a profession where robots can perfectly supplant humans."
    container.appendChild(headerText);
    
    // Add captcha images
    let profContainer = document.createElement("div");
    container.appendChild(profContainer);
    
    for (let prof of professions){
        let newProf = document.createElement("img");
        newProf.classList.add("profession");
        newProf.src = prof.img;
        newProf.alt = prof.name;
        profContainer.appendChild(newProf);
        newProf.addEventListener("click", () => {
            newProf.classList.toggle("selected");
            countCaptcha();
        });
    }

    // Add submit button
    let submitButton = document.createElement("button");
    submitButton.innerText = "submit";
    submitButton.classList.add("button");
    submitButton.id = "captchaSubmit";
    submitButton.disabled = true;
    container.appendChild(submitButton);
    submitButton.addEventListener("click", () => {
        gamestate = "tutorial";
        evaluate(1500);
    });

    captchaField.classList.add("unfolded");
    animationStart = Date.now();
    cancelAnimationFrame(currentAnimationFrame);
    currentAnimationFrame = requestAnimationFrame(unfold);
}
function unfold(){
    let runtime = Date.now() - animationStart,
        max = 250,
        progress = runtime/max;
        height = document.getElementById("captchaContainer").scrollHeight;
    
    document.getElementById("captchaContainer").style.maxHeight = progress*height + "px";
    
    if (runtime < max){
        currentAnimationFrame = requestAnimationFrame(unfold);
    } else {
        cancelAnimationFrame(currentAnimationFrame);
        document.getElementById("captchaContainer").removeAttribute("style");
    }
}

function countCaptcha(){
    let selectedImages = document.querySelectorAll(".profession.selected");
    if (selectedImages.length >= 3){
        document.getElementById("captchaSubmit").disabled = false;
    } else {
        document.getElementById("captchaSubmit").disabled = true;
    }
}

// FEEDBACK DIALOGS
const feedbackField = document.getElementById("feedbackField"),
      feedbackButton = document.getElementById("feedbackConfirm");
feedbackButton.addEventListener("click", () => {
    gamestate = "drawing";
    sessionStorage.removeItem("tutorial");
    stateChange();
});
// Tutorial screen immediately after captcha
function buildTutorial(){
    while (feedbackField.firstChild){
        feedbackField.lastChild.remove();
    }
    let header = document.createElement("h2");
    header.innerText = "automatic acceptance";
    feedbackField.appendChild(header);

    // Recap of the captcha images that were selected
    let intro = document.createElement("p");
    let introText = "You have identified";
    let selectedImages = document.querySelectorAll(".profession.selected");
    for (let i = 0; i < selectedImages.length; i++){
        if (i === selectedImages.length - 1){
            introText += " and";
        }
        introText += " " + selectedImages[i].alt;
        if (i !== selectedImages.length - 2 && i !== selectedImages.length - 1){
            introText += ",";
        }
    }
    introText += ". This is a satisfactory result. You are indeed a <h3>ROBOT</h3>.<br><br>";
    introText = sessionStorage.getItem("tutorial") ?? introText;
    sessionStorage.setItem("tutorial", introText);
    intro.innerHTML = introText;
    feedbackField.appendChild(intro);

    // tutorial text
    let tutorial = document.createElement("p");
    tutorial.innerHTML = replies.tutorial;
    feedbackField.appendChild(tutorial);

    feedbackButton.innerText = "start drawing";
}
// Error message if blank canvas was submit
function buildBlankError() {
    while (feedbackField.firstChild){
        feedbackField.lastChild.remove();
    }
    let header = document.createElement("h2");
    header.innerText = "automatic refusal";
    feedbackField.appendChild(header);

    // feedback text
    let tutorial = document.createElement("p");
    tutorial.innerHTML = replies.blank;
    feedbackField.appendChild(tutorial);

    feedbackButton.innerText = "start drawing";
}
// Confirmation that submission was received by database
function buildSubmissionConfirmed(){
    while (feedbackField.firstChild){
        feedbackField.lastChild.remove();
    }
    let header = document.createElement("h2");
    header.innerText = "automatic confirmation";
    feedbackField.appendChild(header);

    // feedback text
    let tutorial = document.createElement("p");
    let text = replies.submit;
    text = text.replace("USERNAME", usernameNew);
    tutorial.innerHTML = text;
    feedbackField.appendChild(tutorial);

    feedbackButton.innerText = "next prompt";

    let dbButton = document.createElement("button");
    dbButton.classList.add("button");
    dbButton.id = "dbButton";
    dbButton.innerText = "visit database";
    dbButton.addEventListener("click", () => {
        window.open("output.php");
    });
    feedbackField.appendChild(dbButton);
}
// If php error, will be visible here
function buildErrorFeedback(){
    while (feedbackField.firstChild){
        feedbackField.lastChild.remove();
    }
    let header = document.createElement("h2");
    header.innerText = "error report";
    feedbackField.appendChild(header);

    // feedback text
    let feedback = document.createElement("p");
    feedback.innerHTML = phpError;
    feedbackField.appendChild(feedback);

    feedbackButton.innerText = "next prompt";
}

// SUBMIT DIALOG
function prepareSubmission(){
    let randomIndex = Math.floor(Math.random()*conclusion.length);
    document.getElementById("conclusion").innerHTML = conclusion[randomIndex];
    document.getElementById("username").value = username;

}