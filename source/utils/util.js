const formatTime = (date) => {
  
  const hour = date.getHours();
  const minute = date.getMinutes();
  return hour + ':' + minute
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

const formatDate = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return month + "月" + day + "日";
};

const checkDesciptionValidity = (description) => {
  console.log(description)
  if (description == "") {
    // 描述不为空
    wx.showToast({
      title: "请填写描述",
      icon: "none",
      duration: 2000,
    });
    return false;
  }
  // 判断描述是否超过200字
  if (description.length > 200) {
    wx.showToast({
      title: "描述不能超过200字",
      icon: "none",
      duration: 2000,
    });
    return false;
  }

  // 敏感词检测
  // bug
  // const result = checkSenstiveWords(description);
  // result.then((res) => {
  //   return true;
  // });

  return true;
};


const checkNumberValidity = (number) => {
  // 判断描述是否含有非法字符
  var reg = /^[0-9]+$/;
  if (!reg.test(number)) {
    wx.showToast({
      title: "描述不能含有非法字符",
      icon: "none",
      duration: 2000,
    });
    return false;
  }
  // 判断数字大小是否合法
  if (number.length > 5) {
    wx.showToast({
      title: "太多了吧~",
      icon: "none",
      duration: 2000,
    });
    return false;
  }

  // 判断数字不能为空
  if (number == "" || number == 0) {
    wx.showToast({
      title: "请输入非0数字",
      icon: "none",
      duration: 2000,
    });
    return false;
  }
  return true;
};


const checkPhoneNumValidity = (number) => {
  var reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;
  if (!reg.test(number)) {
    wx.showToast({
      title: "电话号码不正确",
      icon: "none",
      duration: 2000,
    });
    return false;
  } else return true;
}

const checkEmailValidty = (email) => {
  var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(?:\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
  if (!reg.test(email)) {
    wx.showToast({
      title: "邮箱地址不正确",
      icon: "none",
      duration: 2000,
    });
    return false;
  } else if (email.length>30){
    wx.showToast({
      title: "邮箱地址太长了吧,换一个",
      icon: "none",
      duration: 4000,
    });
    return false;
  } else return true;
}


const sortByProp = (props, method) => {
  if (method == "asc") {
    return function (a, b) {
      return a[props] - b[props];
    }
  } else {
    return function (a, b) {
      return b[props] - a[props];
    }
  }
};


module.exports = {
  formatTime,
  formatDate,
  checkDesciptionValidity,
  checkNumberValidity,
  sortByProp,
  checkPhoneNumValidity,
  checkEmailValidty
};
