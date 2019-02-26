import instance from './instance';

/**
 * created by DELL  2018-10-24
 * @Description 用户管理统一api
 */
// import instance from './instance';

// import { convertRESTAPI } from '../util';
export function getUserList(opts) {
    return instance({
        method: 'post',
        url: 'user/page',
        opts: opts
    });
}

export function saveUser(opts) {
    return instance({
        method: 'post',
        url: '/user',
        opts: opts
    });
}

export function deleteUser(opts) {
    return instance({
        method: 'delete',
        url: '/user/' + opts
    });
}

export function batchDeleteUser(opts) {
    return instance({
        method: 'delete',
        url: '/user/batchRemove',
        opts: opts
    });
}

/**
 * 获取登录用户的授权信息
 * @param opts
 */
export function getUserAuths() {
    return instance({
        method: 'get',
        url: '/user/role/list'
    });
}

/**
 * 根据用户ID获取已授权信息
 * @param opts
 */
export function getUserAuthsById(userId) {
    return instance({
        method: 'get',
        url: `/user/${userId}/role/list`
    });
}

/**
 * 用户授权
 * @param opts
 */
export function authsUser(opts) {
    return instance({
        method: 'post',
        url: '/user/role',
        opts: opts
    });
}

/**
 * 启用用户
 * @param opts
 */
export function enableUser(opts) {
    return instance({
        method: 'put',
        url: '/user/enable',
        opts: opts
    });
}

/**
 * 禁用用户
 * @param opts
 */
export function disableUser(opts) {
    return instance({
        method: 'put',
        url: '/user/disable',
        opts: opts
    });
}
