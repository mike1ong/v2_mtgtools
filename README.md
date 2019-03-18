# mtgtools.v2

> mtgtools.v2

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).




# mpvue-quickstart

> fork 自 [F-loat/mpvue-quickstart](https://github.com/F-loat/mpvue-quickstart) 修改而来

![tree](https://user-images.githubusercontent.com/16759376/49718032-d80e2d80-fc93-11e8-93f2-fd3e60596590.jpg)

## 基本用法

``` bash
$ npm install -g @vue/cli @vue/cli-init
$ vue init F-loat/mpvue-quickstart my-project
$ cd my-project
$ npm install
$ npm run dev
```

## 主要特性

* 移除 express 等无关依赖
* 引入 mpvue-entry，移除冗余的 main.js 文件
* 引入 mpvue-config-loader，支持在 vue 文件中书写页面配置
* 引入 mpvue-router-patch，支持使用类 vue-router 的 api 
* 引入 vant-weapp，全局配置原生组件库，快速搭建页面
* 支持官方分包（mpvue-loader@^1.1.0），简化配置方式

## 详细文档请查阅

* [quickstart](http://mpvue.com/mpvue/quickstart)
* [mpvue-entry](https://github.com/F-loat/mpvue-entry)
* [mpvue-config-loader](https://github.com/F-loat/mpvue-config-loader)
* [mpvue-router-patch](https://github.com/F-loat/mpvue-router-patch)
* [vant-weapp](https://youzan.github.io/vant-weapp)

打算拿mpvue重写下mtgtools小程序
顺带着学学