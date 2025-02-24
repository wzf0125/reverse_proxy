const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 允许所有跨域请求（生产环境应配置具体域名）
app.use(cors());

// 自定义代理中间件
app.use('/proxy', (req, res, next) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Missing url parameter');
    }

    try {
        // 创建动态代理中间件
        const proxyMiddleware = createProxyMiddleware({
            target: targetUrl,
            changeOrigin: true,
            pathRewrite: {
                '^/proxy': '', // 移除路径中的/proxy前缀
            },
            onProxyRes: (proxyRes) => {
                // 添加 CORS 头
                proxyRes.headers['access-control-allow-origin'] = '*';
                proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
                proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization';

                // 如果需要支持 cookies，请设置以下头（同时需要设置 credentials: 'include'）
                // proxyRes.headers['access-control-allow-credentials'] = 'true';
            },
            logger: console
        });

        // 执行代理
        return proxyMiddleware(req, res, next);
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).send('Proxy error');
    }
});

// 处理 OPTIONS 预检请求
app.options('/proxy', cors());

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});