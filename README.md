## 前言

idoll Pro 是一个企业级中后台前端解决方案。在基础组件的基础上，继续向上封装颗粒度比较大的“业务组件”，并集成比较热门的前端工具解决方案，包括工具支撑：ES-lint | webpack3; 前端支撑：redux | react-router4 | axios；后端数据mock：Express，进一步提升企业级中后台产品前端开发效能。

随着 idoll UI组件” 及 idoll Pro" 深入应用于企业级应用，我们将持续迭代，逐步沉淀和总结出更多的组件并不断完善

## For 开发者

Idoll系列产品前期将定位于有一定的前端基础的前端开发者，后期可视化后可以像使用PPT一样做前端，逐步扩大到开箱即用。

## 安装和下载

```bash
yarn add idoll-pro
cd idoll-pro # 打开项目文件夹
yarn # 安装项目依赖 或者 使用 `npm install`
yarn start # 启动项目，会自动打开浏览器访问 http://localhost:8080，启动完成后会看到login页面
```

## 构建

提示：登录页面账号密码均为admin

在命令行输入命令并打包

```bash
yarn run build # 打包以后，可以在dist文件夹下找到项目的最终生成文件
```
