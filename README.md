# PPT自动生成器

## 简介

此项目是微信小程序 "PPT自动生成器" 的源代码仓库, 该小程序目的在于方便用户根据关键字自动生成PPT,节约不必要的初期设计精力.

## 使用方法

### 前端

- 进入[微信小程序官网](https://mp.weixin.qq.com/cgi-bin/wx)
- 注册,登录
- 获取AppID

  ![20220525231716](https://raw.githubusercontent.com/learner-lu/picbed/master/20220525231716.png)

- 替换[project.config.json](source/project.config.json)中的`"appid"`
- 使用微信开发者工具打开

本程序依赖微信云开发的云服务数据库, 需要首先开通云服务,然后新建几个数据表 `message` `requirement` `user`, 并修改权限为所有人可读可写(如下)

![](https://raw.githubusercontent.com/learner-lu/picbed/master/20220530232831.png)

然后将app.js中的云开发key替换为你的即可

```js
wx.cloud.init({
      env: "kamilu-3g69c1hh0c963d36"
    })
```

### 后端

进入 [web 分支](https://github.com/learner-shx/PPT-generator/tree/web), 启动server.js即可

```bash
node server.js
```

然后把IP替换为你的服务器地址,统一前后端IP即可

> 本机运行则直接改为127.0.0.1即可

## 相关文档

- [开发者记录](开发者记录.md)

## 贡献者

<a href="https://github.com/learner-shx/PPT-generator/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=learner-shx/PPT-generator" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

