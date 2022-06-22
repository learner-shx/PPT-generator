const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join("/")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
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

const checkSenstiveWords = (description) => {
  var plugin = requirePlugin("chatbot");
  plugin.init({
    appid: "P5Ot9PHJDechCYqDFAW1AiK6OtG3Ja", //小程序示例账户，仅供学习和参考
    openid: "123", //用户的openid，非必填，建议传递该参数
  });

  return new Promise((resolve, reject) => {
    plugin.api.nlp("sensitive", { q: description, mode: "cnn" }).then((res) => {
      console.log("sensitive result : ", res);
      return resolve(res);
    });
  });
};

const debounce = (fn, interval) => {
  var timer;
  var time = interval || 1000;//延迟时间，如果interval不传默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments;//保存arguments，因为setTimeout是全局的
    timer = setTimeout(function () {
      fn.call(context, args);  //call方法是改变this的指向，第二个参数可以传递任意值
    }, time);
  };
}


const checkNumberValidity = (number) => {
  // 判断描述是否含有非法字符
  var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
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
      title: "请输入数字",
      icon: "none",
      duration: 2000,
    });
    return false;
  }
  return true;
};

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
  debounce
};
