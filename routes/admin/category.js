/**
 * 菜名类别路由
 */
//创建路由
 const express=require("express");
const pool=require("../../pool");
var router=express.Router();

module.exports=router;
/**
 * API ：GET /admin/category  获取数据
 * 含义：客户端获取所有的彩品类别,按编号升序排列
 * 返回值：[{cid:1,cname:"},{...}]
 */
router.get("/",(req,res)=>{
    pool.query("SELECT * FROM xfn_category ORDER BY cid",(err,result)=>{
        if(err){throw err};
        var jsonData=JSON.stringify(result);
        res.send("doData('+jsonData+')");
    })
})
/**
 * API :DELETE /admin/category/:cid 删除
 * 含义：根据表示菜品编号的路由参数，删除该菜品
 * 返回值：{code:200,msg:"1 category deleted"}
 * 返回值：{code:400,msg:"0 category deleted"}
 */
router.delete("/:cid",(req,res)=>{
    if(!req.params.cid){
        res.send({code:403,msg:"cid is not exists"});
        return;
    }
    pool.query("SELECT * FROM xfn_category WHERE cid=?",req.params.cid,(err,result)=>{
        if(err){throw err};
        if(result.affectedRows>0){
            pool.query("DELETE FROM xfn_category WHERE cid=?",req.params.cid,(err,result)=>{
                if(err){throw err};
                if(result.affectedRows>0){
                    res.send({code:200,msg:"1 category deleted"})
                }else{
                    res.send({code:200,msg:"0 category deleted"})
                }
            })
        }else{
            res.send({code:404,msg:"cid is not exists"});
        }
    })

})
/**
 * API :POST /admin/category   添加
 * 请求参数：请求主体 {cname:""}
 * 含义：添加新的菜品类别
 * 返回值：{code:200,msg:"1 category POST",cid:x}
 */
router.post("/add",(req,res)=>{
    var cname=req.body.cname;
    if(!cname){
        res.send({code:401,msg:"菜品名称不能为空"});
        return;
    }
    pool.query("INSERT INTO xfn_category VALUES ?",[req.body],(err,result)=>{
        if(err){throw err};
        if(result.affectedRows>0){
            res.send({code:200,msg:"1 category add",cid:NULL})
        }else{
            res.send({code:201,msg:"0 category add"})
        }
    })
})
/**
 * API :PUT /admin/category   修改
 * PATCH  (部分修改)
 * 请求参数：请求主体 {cid:x,cname:""}
 * 含义：根据菜品类别编号修改该类别
 * 返回值：{code:200,msg:"1 category modified"}
 * 返回值：{code:400,msg:"0 category modified ，not exists"} 类别不存在
 * 返回值：{code:401,msg:"0 category modified no modification"} 修改的名字和以前是一样的
 */