module.exports = {
    title: '前端小册', 
    description: 'FE-GuideBook',
    head: [
        ['link', { rel: 'icon', href: '/img/logo.ico' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
    ],
    themeConfig: {
    //  nav: [
    //      { text: '主页', link: '/' },
    //      { text: '前端',
    //        items: [
    //          { text: 'JavaScript', link: '/javascript/' },
    //          { text: '网络安全', link: '/ios/' },
    //          { text: 'Web', link: '/web/' }
    //        ] 
    //      },
    //      { text: '关于', link: '/about/' },
    //      { text: 'Github', link: 'https://www.github.com/him-wen' },
    //  ],
    //直接引用导出的js
    nav: require('./nav'),
     sidebar: require('./sidebar'),
     sidebarDepth: 2,
     lastUpdated: 'Last Updated', 
 },
}