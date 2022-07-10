

var PptxGenJS = require("pptxgenjs");


function addInitial(pptx, initialTitle) {
    var slide = pptx.addSlide({ masterName: "initial" });
    slide.addText(initialTitle, { x: 0.5, y: "25%", w: "60%", h: "20%", fontSize: 36 });
    slide.addText("请输入内容", { x: 0.5, y: "45%", w: "60%", h: "20%", fontSize: 16 });
}

function addPage(pptx, index, title, mainText) {
    var slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });

    slide.addText(
        [
            { text: index.toString() + ". ", options: { fontSize: 30, bold: true } },
            { text: title }
        ],
        { x: "8%", y: "11%", fontSize: 27, w: "50%", h: "10%"}
    );
    slide.addText(mainText, { x: "8%", y: "30%", w: "55%", fontSize: 20 });

}

function outputfile(pptx, pptxName) {
    pptx.writeFile({ fileName: pptxName });
}

function addContentPage(pptx, content) {
    var slide = pptx.addSlide({ masterName: "CONTENT_SLIDE" });
    slide.addText(content,{ x: 0.5, y: "35%", w: "90%", h: "20%", fontSize: 36, align: "center" });
} 


function template(body) {
    let pptx = new PptxGenJS();
    pptx.defineSlideMaster({
        title: "initial",
        background: { path: "images/Title/3.jpg" }
    });

    pptx.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { path: "images/Page/3.jpg" },
        objects: [
        ],
    });

    pptx.defineSlideMaster({
        title: "CONTENT_SLIDE",
        background: { path: "./images/content_page/3.jpg" },
    });

    pptx.defineSlideMaster({
        title: "CONTENT_PAGE",
        background: { path: "./images/Content/3.jpg" },
    });

    // console.log(body.description.subPPT_pages);
    addInitial(pptx, body.description.PPT_title)
    pptx.addSlide({ masterName: "CONTENT_PAGE" })
    if (body.description.subPPT_pages != undefined) {
        console.log(body.description.subPPT_pages);
        for (var i = 0; i < body.description.subPPT_pages.length; i++) {
            var subPPT_page = body.description.subPPT_pages[i];
            addContentPage(pptx, subPPT_page.title)
            addPage(pptx, i + 1, subPPT_page.title, subPPT_page.content)
        }
    }
    outputfile(pptx, './ppt/' + body._openid + '.pptx')
    console.log("template generated in " + body._openid + '.pptx')
}


module.exports = {
    template
}