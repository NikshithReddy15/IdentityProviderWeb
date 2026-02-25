module.exports = {
    '/k/identity/': {
        target: 'https://localhost:7285',
        secure: false,
        changeOrigin: true,
        pathRewrite: { '/k/identity/': '' },
        logLevel: 'warn'
    }
};