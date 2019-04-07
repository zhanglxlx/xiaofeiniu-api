/**
 * mysql数据库连接池
 */
const mysql=require("mysql");
// 创建一个连接池
var pool=mysql.createPool({
    host:'127.0.0.1',//连接数据库地址
    port:'3306',     //数据库端口
    user:'root',     //数据库用户名
    password:'',     //数据库密码
    database:'xiaofeiniu', //数据库名称
    connectionLimit:15

});
module.exports=pool;