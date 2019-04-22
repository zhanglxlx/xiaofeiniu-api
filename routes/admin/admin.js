/***
 * 用户管理路由
 */
const express=require("express");
const pool=require("../../pool");
var router=express.Router();
/**get 请求可以有主体吗？
 * API:GET /admin/login/:aname/:apwd
 * 请求数据 {aname:"xxx",apwd:"123456"}
 * 完成用户登录验证(有的项目情景下，有的会选择POST请求)
 * 返回数据：
 * {code:200,msg:"login  success"}
 * {code:400,msg:"aname or apwd err"}
 */

// get 登录
router.get("/login/:aname/:apwd",(req,res)=>{
    var aname=req.params.aname;
    var apwd=req.params.apwd;
    //需要对用户输入的密码执行进项加密函数
    pool.query("SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)",[aname,apwd],(err,result)=>{
        if(err) {throw err};
        console.log(result);
        if(result.length>0){//查询到一行数据，登录成功
            res.send({code:200,msg:"login success"})
        }else{//没有查询到数据
            res.send({code:400,msg:"aname or apwd err"})
        }
    })
})
/**get 请求可以有主体吗？
 * API:PATCH /admin/login
 * 请求数据 {aname:"xxx",apwd:"123456"}
 * 根据管理员用户名和密码修改管理员密码
 * 返回数据：
 * {code:200,msg:"modified succ"}
 * {code:400,msg:"aname or apwd err"}
 */

// post登录
router.post("/login",(req,res)=>{
    var aname=req.body.aname;
    var apwd=req.body.apwd;
    //需要对用户输入的密码执行进项加密函数
    pool.query("SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)",[aname,apwd],(err,result)=>{
        if(err) {throw err};
        console.log(result);
        if(result.length>0){//查询到一行数据，登录成功
            res.send({code:200,msg:"login success"})
        }else{//没有查询到数据
            res.send({code:400,msg:"aname or apwd err"})
        }
    })
})


/**
 * API:PATCH /admin/login 修改部分数据用patch 
 * 请求数据 {aname:"xxx",oldpwd:"123456",newPwd:"xxx"}
 * 根据管理员用户名和密码修改管理员密码
 * 返回数据：
 * {code:200,msg:"modified succ"}
 * {code:400,msg:"aname or apwd err"}
 */

router.patch("/",(req,res)=>{
    var data=req.body;
    console.log(data.aname);
    console.log(data.oldPwd);
    //首先根据aname和oldpwd查询该用户是否存在
    pool.query("SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)",[data.aname,data.oldPwd],(err,result)=>{
        if(err) {throw err};
        console.log(result);
        if(result.length==0){
            res.send({code:400,msg:"modified not exists"})
            return;
            //查到用户再修改
        }
        pool.query("UPDATE xfn_admin SET apwd=PASSWORD(?) WHERE aname=?",[data.newPwd,data.aname],(err,result)=>{
                if(err) {throw err};
                console.log(result);
                if(result.affectedRows>0){
                    res.send({code:200,msg:"modified succ"});
                }else{
                    res.send({code:401,msg:"Pwd not modified"});
                }
         })
    })
   
})

module.exports=router;