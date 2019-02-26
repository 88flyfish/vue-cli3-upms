# BaseCA 前端基础框架 vue 全家桶 + ElementUI + iconfont

## 环境

```
node 8.9+ （推荐8.11+） node -v
```

## 浏览器兼容性

```
各大高版本浏览器及IE11+
```

## 屏幕适配兼容性

```
1366×768,1440×900,1920×1028
```

## 安装依赖

```
npm install
```

### 启动项目

```
npm run serve
```

### 打包项目

```
npm run build
```

### 根据 lint 规则格式化代码

```
npm run lint
```

#### iconfont 按类名使用,严格按一下方式使用

```
例：<div class="iconfont icon-xxx">
```

#### 项目布局全部依赖于 layout 组件，详情:

```
https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/layout.html#layout
```

#### 项目请求地址统一配置文件 src/Api/project

```
instance.js为统一请求路径，余下文件为各个模块的请求相对路径
```

#### 项目加载外部插件或者文件统一配置 cdn 地址 src/urlConfig

#### 项目统一滚动条采用<el-scrollbar/>组件

```
使用方法：参照views/layout/components/ApMain.vue
```

#### 主内容区一般情况下会分三块：搜索区、左边目录区、右边列表区，特此提供两个样式组件

```
1、搜索区组件  ButtonPanel  使用样例:
            <div slot='leftTool'>
                <span>姓名：</span>
                <el-input placeholder="请输入内容"></el-input>
                <el-button type="danger" size="mini">查询</el-button>
            </div>
            <div slot='rightTool' class="rightTool">
                <el-button type="primary" size="mini">新增</el-button>
                <el-button type="danger" size="mini">删除</el-button>
            </div>
```

```
2、目录区和列表区组件  WrapPanel  使用样例:
            <WrapPanel :single="true">  //single默认为true，当为true时展示目录区，false隐藏目录区
                <div slot="leftWrap">左</div>
                <div slot="rightWrap">右</div>
            </WrapPanel>
```