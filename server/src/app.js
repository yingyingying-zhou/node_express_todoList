/*
 * @Description  :
 * @Author       : pacino
 * @Date         : 2021-07-22 14:00:47
 * @LastEditTime : 2021-08-27 17:41:18
 * @LastEditors  : pacino
 */
const express = require("express");
const app = express();
// const bodyParser = require("body-parser");

const models = require("../db/models");
const moment = require("moment");
var request = require("request");

// 处理json
app.use(express.json());
// 对url参数做解码
app.use(express.urlencoded());
// 对body参数做解码
app.use(express.urlencoded({ extended: false }));
// 解析文本数据
app.use(express.text());
// request乱码问题
const iconv = require("iconv-lite");
// 1.所有的错误，http status = 500
// 查询任务列表
// app.get("/list/:status/:page", async (req, res, next) => {
//   //   next(new Error("自定义异常"));
//   res.json({
//     list: [],
//   });
// });

// 收集访客信息
app.post("/send_info", (req, res, next) => {
  let accept_info = {};
  // 判断是否是对象
  if (Object.prototype.toString.call(req.body) === "[object Object]") {
    accept_info = req.body;
  } else {
    accept_info = JSON.parse(req.body);
  }
  const ip = req.headers["x-real-ip"] ? req.headers["x-real-ip"] : req.ip.replace(/::ffff:/, "");
  const host = accept_info.info.host; // 请求的host
  const load = accept_info.info.load; // 加载时长
  const req_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); // 请求的日期
  request(
    {
      url: `http://ip.ws.126.net/ipquery?ip=${ip}`,
      method: "GET",
      encoding: null,
    },
    async function (error, response, body) {
      const ip_result = iconv.decode(body, "gb2312").toString();
      console.log("body---", ip_result, ip_result.split(";")[0]);
      const tempDate = (ip_result.split(";")[0].split("=")[1] + "-" + ip_result.split(";")[0].split("=")[2]).replace(
        ", lc",
        ""
      );
      const address = tempDate || "缺省";
      //   数据持久化到数据库
      try {
        const n_optimization = await models.n_optimization.create({
          host,
          load,
          req_date,
          ip,
          address,
        });
        res.json({
          n_optimization,
          message: "优化记录已增加",
        });
      } catch (error) {
        next(error);
      }
    }
  );
});

// 收集报错资源路径
app.post("/up_err", async (req, res, next) => {
  console.log("--req.body--", req.body);
  const resources_err = req.body;
  try {
    const n_optimization = await models.n_optimization.create({
      resources_err,
    });
    res.json({
      n_optimization,
      message: "优化记录已增加",
    });
  } catch (error) {
    next(error);
  }
});

// 创建一个todo
app.post("/create", async (req, res, next) => {
  const { name, deadline, content } = req.body;
  //   数据持久化到数据库
  try {
    const todo = await models.Todo.create({
      name,
      deadline,
      content,
    });
    res.json({
      todo,
      message: "任务创建成功",
    });
  } catch (error) {
    next(error);
  }
});

// 修改一个todo
app.post("/update", async (req, res, next) => {
  try {
    const { name, deadline, content, id, status } = req.body;
    let todo = await models.Todo.findOne({
      where: {
        id,
      },
    });
    if (todo) {
      // 执行更新功能
      todo = await todo.update({
        name,
        deadline,
        content,
        status,
      });
    }
    res.json({
      todo,
    });
  } catch (error) {
    next(error);
  }
});

// 修改一个todo状态，删除
app.post("/update_status", async (req, res, next) => {
  try {
    const { id, status } = req.body;
    let todo = await models.Todo.findOne({
      where: {
        id,
      },
    });
    if (todo && status != todo.status) {
      // 执行更新
      todo = await todo.update({
        status,
      });
    }
    res.json({
      todo,
    });
  } catch (error) {
    next(error);
  }
});

// 查询任务列表
app.get("/list/:status/:page", async (req, res, next) => {
  let { status, page } = req.params;
  let limit = 5;
  let offset = (page - 1) * limit;
  let where = {};
  if (status != -1) {
    where.status = status;
  }
  // status 1.表示待办 2.表示完成 3.删除
  // 2.分页的处理
  let list = await models.Todo.findAndCountAll({
    where,
    offset,
    limit,
  });
  res.json({
    list,
    message: "列表查询成功",
  });
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.listen(3001, () => {
  console.log("服务启动成功，运行在3001端口~");
});
