/***
 * 全局设置路由器
 */
const express=require("express");
const pool=require("../../pool");
var router=express.Router();
module.exports=router;
/**
 * GET /admin/table
 * 获取所有信息桌台信息
 * 返回数据：{tid:"xx",tname:"xxx",status:" "}
 */
router.get("/",(req,res)=>{
    pool.query("SELECT * FROM xfn_table ORDER BY tid",(err,result)=>{
        if(err) {throw err};
        res.send(result);
    })
})
/**
 * put /admin/table
 * 请求数据：{tid:"xx":adminUrl:"xxx",appurl:"xxx",....}
 * 修改桌台信息
 * 返回数据：{code:200,msg:"settings updated success"}
 */
// router.put("/",(req,res)=>{
//     pool.query("UPDATE xfn_table SET ?",req.body,(err,result)=>{
//         if(err) {throw err};
//         res.send(result);
//     })
// })