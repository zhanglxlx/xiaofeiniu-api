/***
 * 菜品相关路由
 */
const express=require("express");
const pool=require("../../pool");
var router=express.Router();

/**
 * API:GET /admin/dish
 * 获取所有的菜品（按类别进行分类）
 * 返回数据：
 * [
 *      {cid:1,cname:"内类"，dishList:[{},{},{}]}
 *      {cid:2,cname:"菜类"，dishList:[{},{},{}]}
 * ]
 */
router.get("/",(req,res)=>{
    //为了获得所有菜品，必须先查询菜品类别
    pool.query("SELECT cid,cname FROM xfn_category ORDER BY cid",(err,result)=>{
            if(err) {throw err};
            var categoryList=result;  //类别列表
            var finishCount=0;//已经查询完菜品的类别数量
            //循环遍历每一个菜品类别，查询改类别下那些菜品
            //for(var c of categoryList){  闭包，只能执行最后一个 c
            for(let c of categoryList){
                pool.query("SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC" ,c.cid,(err,result)=>{
                    if(err) {throw err};
                    c.dishList=result;
                    //必须保证所有的类别下的菜品都查询完成才能发送响应信息--这些查询都是异步的
                    finishCount++;
                    if(finishCount==categoryList.length){
                        res.send(categoryList);
                    }
                })
            }
        
    })
})

/**
 * API:POST /admin/dish/image
 * 请求参数：
 * 接收客户端上传的菜品图片，保存在服务器上，返回改图片在服务器上的随机文件名
 * 返回数据：
 * {code:200,msg:"upload success"  fileName:"13512873612-2323.jpg" }
 */
// 引入multer 中间件
const multer=require("multer");
const fs=require("fs");
var upload=multer({
    dest:"uploads/"  //指定客户端上传的文件临时存储路径
})
//定义路由，使用文件上传中间件  一个文件上传用 ：single()
router.post("/image",upload.single('dishImg'),(req,res)=>{
    //console.log(req.file+".jpg");  //客户端上传的文件
    //把客户端长传到文件从临时目录转移到永久的图片路劲下
    var uploadsFile=req.file.path;
    //req.file.originalname.substring 原始文件名截取子串
    var suffix=req.file.originalname.substring( req.file.originalname.lastIndexOf(" . ") );//原始文件名中的后缀部分
    var newFile=randFileName(suffix);
    fs.rename(uploadsFile,'img/dish/'+newFile,()=>{  //rename 重新命名文件
        res.send({code:200,mdg:"upload success",fileName:newFile })
        //把文件重命名，把临时文件转移
    })
    // pool.query("INSERT INTO xfn_dish SET ?",[req.file],(err,result)=>{
    //     if(err) {throw err};
    //     res.send(result)
    // })
})
// 生成一个随机数文件名
// 参数：suffix表示要生成的文件名中的后缀
// 形参：1351224631-8821.jpg
function randFileName(suffix){
    var time=new Date().getTime();//当前系统时间戳
    var num=Math.floor(Math.random()*(10000-1000)+1000);
    return time+'-'+num+suffix;
}

/**添加
 * API:POST /admin/dish
 * 请求参数：{title:"xxx",imgUrl:"...jpg",price:xxx,detail:"xxx",categoryId:xxx}
 * 添加新的菜品
 * 返回数据：
 * {code:200,msg:"dish added success"  dishId:46 }
 */
router.post("/",(req,res)=>{
    console.log(req.body);
    pool.query("INSERT INTO xfn_dish SET ?",req.body,(err,result)=>{
        if(err) {throw  err}
        res.send({code:200,msg:"dish added success",dishId:result.insertId}) //将INSERT 语句产生的自增编号输出给客户端
    })
})
/**删除
 * API:DELETE /admin/dish/:did
 * 根据指定的菜品编号删除该菜品
 * 输出数据：
 * {code:200,msg:"dish deleted success" }
 * {code:400,msg:"dish not exists" }
 */
router.delete("/:tid",(req,res)=>{
    //注意：删除菜品类别钱必须先把属于该类别的菜品的类别编号设置为null
    pool.query("SELECT * FROM xfn_table WHERE tid= ?",req.params.tid,(err,result)=>{
        if(err){throw err};
        if(result.length>0){
            pool.query("DELETE FROM xfn_table WHERE tid= ?",req.params.tid,(err,result)=>{
                if(err){throw err};
                if(result.affectedRows>0){
                    res.send({code:200,msg:"1 category deleted"})
                }else{
                    res.send({code:400,msg:"0 category deleted"})
                }
            })
        }else{
            res.send({code:401,msg:"delete tid no exists "})
        }


    })
})

/**修改
 * API:PUT /admin/dish
 * 请求参数：{did:xxx,title:"xxx",imgUrl:"...jpg",price:xxx,detail:"xxx",categoryId:xxx}
 * 返回数据：
 * {code:200,msg:"dish updated success"}
 * {code:400,msg:"dish not exists" }
 */

router.put('/', (req, res)=>{
    var data = req.body; //请求数据{cid:xx, cname:'xx'}
    //TODO: 此处可以对数据数据进行验证
    pool.query('UPDATE xfn_dish SET ? WHERE did=?', [data, data.did], (err, result)=>{
        if(err)throw err;
        if(result.changedRows>0){  //实际修改了一行
            res.send({code:200, msg: '1 category modified'})
        }else if(result.affectedRows==0){  //影响到0行
            res.send({code:400, msg:'category not exits'})
        }else if(result.affectedRows==1 && result.changedRows==0){ //影响到1行，但修改了0行——新值与旧值完全一样
            res.send({code:401, msg:'no category modified'})
        }
    })
})
/**
 * API:POST /admin/dish
 * 添加一个新的菜品
 * 
 */


module.exports=router; 