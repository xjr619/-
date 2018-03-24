// 引入需要的模块
var fs = require("fs");
var handler = require("./handler.js");
module.exports = function(req,res){
  var url = req.url;
  if (url === "/" && req.method.toLowerCase() == "get") {
    // 首页展示
    handler.getIndex(req,res);
  } else if (url.indexOf('/node_modules') === 0 || url.indexOf('/imgs') === 0) {
    // 静态资源处理
      handler.getStatic(req,res);
  } else if (url.indexOf("/add") === 0 && req.method.toLowerCase() == "get") {
    //  进入新增页面把新增页面返回给浏览器渲染
    handler.addGet(req,res);
  } else if (url.indexOf("/add") === 0 && req.method.toLowerCase() == "post") {
    // 进入新增页面进行表单提交的时候
    handler.addPost(req,res);
  } else if (url.indexOf("/edit") === 0 && req.method.toLowerCase() == "get") {
    // 跳到修改界面
      handler.editGet(req,res);
  } else if (url.indexOf("/edit") === 0 && req.method.toLowerCase() == "post") {
    //  收集提交的数据
      handler.editPost(req,res);
  } else if (url.indexOf("/upload") ===0 && req.method.toLowerCase() == "post"){
    // 图片预览部分
    handler.upload(req,res);
  }else if(url.indexOf("/del")===0 && req.method.toLowerCase() == "post"){
    // 删除部分
    handler.del(req,res);
  }
}