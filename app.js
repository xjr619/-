var http = require("http");
// 移入渲染模块
var render = require("./render.js");
var router = require("./router.js");
// 建立服务器
var server = http.createServer();
server.on("request", function (req, res) {
  // 如果请求是根目录就开始渲染
  render(res);
  router(req,res);
});
server.listen(3000, function () {
  console.log("服务器已启动");
})
