# nodejs反向代理服务器实现

## 依赖

> 安装依赖

```shell
npm install express http-proxy-middleware cors
```

## 运行服务器

```shell
node server.js
```

## 使用反向代理

```shell
curl localhost:3000/proxy?url=要代理的地址
```

例:
```shell
localhost:3000/proxy?url=www.baidu.com
```
