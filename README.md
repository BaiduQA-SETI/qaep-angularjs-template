项目启动及前端打包准备工作（命令窗口直接运行sh installPkgDev.sh 或者按一下步骤操作）

1. 安装node (已安装的话请跳过)
    下载地址 http://nodejs.cn/


2. 安装webpack
   npm install webpack -g

3. 安装依赖包
   打开终端,进入前端项目目录（这里new-front)输入: npm install
   进入mockserver 目录： npm install


4. 开发模式(热部署)
   进入new-front目录下依次输入以下命令：
   npm run build
   npm run dev

5. 发布
   npm run prod


PS：
    1. 如果是mac下提示权限问题，请在命令前加 sudo, 如: sudo install 
    2. 提交前端代码，请忽略node_modules 文件夹，这个文件夹是前端打包插件模块
    3. 启动热部署开发模式需两个命令: 
        npm run build
        npm run dev
    4. 发布前请务必 npm run prod 进行相关打包优化措施





另外配上nginx配置如下(不使用nginx做反向代理的可忽略)：

  upstream haichuandev {
      # 本地mock node server
      server 127.0.0.1:3012;
      # 联调测试server
      #server 10.99.83.40:8866;
  }

  server {
        listen 80;
        server_name haichuandev.baidu.com;
        index build/index.html;
        location ~ \.html|xmind|js|css|png|jpeg|jpg|gif|ico|pdf|xlsx|woff|ttf|woff2$  {
            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # webpack热部署dev-server
            proxy_pass http://127.0.0.1:8092;
        }
        location / {
            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://haichuandev;
        }
    }




