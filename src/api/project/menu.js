/**
 * created by DELL  2018-11-15
 * @Description 菜单管理统一api
 */
import instance from './instance';
//分页获取菜单列表
export function getMenuList(opts) {
    return instance({
        method: 'post',
        url: 'menu/page',
        opts: opts
    });
}

//新增角色
export function addMenu(opts) {
    return instance({
        method: 'post',
        url: 'menu',
        opts: opts
    });
}

//通过ID删除菜单
export function deleteMenu(opts) {
    return instance({
        method: 'DELETE',
        url: 'menu/delete/' + opts
    });
}
//批量删除
export function batchDeleteMenu(opts) {
    return instance({
        method: 'delete',
        url: '/menu/batchRemove',
        opts: opts
    });
}
//通过id查询
export function getById(opts) {
    return instance({
        method: 'get',
        url: 'menu/' + opts
    });   
}
//修改
export function modify(opts) {
    return instance({
        method: 'put',
        url: 'menu',
        opts: opts
    });
}
