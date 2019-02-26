import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ele from 'element-ui';
// import './permission'; // permission control 权限配置入口（未配）
import 'element-ui/lib/theme-chalk/index.css';
import './styles/index.scss'; // global css
import 'normalize.css/normalize.css'; //样式重置
import i18n from './lang'; //国际化

import './permission';

Vue.use(ele);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App)
}).$mount('#app');

//  iconfont
import './assets/iconfont/iconfont.css';
