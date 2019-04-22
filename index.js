/**
 * 小肥牛扫码点餐项目-API子系统
 */
// 创建一个端口
const PORT=8090;
// 引入express
const express=require("express");
const  cors=require("cors");
// 中间件 获取post请求的数据
const bodyParser=require("body-parser");



const categoryRoutes=require("./routes/admin/category");
const adminRoutes=require("./routes/admin/admin");
const dishRoutes=require("./routes/admin/dish");
const settingsRoutes=require("./routes/admin/settings");
const tableRoutes=require("./routes/admin/table");

//启动主服务器  创建http应用服务器
var app=express();
app.listen(PORT,()=>{console.log("api服务器启动成功啦")});
//app.use(bodyParser.urlencoded({}))  //把application/x-www-form-urlencoded 格式的请求主题数据解析出来放入req.body属性
app.use(bodyParser.json() ); //把json格式的请求肢体数据解析出来放入req.body属性
// 使用中间件,解决跨域问题
app.use(cors());

// 挂在admin文件

app.use('/admin/category',categoryRoutes);
app.use('/admin/admin',adminRoutes);
app.use('/admin/dish',dishRoutes);
app.use('/admin/settings',settingsRoutes);
app.use('/admin/table',tableRoutes);
// 挂载顾客App  必需的路由器
//app.use('/dish',dishRoutes);