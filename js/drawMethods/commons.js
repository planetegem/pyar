// Style constant
const pyarYellow = "#fff8a3";

// Drawtool: remembers how you're interacting with the canvas
const drawTool = {
    type: null, // Determines current tool: can be pencil, eraser, line, etc
    layer: "canvas-" + "layer1" // Current layer to draw one, modified in layer tool
};

// Color of brush: hsl, translated to rgb, finally opacity
const color = {h: 0, s: 100, l: 50, r: 0, g: 0, b: 0, o: 100};

// Remembers size of the brush: 
const size = {
    multiplier: 1, // Multiplier is applied to base value (calculated based on canvas width)
    pen: document.getElementById("cursorCanvas").width/25, // Base value when using pen & eraser
    line: document.getElementById("cursorCanvas").width/50, // Base value when using line tool
    temp: 0.5, // Used as an intermediate value when playing with the slider
    collageMultiplier: 1, // Multiplier, but this time for collage clip tool
    collageTemp: 0.5 // Same as for regular size slider (intermediate value)
};

// Remembers when and what you're dragging
let dragging = {
    active: true, // Failsafe, but don't remember why
    type: null // What the mousedown / touchdown was triggered on
};
