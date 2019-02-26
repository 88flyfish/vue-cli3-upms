/**
 * created by DELL  2018-11-15
 * @Description 菜单管理统一api
 */
import instance from './instance';
//分页获取菜单列表
export function getModuleList(opts) {
    return instance({
        method: 'post',
        url: 'module/page',
        opts: opts
    });
}

//新增角色
export function addModule(opts) {
    return instance({
        method: 'post',
        url: 'module',
        opts: opts
    });
}

//通过ID删除菜单
export function deleteModule(opts) {
    return instance({
        method: 'delete',
        url: 'module/delete/' + opts
    });
}
//批量删除
export function batchDeleteModule(opts) {
    return instance({
        method: 'delete',
        url: '/module/batchRemove',
        opts: opts
    });
}
//通过id查询
export function getById(opts) {
    return instance({
        method: 'get',
        url: 'module/'+opts
    });
}
//修改
export function modify(opts) {
    return instance({
        method: 'put',
        url: 'module',
        opts: opts
    });
}
