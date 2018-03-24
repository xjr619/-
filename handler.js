const fs = require("fs");
const uurl = require("url");
const path = require("path");
const formidable = require('formidable');
// 首页加载
module.exports.getIndex = function(req,res){
              // 如果没有错误就读取json文件的数据然后进行渲染
              fs.readFile("./data.json", function (err1, heros) {
                if (err1) {
                  res.end(err1)
                } else {
                  // 得到数据转化的过程中把数据转化成过程中药转化成json对象，因为模板只能识别数组或者对象
                  var herosObj = JSON.parse(heros.toString());
                  res.render("index.html",herosObj,function(err,html){
                    if(err){
                      res.end("err")
                    }else{
                      res.end(html);
                    }
                  })
                }
           });
}
// 静态资源加载
module.exports.getStatic = function(req,res){
      // 加载静态资源
      var url = req.url;
      fs.readFile("." + url, function (err, data) {
        if (err) {
          res.end('err')
        } else {
          res.end(data);
        }
      })
}
// 进入新增页面
module.exports.addGet = function(req,res){
  fs.readFile("./views/add.html", function (err, data) {
    if (err) {
      res.end(err)
    } else {
      res.end(data.toString());
    }
  })
}
// 新增页面的添加
module.exports.addPost = function(req,res){
  // 步骤
  // 1.获取传过来的数据用一个空对象进行保存
  // 2.读取json文件添加有数据的对象
  // 3.重新写入
  var form = new formidable.IncomingForm();
  // 用formidable得到发过来的数据信息
  form.uploadDir = "./imgs";
  form.keepExtensions = true;
  // 获取数据之后进行处理
  form.parse(req,function(err,fields,files){
    // 读取文件
    fs.readFile("./data.json",(err1,heros)=>{
       if(err1){
         res.end("err")
       }else{
         var  heroObj = JSON.parse(heros.toString());
        //  获取最后一个id若长度等于0则灵当前灵当前id为0
        var id = 0;
        if(heroObj.heros.length ==0){
           id=1;
        }else{
          //长度不为0的话id就是最后一个的id加1
          id = heroObj.heros[heroObj.heros.length-1].id +1;
        }
          var imgsrc = path.parse(fields.img).base;
          // 重新给files加上id和重新定义路径
          fields.img =imgsrc;
          fields.id = id;
        //  把对象推进数据中
        heroObj.heros.push(fields);
        // 把新的数据写入data.json中
        fs.writeFile("./data.json",JSON.stringify(heroObj,null,"  "),err2=>{
           if(err2){
             var returnObj={
               msg:"新增失败",
               status:0
             }
             res.end(JSON.stringify(returnObj));
           }else{
            var returnObj={
              msg:"新增成功",
              status:1
            }
            res.end(JSON.stringify(returnObj));
           }
        })
       }
    })
  })

}
// module.exports.addPost = function(req,res){
//       //  得到提交过来的表数据
//       var str = "";
//       // 数据提交时触发
//       req.on("data", function (chunk) {
//         str += chunk;
//       })
//       // 数据提交完全触发
//       req.on("end", function () {
//         //  提交完全后对数据进行解码
//         str = decodeURI(str);
//         // 读取json文件把数据拿出来
//         fs.readFile("./data.json", function (err, data) {
//           if (err) {
//             res.end("err");
//           } else {
//             var herosObj = JSON.parse(data.toString());
//             // 建立空对象保存发送过来的信息
//             var strObj = {};
//             var strArr = str.split("&");
//             for (var i = 0; i < strArr.length; i++) {
//               var keyValue = strArr[i].split("=");
//               strObj[keyValue[0]] = keyValue[1];
//             }
//             // 获取json数据
//             var heroObj = JSON.parse(data.toString());
//             // 得到最后一个英雄的id给当前要加的对象id定义为最后一个英雄id加1
//             var id = heroObj.heros[heroObj.heros.length - 1].id + 1;
//             strObj["id"] = id;
//             // 添加当前对象进数据里面
//             heroObj.heros.push(strObj);
//             // 重新写入数据进json文件成功时返回首页展示
//             fs.writeFile("./data.json", JSON.stringify(heroObj, null, "  "), function (err1) {
//               if (err1) {
//                 res.end("err1");
//                 console.log("写入失败");
//               } else {
//                 // 写入成功跳回首页
//                 res.end("<script>alert('success');window.location='/'</script>");
//               }
//             })
//           }
//         })
//       })
// }
// 渲染修改界面
module.exports.editGet = function(req,res){
  
        //  得到传过来的url的id根据id查找对应数据进行填充
        var url = req.url;
        var id = uurl.parse(url, true).query.id;
        // 读取文件查询id对应信息
        fs.readFile("./data.json", function (err1, hero) {
          if (err1) {
            res.end("err1")
          } else {
            var heroObj = {};
            var heroObjs = JSON.parse(hero.toString());
            for (var i = 0; i < heroObjs.heros.length; i++) {
              if (id == heroObjs.heros[i].id) {
                // 找到对应的id保存进对象里面
                heroObj = heroObjs.heros[i];
                break;
              }
            }
              res.render("edit.html",heroObj,function(err,html){
                  if(err){
                    res.end("err")
                  }else{
                    res.end(html);
                  }
              })
          }
        })
}
// 修改方面的逻辑
module.exports.editPost = function(req,res){
  var str = "";
  var obj = {};
  req.on("data", function (chunck) {
    str += chunck;
  });
  // 数据获取完毕
  req.on("end", function () {
    str = decodeURI(str);
    var strArr = str.split("&");
    for (var i = 0; i < strArr.length; i++) {
      var keyValue = strArr[i].split("=");
      obj[keyValue[0]] = keyValue[1];
    }
  // 读取文件找到相应对应id的数据
    fs.readFile("./data.json",function(err,hero){
      if(err){
        res.end(err);
      }else{
          var heroObjs = JSON.parse(hero.toString());
          heroObjs.heros.forEach(function(value,key){
            if(value.id == obj.id){
              // 如果找到就把修改后的obj的值给value
              value.name = obj.name;
              value.gender = obj.gender;
            }
          });
          // 修改完毕写文件
        fs.writeFile("./data.json",JSON.stringify(heroObjs,null,"  "),function(err1){
            if(err1){
              res.end("err1");
            }else{
              res.end("<script>alert('success');window.location ='/';</script>");
            }
        })
      }
    })
  })
}
// 图片预览部分
module.exports.upload = function(req,res){
    // 步骤
  
    var form = new formidable.IncomingForm();
    // 用formidable得到发过来的数据信息
    form.uploadDir = "./imgs";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
          if(err){
            var returnObj = {
              msg:"操作失败",
              status:0
            }
            res.end(JSON.stringify(returnObj));
          }else{
          //  console.log(fields);
          //  console.log(files);
          //  调用路径模块获取路径返回给
          var imgPath = path.parse(files.img.path);
          var imgsrc = imgPath.base;
          var returnObj = {
            src:"/imgs/" + imgsrc,
            msg:"success"
          }
            res.end(JSON.stringify(returnObj));
          }  
    });
}
// 删除部分
module.exports.del = function(req,res){
  var form = new formidable.IncomingForm();
  form.uploadDir = "./imgs";
  form.keepExtensions = true;
  form.parse(req, function(err, fields, files) {
    var id = fields.id;
    // 读文件
    fs.readFile("./data.json",(err1,heros)=>{
      if(err1){
        res.end("err")
      }else{
        var heroObj = JSON.parse(heros.toString());
        // 遍历对象找到id
        heroObj.heros.forEach((value,index)=>{
            if(value.id==id){
              heroObj.heros.splice(index,1);
            }
        });
        // 删除成功重新写入data
        fs.writeFile("./data.json",JSON.stringify(heroObj,null,"  "),(err2)=>{
          if(err2){
            var returnObj = {
              msg:"删除失败",
              status:0
            }
            res.end(JSON.stringify(returnObj));
          }else{
            var returnObj = {
              msg:"删除成功",
              status:1
            }
            res.end(JSON.stringify(returnObj));
          }
        });
      };
    });
  });
}