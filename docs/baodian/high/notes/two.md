## vuepress使用教程

### 首先安装vuepress把默认的跑起来

### 自定义配置

#### 导航栏
`nav: require('./nav'),`
`sidebar: require('./sidebar')`

nav里面点击的话可以链接link: '/baodian/zero/'


#### 侧边栏
侧边栏配置到了'/guide/': require('../guide/sidebar') 就直接调用此文件->
然后配置这个子路由 
children:[
         '/guide/notes/one',//指向相关.md
      ]
      PS：这里到guide 未指定目录的话 默认是使用README.md展示
      one就是主要的.md文件