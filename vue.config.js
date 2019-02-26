module.exports = {
    // 选项...
    baseUrl: './',
    outputDir: 'dist',
    assetsDir: 'assets',
    indexPath: 'index.html',
    filenameHashing: false,
    pages: undefined,
    lintOnSave: true,
    runtimeCompiler: false,
    transpileDependencies: [],
    productionSourceMap: false,
    crossorigin: undefined,
    integrity: false,
    devServer: {
        //代理
        host: 'localhost',
        port: 8085
        // proxy: 'http://localhost:8085/'
        // proxy: {
        //     '/upms': {
        //         target: 'http://192.168.1.139:9091/',
        //         changeOrigin: true,
        //         ws: true,
        //         pathRewrite: {
        //             '^/upms': ''
        //         }
        //     }
        // }
    }
};
