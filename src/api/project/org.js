/**
 * created by DELL  2018-10-24
 * @Description 机构管理统一api
 */
import instance from './instance';
// import { convertRESTAPI } from '../util';
//所有机构
export function getList(opts) {
    return instance({
        method: 'GET',
        url: 'org/list',
        opts: opts
    });
}

//新增机构
export function updata(opts) {
    return instance({
        method: 'post',
        url: 'org',
        opts: opts
    });
}

//删除机构
export function singleDelete(opts) {
    return instance({
        method: 'delete',
        url: 'org/' + opts
        // opts: opts
    });
}

//机构通过id查询
export function getById(opts) {
    return instance({
        method: 'get',
        url: 'org/' + opts
        // opts: opts
    });
}

//修改
export function editor(opts) {
    return instance({
        method: 'put',
        url: 'org',
        opts: opts
    });
}
