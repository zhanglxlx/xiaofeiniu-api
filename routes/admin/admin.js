/***
 * 用户管理路由
 */
const express=require("express");
const pool=require("../../pool");
var router=express.Router();
/**get 请求可以有主体吗？
 * API:get /admin/login
 * 请求数据 {aname:"xxx",apwd:"123456"}
 * 完成用户登录验证
 * 返回数据：
 * {code:200,msg:"login  success"}
 * {code:400,msg:"aname or apwd err"}
 */
router.get("/login",(req,res)=>{
    pool.query("SELECT * FROM xfn_admin WHERE aname=? AND apwd=?",[req.body.aname,req.body.apwd],(err,result)=>{
        if(err) {throw err};
        if(result.affectedRows>0){
            res.send({code:200,msg:"login success"})
        }else{
            res.send({code:400,msg:"aname or apwd err"})
        }
    })
    console.log(1);
})

/**get 请求可以有主体吗？
 * API:PATCH /admin/login
 * 请求数据 {aname:"xxx",apwd:"123456"}
 * 根据管理员用户名和密码修改管理员密码
 * 返回数据：
 * {code:200,msg:"modified succ"}
 * {code:400,msg:"aname or apwd err"}
 */
module.exports=router;