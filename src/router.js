import Vue from 'vue';
import Router from 'vue-router';

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/* Layout */
import Layout from './views/layout/Layout';

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
    { path: '/login', component: () => import('./views/login/index'), hidden: true },
    { path: '/404', component: () => import('./views/404'), hidden: true },

    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index'),
                name: 'Dashboard',
                meta: { title: 'dashboard', icon: 'iconfont icon-cloud', noCache: true }
            }
        ]
    },
    {
        path: '/org',
        component: Layout,
        redirect: 'organization',
        children: [
            {
                path: '',
                component: () => import('@/views/organization/index'),
                name: 'Organization',
                meta: { title: 'organization', icon: 'iconfont icon-tree1', noCache: true }
            }
        ]
    },
    {
        path: '/role',
        component: Layout,
        redirect: 'role',
        children: [
            {
                path: '',
                component: () => import('@/views/role/index'),
                name: 'Role',
                meta: { title: 'role', icon: 'iconfont icon-users', noCache: true }
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        redirect: 'user',
        children: [
            {
                path: '',
                component: () => import('@/views/user/index'),
                name: 'User',
                meta: { title: 'user', icon: 'iconfont icon-account_box', noCache: true }
            }
        ]
    },
    {
        path: '/menu',
        component: Layout,
        redirect: 'menu',
        children: [
            {
                path: '',
                component: () => import('@/views/menu/index'),
                name: 'menu',
                meta: { title: 'menu', icon: 'iconfont icon-clipboard2', noCache: true }
            }
        ]
    },
    {
        path: '/module',
        component: Layout,
        redirect: 'module',
        children: [
            {
                path: '',
                component: () => import('@/views/module/index'),
                name: 'module',
                meta: { title: 'module', icon: 'iconfont icon-local_library', noCache: true }
            }
        ]
    },
    {
        path: '/dictionary',
        component: Layout,
        redirect: '',
        children: [
            {
                path: '',
                component: () => import('./views/dictionary/index'),
                name: 'Dictionary',
                meta: { title: 'dictionary', icon: 'iconfont icon-view_comfy', noCache: true }
            }
        ]
    },
    {
        path: 'external-link',
        component: Layout,
        children: [
            {
                path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
                meta: { title: 'external link', icon: 'iconfont icon-log-out' }
            }
        ]
    },

    { path: '*', redirect: '/404', hidden: true }
];

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
});
