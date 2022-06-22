// 云函数入口文件
const cloud = require('wx-server-sdk')
const PptxGenJS = require('pptxgenjs')

cloud.init()



// 云函数入口函数
exports.main = async (event, context) => {

  // const wxContext = cloud.getWXContext();
  // let pres = new PptxGenJS();
  
  // pres.writeFile(filepath);
  // // pres.writeFile();
  
  // // console.log(event.filePath)
  // pres = event.ppt;
  

  // pres.writeFile(filepath);

  // var idx = filepath.lastIndexOf('/')
  // idx = idx > -1 ? idx : filepath.lastIndexOf('\\')
  // var cloudpath;
  // if (idx < 0) {
  //   cloudpath = filepath;
  // }
  // cloudpath = filepath.substring(idx + 1);

  let pres = new PptxGenJS();

  // 2. Add a Slide
  let slide = pres.addSlide();

  // 3. Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
  let textboxText = "Hello World from PptxGenJS!";
  let textboxOpts = { x: 1, y: 1, color: "363636" };
  slide.addText(textboxText, textboxOpts);
  // console.log(wx.env.USER_DATA_PATH);
  // 4. Save the Presentation
  pres.writeFile();

  wx.cloud.uploadFile({
    filePath: filepath,
    cloudPath : cloudpath,
  });



  return {
    event,
    abc : 123,
    pres : pres
  }
}