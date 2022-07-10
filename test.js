
var PptxGenJS = require("pptxgenjs");
var pptx = new PptxGenJS();
var slide = pptx.addSlide();

// EX: Dynamic location using percentages
slide.addText("^ (50%/50%)", { x: "50%", y: "50%" });

// EX: Basic formatting
slide.addText("Hello", { x: 0.5, y: 0.7, w: 3, color: "0000FF", fontSize: 64 });
slide.addText("World!", { x: 2.7, y: 1.0, w: 5, color: "DDDD00", fontSize: 90 });

// EX: More formatting options
slide.addText("Arial, 32pt, green, bold, underline, 0 inset", {
    x: 0.5,
    y: 5.0,
    w: "90%",
    margin: 0.5,
    fontFace: "Arial",
    fontSize: 32,
    color: "00CC00",
    bold: true,
    underline: true,
    isTextBox: true,
});

// EX: Format some text
slide.addText("Hello World!", { x: 2, y: 4, fontFace: "Arial", fontSize: 42, color: "00CC00", bold: true, italic: true, underline: true });

// EX: Multiline Text / Line Breaks - use "\n" to create line breaks inside text strings
slide.addText("Line 1\nLine 2\nLine 3", { x: 2, y: 3, color: "DDDD00", fontSize: 90 });

// EX: Format individual words or lines by passing an array of text objects with `text` and `options`
slide.addText(
    [
        { text: "word-level", options: { fontSize: 36, color: "99ABCC", align: "right", breakLine: true } },
        { text: "formatting", options: { fontSize: 48, color: "FFFF00", align: "center" } },
    ],
    { x: 0.5, y: 4.1, w: 8.5, h: 2.0, fill: { color: "F1F1F1" } }
);

// EX: Bullets
slide.addText("Regular, black circle bullet", { x: 8.0, y: 1.4, w: "30%", h: 0.5, bullet: true });
// Use line-break character to bullet multiple lines
slide.addText("Line 1\nLine 2\nLine 3", { x: 8.0, y: 2.4, w: "30%", h: 1, fill: { color: "F2F2F2" }, bullet: { type: "number" } });
// Bullets can also be applied on a per-line level
slide.addText(
    [
        { text: "I have a star bullet", options: { bullet: { code: "2605" }, color: "CC0000" } },
        { text: "I have a triangle bullet", options: { bullet: { code: "25BA" }, color: "00CD00" } },
        { text: "no bullets on this line", options: { fontSize: 12 } },
        { text: "I have a normal bullet", options: { bullet: true, color: "0000AB" } },
    ],
    { x: 8.0, y: 5.0, w: "30%", h: 1.4, color: "ABABAB", margin: 1 }
);

// EX: Paragraph Spacing
slide.addText("Paragraph spacing - before:12pt / after:24pt", {
    x: 1.5,
    y: 1.5,
    w: 6,
    h: 2,
    fill: { color: "F1F1F1" },
    paraSpaceBefore: 12,
    paraSpaceAfter: 24,
});

// EX: Hyperlink: Web
slide.addText(
    [
        {
            text: "PptxGenJS Project",
            options: { hyperlink: { url: "https://github.com/gitbrent/pptxgenjs", tooltip: "Visit Homepage" } },
        },
    ],
    { x: 1.0, y: 1.0, w: 5, h: 1 }
);
// EX: Hyperlink: Slide in Presentation
slide.addText(
    [
        {
            text: "Slide #2",
            options: { hyperlink: { slide: "2", tooltip: "Go to Summary Slide" } },
        },
    ],
    { x: 1.0, y: 2.5, w: 5, h: 1 }
);

// EX: Drop/Outer Shadow
slide.addText("Outer Shadow", {
    x: 0.5,
    y: 6.0,
    fontSize: 36,
    color: "0088CC",
    shadow: { type: "outer", color: "696969", blur: 3, offset: 10, angle: 45 },
});

// EX: Text Outline
slide.addText("Text Outline", {
    x: 0.5,
    y: 6.0,
    fontSize: 36,
    color: "0088CC",
    outline: { size: 1.5, color: "696969" },
});

// EX: Formatting can be applied at the word/line level
// Provide an array of text objects with the formatting options for that `text` string value
// Line-breaks work as well
slide.addText(
    [
        { text: "word-level\nformatting", options: { fontSize: 36, fontFace: "Courier New", color: "99ABCC", align: "right", breakLine: true } },
        { text: "...in the same textbox", options: { fontSize: 48, fontFace: "Arial", color: "FFFF00", align: "center" } },
    ],
    { x: 0.5, y: 4.1, w: 8.5, h: 2.0, margin: 0.1, fill: { color: "232323" } }
);

pptx.writeFile("Demo-Text");