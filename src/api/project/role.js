/**
 * created by DELL  2018-10-24
 * @Description 角色管理统一api
 */
import instance from './instance';
// import { convertRESTAPI } from '../util';
//分页获取角色列表
export function rolePage(opts) {
    return instance({
        method: 'post',
        url: 'role/page',
        opts: opts
    });
}

//新增角色
export function addRole(opts) {
    return instance({
        method: 'post',
        url: 'role',
        opts: opts
    });
}

//批量删除角色
export function batchRemove(opts) {
    return instance({
        method: 'DELETE',
        url: 'role/batchRemove',
        opts: opts
    });
}
//通过id查询
export function getById(opts) {
    return instance({
        method: 'get',
        url: 'role/' + opts
        // opts: opts
    });
}
//修改
export function editor(opts) {
    return instance({
        method: 'put',
        url: 'role',
        opts: opts
    });
}

//配置权限：1、获取模块
export function getAllModels(opts) {
    return instance({
        method: 'get',
        url: 'role/user/modules',
        opts: opts
    });
}
//配置权限：2、获取菜单
export function getAllMenus(opts) {
    return instance({
        method: 'get',
        url: 'role/menus?moduleId=' + opts
        // opts: opts
    });
}
//配置权限：3、获取菜单下按钮
export function getAllButton(opts) {
    return instance({
        method: 'get',
        url: 'role/permissions?menuIds=' + opts
        // opts: opts
    });
}
//配置权限：4、总提交
export function postPermissions(opts) {
    return instance({
        method: 'post',
        url: 'role/permissions',
        opts: opts
    });
}

//角色下的成员
export function roleUserList(opts) {
    return instance({
        method: 'post',
        url: 'role/user/page',
        opts: opts
    });
}
//机构下的所有用户
export function userList(opts) {
    return instance({
        method: 'post',
        url: 'user/page',
        opts: opts
    });
}
//添加角色成员
export function addRoleForUserList(opts) {
    return instance({
        method: 'post',
        url: 'role/user',
        opts: opts
    });
}
//删除角色成员
export function delRoleForUser(opts) {
    return instance({
        method: 'DELETE',
        url: 'role/user',
        opts: opts
    });
}
