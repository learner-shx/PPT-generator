const pptxgen = require('pptxgenjs')

// 1. Create a new pptxentation
let pptx = new pptxgen();

// 2. Add a Slide
let slide = pptx.addSlide();
// Shapes without text
slide.background = { path: "https://raw.githubusercontent.com/learner-lu/picbed/master/56221493.jpg" }; // Solid color

// 3. Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
let textboxText = "Hello World from PptxGenJS!";
let textboxOpts = { x: 1, y: 1, color:'0088CC' };
slide.addText(textboxText, textboxOpts);

// 4. Save the pptxentation
pptx.writeFile({ fileName: "html2pptx-demo.pptx" });