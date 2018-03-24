// 移入渲染模块要的核心模块
var fs = require("fs");
var template = require("art-template");
module.exports = function(res){
  res.render = function(path,obj,callback){
    // 约定渲染的文件为views下的文件
    path = "./views/" + path;
    fs.readFile(path,function(err,data){
      if(err){
        callback(err);
      }else{
        var html = template.compile(data.toString())(obj || {});
        callback(null,html);
      }
    })
  }
}
// 定义一个渲染函数
// function render(res){
//   res.render = function(path,obj,callback){
//     // 约定渲染的文件为views下的文件
//     path = "./views/" + path;
//     fs.readFile(path,function(err,data){
//       if(err){
//         callback(err);
//       }else{
//         var html = template.compile(data.toString())(obj || {});
//         callback(null,html);
//       }
//     })
//   }
// }