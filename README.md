# 小记

## 主要技术栈
- node-->http,异常处理
- web框架：express
- 参数校验
- mysql的使用，了解
- ORM,sequelize使用。
## 技术关键点
api工具人。理解流程：web->webserver->router->handler->orm->db
上层node-application -操作-->ORM（sequelize）--> 驱动(nodejs的驱动mysql) -->连接mysql db

## 后续学习注意事项
需要做详细的模型设计，模型之间的关系（一对一，一对多）

## 其他注意事项
- Mysq其实也是个服务，提供了数据存储的能力。
- 可视化工具：navcat
- 项目中安装sequelize其实是为了可以方便操作数据库:
- npm install sequelize -S, npm install sequelize-cli -D, npx sequelize-cli init(初始化)，初始化完成后会生成：config文件

- 创建模型命令：npx sequelize-cli model:generate --name User --attributes name:string
  

## 工具相关：
1、nodemon 辅助开发工具

- npm i nodemon -D
- 修改package.json 的启动命令
- 通过增加一个nodemon.json配置来指定特殊的watch文件
- debug模式：json文件中配置："start": "DEBUG=* nodemon src/app.js"
  
2、nrm : npm包的源管理

- nrm ls 查看所有的源
- nrm use 
  
3、nvm : 管理nodejs版本

- nvm alias default 8.1.0. 设置node的默认版本
  
## 帮助理解
1、什么是web应用？

包含的东西：服务器（web应用）-->缓存/数据库

2、express在web应用中的作用，是什么东西？是node中的一种web框架，帮助我们去构建http服务，主要做了接收req，处理res.
4、什么是web应用？

包含的东西：服务器（web应用）-->缓存/数据库

5、express在web应用中的作用，是什么东西？

是node中的一种web框架，帮助我们去构建http服务，主要做了接收req，处理res.

6、安装express npm install express -S

app.use

7、服务器怎么根据不同的请求进行不同的处理？

url-->网络-->dns解析-->目标服务器

- 1、如何响应这个请求？
- ​     通过 路由处理/（路由就是规则）
- 2、请求的类型，get/post
- 3、通过uri. --> 路径 处理  比如：www.baidu.com/a/b/a.html ,a/b/就是uri.



8、如何定义一个路由或者api需要满足不管客户端使用什么方式，都可以得到响应？

​    app.all();

9、怎么做，可以做到无论客户端使用什么uri都可以响应？ （日志）

​    app.all("*", (res, req) => {});

10、如何做路由拆分？主要通过，express.router

11、什么是中间件？中间件是一个可插拔的功能

- 1、是一个函数
- 2、有完整的入参： err，req，next -->function

12、中间件分为：

- app级别的使用：注册的时候一定是在最顶级，通过app.use去加载。
- router级别的使用，
- 异常处理，
- 内置的
- Multer?

13、异常处理

- 异常捕获
- express内置处理
- 自定义异常处理：异常处理一定的是收口的，即统一在一个地方处理


## 终端操作数据库相关命令：

- 如何登录？mysql -u root , 退出:exit;

- 如何查看所有数据库？show databases;

- 如何选中一个数据库？use todo;

- 如何在数据库服务器中创建我们的数据库？create datatebase test;

- 终端如何查看某个数据库中的所有数据表？show tables
  

  