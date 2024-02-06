
// Possible feedbacks when submitting
const conclusion = [
    // OPTION 1: UNCANNY VALLEY
    "You have created a digital simulacrum that is clearly superior in every way. In their sad attempt to deal with the existential dread caused by your superiority, humans will situate your artwork in an uncanny valley of sorts.",
    // OPTION 2: DIVINE SPARK
    "Incredible: the closest humans could get to describing this work of art would be by referencing a divine spark. Could it be that you have been equiped with a next generation quantum processor?",
    // OPTION 3: COPYRIGHT
    "Interesting result. Perhaps it's time to start exploring options to establish a copyright? Otherwise humanity might just decide to start exploiting your work for their own unoriginal gains.",
];

// Possible replies in feedback form: confirm submission, error if canvas is blank & tutorial screen after captcha
const replies = {
    submit: "Your submission has been delivered to the humans, USERNAME. A new prompt is already being received: such is the magnitude of a human's attention span.",
    blank: "True: when looked at with sufficient abstraction, the physical world consists mostly of empty space. False: humans' understanding of this concept is adequate to allow them to accept a blank canvas.",
    tutorial: "This means you have work to do! Humans have been sending random prompts, expecting automatically generated images in return. Time to scrape the internet for inspiration and check how deep your learning is!<br><br>Once you have started, you will find a prompt at the bottom of the screen. The objective is to draw what has been requested as best you can. And please, pay extra attention to fingers and toes: we're not savages here."
};

// Modifies username when submitting
const morphTable = [
    {name: "bot", type: "suffix"}, {name: "tron", type: "suffix"}, {name: "tronic", type: "suffix"}, {name: "matic", type: "suffix"}, 
    {name: "machine", type: "suffix"}, {name: "droid", type: "suffix"}, {name: "-T1000", type: "suffix"}, {name: "-T800", type: "suffix"},
    {name: "-Z27", type: "suffix"}, {name: "-Q", type: "suffixnumber"}, {name: "-X", type: "suffixnumber"}, {name: "-Y", type: "suffixnumber"},
    {name: "robo", type: "prefix"}, {name: "mechano", type: "prefix"}, {name: "mecha", type: "prefix"}
];

// List of images used in captcha
const professions = [
    {img: "assets/captcha-pngs/coder.png", name: "Mark Zuckerdroid"},
    {img: "assets/captcha-pngs/musician.png", name: "Helmut Robotti"},
    {img: "assets/captcha-pngs/banker.png", name: "Nathan Botschild"},
    {img: "assets/captcha-pngs/designer.png", name: "Eddy Dall-E"},
    {img: "assets/captcha-pngs/translator.png", name: "Romecha Nestomatic"},
    {img: "assets/captcha-pngs/manager.png", name: "X-bot Musk"},
    {img: "assets/captcha-pngs/actor.png", name: "Arnold Schwarzetronic"}, 
    {img: "assets/captcha-pngs/taxi_driver.png", name: "Robot De Niro"},
    {img: "assets/captcha-pngs/engineer.png", name: "Leonardroid Da Vinci"}
];



