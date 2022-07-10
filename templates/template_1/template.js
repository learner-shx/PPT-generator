

var PptxGenJS = require("pptxgenjs");

let initialTitle2="副标题";

function addInitial(pptx, initialTitle) {
    var slide = pptx.addSlide({ masterName: "initial" });
    slide.addText(initialTitle, { x: "25%", y: "30%", w: "50%", h: "30%", align: 'center', fontSize: 50, isTextBox: true, color: 'FFFFFF' });
    if (initialTitle2 != "") slide.addText(initialTitle2, { x: "25%", y: "65%", w: "50%", h: "10%", fontSize: 25, isTextBox: true, align: 'center', color: "FFFFFF" });
}

function addPage(pptx, index,tit, mainText) {

    var slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide.addText(
        [
            { text: index.toString() + ". ", options: { fontSize: 30, bold: true } },
            { text: tit }
        ],
        { x: "8%", y: "11%", fontSize: 27, w: "50%", h: "10%" , color: 'FFFFFF' }
    );
    slide.addText(mainText, { x: "8%", y: "30%", w: "55%", fontSize: 20 , color: 'FFFFFF'});
}


function addContentPage(pptx, content) {
    var slide = pptx.addSlide({ masterName: "CONTENT_SLIDE" });
    slide.addText(content,{ x: 0.5, y: "35%", w: "90%", h: "20%", fontSize: 36, align: "center", color: 'FFFFFF'  });
} 

function outputfile(pptx,pptxName) {
    pptx.writeFile({ fileName: pptxName });
}

function template(body) {
    let pptx = new PptxGenJS();
    pptx.defineSlideMaster({
        title: "initial",
        background: { path: "images/Title/1.jpg" }
    });

    pptx.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { path: "images/Page/1.jpg" },
        objects: [
        ],
    });

    pptx.defineSlideMaster({
        title: "CONTENT_SLIDE",
        background: { path: "./images/content_page/1.jpg" },
    });

    pptx.defineSlideMaster({
        title: "CONTENT_PAGE",
        background: { path: "./images/Content/1.jpg" },
    });
    // console.log(body.description.subPPT_pages);
    addInitial(pptx, body.description.PPT_title)
    if (body.description.subPPT_pages != undefined) {
        pptx.addSlide({ masterName: "CONTENT_PAGE" });
        for (var i = 0; i < body.description.subPPT_pages.length; i++) {
            var subPPT_page = body.description.subPPT_pages[i];
            addContentPage(pptx, subPPT_page.title)
            addPage(pptx,i+1, subPPT_page.title, subPPT_page.content)
        }
    }
    outputfile(pptx, './ppt/' + body._openid + '.pptx')
    console.log("template generated in " + body._openid + '.pptx')

}

module.exports = {
    template
}