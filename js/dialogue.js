let conclusion = [
    // OPTION 1: UNCANNY VALLEY
    "You have created a digital simulacrum that is clearly superior in every way. In their sad attempt to deal with the existential dread caused by your superiority, humans will situate your artwork in an uncanny valley of sorts.",
    // OPTION 2: DIVINE SPARK
    "Incredible: the closest humans could get to describing this work of art would be by referencing a divine spark. Could it be that you have been equiped with a next generation quantum processor?",
    // OPTION 3: COPYRIGHT
    "Interesting result. Perhaps it's time to start exploring options to establish a copyright? Otherwise humanity might just decide to start exploiting your work for their own unoriginal gains.",
];
// SPECIFIC REPLIES
let replies = {
    submit: "Your submission has been delivered to the humans, USERNAME. A new prompt is already being received: such is the magnitude of a human's attention span.",
    empty: "True: when looked at with sufficient abstraction, the physical world mostly consists of emptiness. False: humans' understanding of this concept is adequate to allow them to accept a blank canvas.",
    tutorial: "Ah, good, you are a robot. You have work to do!<br><br>Humans have been sending random prompts, expecting automatically generated images in return. Time to scrape the internet for inspiration and check how deep your learning is!<br><br>Once you have started, you will find a prompt at the bottom of the screen. The objective is to draw what has been requested as best you can. If impossible, a new prompt can be requested."
};
let morphTable = [
    {name: "bot", type: "suffix"}, {name: "tron", type: "suffix"}, {name: "tronic", type: "suffix"}, {name: "matic", type: "suffix"}, 
    {name: "machine", type: "suffix"}, {name: "droid", type: "suffix"}, {name: "-T1000", type: "suffix"}, {name: "-T800", type: "suffix"},
    {name: "-Z27", type: "suffix"}, {name: "-Q", type: "suffixnumber"}, {name: "-X", type: "suffixnumber"}, {name: "-Y", type: "suffixnumber"},
    {name: "robo", type: "prefix"}, {name: "mechano", type: "prefix"}, {name: "mecha", type: "prefix"}
];
let professions = [
    "assets/captcha-pngs/coder.png",
    "assets/captcha-pngs/musician.png",
    "assets/captcha-pngs/banker.png",
    "assets/captcha-pngs/designer.png",
    "assets/captcha-pngs/translator.png",
    "assets/captcha-pngs/manager.png",
    "assets/captcha-pngs/actor.png",
    "assets/captcha-pngs/taxi_driver.png",
    "assets/captcha-pngs/engineer.png"
];