document.getElementById("captchaCheckbox").addEventListener("click", startCaptcha);

let loadingCaptcha = false;
function startCaptcha(){
    if (!loadingCaptcha){
        loadingCaptcha = true;
        
        let checkbox = document.getElementById("captchaCheckbox").querySelectorAll("span");
        checkbox[0].remove();
        
        let image = document.createElement("img");
        image.src = "assets/recycle.svg";
        document.getElementById("captchaCheckbox").appendChild(image);
        image.id = "rotCaptcha";
        
        animationStart = Date.now();
        cancelAnimationFrame(currentAnimationFrame);
        currentAnimationFrame = requestAnimationFrame(rotCaptcha);
    }
}
function rotCaptcha(){
    let runtime = Date.now() - animationStart,
        max = 1500;

    document.getElementById("rotCaptcha").style.transform = "rotate(" + runtime/-2 + "deg)";
    
    if (runtime < max){
        currentAnimationFrame = requestAnimationFrame(rotCaptcha);
    } else {
        cancelAnimationFrame(currentAnimationFrame);
        currentAnimationFrame = requestAnimationFrame(realCaptcha);
    }
}
function shuffle(array) {
    let index = array.length,  random;
    
    while (index != 0){
    random = Math.floor(Math.random() * index);
    index--;


    [array[index], array[random]] = [array[random], array[index]];
  }
  return array;
}

function realCaptcha() {
    // 1. REMOVE CONTENT OF CAPTCHA FIELD
    let captchaField = document.getElementById("captchaField");
    
    while(captchaField.firstChild){
        captchaField.removeChild(captchaField.lastChild);
    }
    
    // 2. ADD REAL CAPTCHA
    let container = document.createElement("div");
    container.id = "captchaContainer";
    container.style.maxHeight = "0px";
    captchaField.appendChild(container);
    
    let header = document.createElement("h2");
    header.innerHTML = "prove it";
    container.appendChild(header);
    
    let headerText = document.createElement("p");
    headerText.innerHTML = "select any image displaying a profession where robots can perfectly supplant humans"
    container.appendChild(headerText);
    
    let profContainer = document.createElement("div");
    container.appendChild(profContainer);
    
    shuffle(professions);
    for (let prof of professions){
        let newProf = document.createElement("img");
        newProf.classList.add("profession");
        newProf.src = prof;
        profContainer.appendChild(newProf);
        newProf.addEventListener("click", goToTutorial);
    }
    document.getElementById("startLogo").remove();
    document.getElementById("startText").remove();
    document.getElementById("captchaField").classList.add("small");
    animationStart = Date.now();
    cancelAnimationFrame(currentAnimationFrame);
    currentAnimationFrame = requestAnimationFrame(unfold);
}
function unfold(){
    let runtime = Date.now() - animationStart,
        max = 750,
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
function goToTutorial(){
    gamestate = "tutorial";
    evaluate(1500);
}
