/**
 * 小肥牛扫码点餐项目-API子系统
 */
console.log(new Date().toLocaleString());
// 创建一个端口
const PORT=8090;
// 引入express
const express=require("express");
const  cors=require("cors");
const bodyParser=require("body-parser");
const categoryRoutes=require("./routes/admin/category");

//启动主服务器  创建http应用服务器
var app=express();
app.listen(PORT,()=>{console.log("api服务器启动成功啦")});
app.use(bodyParser.urlencoded({
    extended:false
}) );
// 使用中间件,解决跨域问题
app.use(cors());

// 挂在admin文件
app.use('/admin/category',categoryRoutes);