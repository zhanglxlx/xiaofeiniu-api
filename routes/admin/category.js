/**
 * 菜名类别路由
 */
//创建路由
 const express=require("express");
const pool=require("../../pool");
var router=express.Router();

/**查询菜品
 * API ：GET /admin/category  获取数据
 * 含义：客户端获取所有的彩品类别,按编号升序排列
 * 返回值：[{cid:1,cname:"},{...}]
 */
router.get("/",(req,res)=>{
    pool.query("SELECT * FROM xfn_category ORDER BY cid",(err,result)=>{
        if(err){throw err};
        if(result.affectedRows>0){
            var jsonData=JSON.stringify(result);
            res.send("doData('+jsonData+')");
        }else{
            res.send({code:400,msg:"查询失败"})
        }

    })
})
/**删除菜品
 * API :DELETE /admin/category/:cid 删除
 * 含义：根据表示菜品编号的路由参数，删除该菜品
 * 返回值：{code:200,msg:"1 category deleted"}
 * 返回值：{code:400,msg:"0 category deleted"}
 */
router.delete("/:cid",(req,res)=>{
    //注意：删除菜品类别钱必须先把属于该类别的菜品的类别编号设置为null
    pool.query("UPDATE xfn_dish SET categoryID=NULL  WHERE categoryID=?",req.params.cid,(err,result)=>{
        if(err){throw err};
        //至此指定类别的菜品已经修改完毕
        pool.query("DELETE FROM xfn_category WHERE cid=?",req.params.cid,(err,result)=>{
            if(err){throw err};
            if(result.affectedRows>0){
                res.send({code:200,msg:"1 category deleted"})
            }else{
                res.send({code:400,msg:"0 category deleted"})
            }
        })
    })
})
/**添加菜品
 * API :POST /admin/category   添加 幂等
 * 请求参数：请求主体 {cname:"xxx"}
 * 含义：添加新的菜品类别
 * 返回值：{code:200,msg:"1 category POST",cid:x}
 */
router.post("/",(req,res)=>{
    pool.query("INSERT INTO xfn_category SET ?",req.body,(err,result)=>{ //注意此处SQL语句的简写
        if(err){throw err};
        if(result.affectedRows>0){
            res.send({code:200,msg:"1 category added"})
        }else{
            res.send({code:400,msg:"category added"})
        }

    })
})
/**更新菜品
 * API :PUT /admin/category   修改
 * PATCH  (部分修改)
 * 请求参数：请求主体 {cid:x,cname:""}
 * 含义：根据菜品类别编号修改该类别
 * 返回值：{code:200,msg:"1 category modified"}
 * 返回值：{code:400,msg:"0 category modified ，not exists"} 类别不存在
 * 返回值：{code:401,msg:"0 category modified no modification"} 修改的名字和以前是一样的
 */
router.put("/",(req,res)=>{
    //todo此处可以对数据进行验证
    pool.query("UPDATE xfn_category SET ? WHERE cid=?",[req.body,req.body.cid],(err,result)=>{
        //注意此处SQL语句的简写
        if(err){throw err};
        if(result.changedRows>0){  //实际更新了一行
            res.send({code:200,msg:"1 category modified"})
        }else  if(result.affectedRows==0){
            res.send({code:400,msg:"category not exists "})
        }else if(result.affectedRows==0&&result.affectedRows==0){ //
            res.send({code:401,msg:"no category modified"})
        }
    })
})

module.exports=router;