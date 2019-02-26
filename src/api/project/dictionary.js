/**
 * created by DELL
 * @Description 数据字典统一api
 */
import instance from './instance';

// import { convertRESTAPI } from '../util';

export function getTree(opts) {
    return instance({
        method: 'get',
        url: '/dictionary',
        opts: opts
    });
}

//
// export function selectDictionaryById(obts){
//     return instance({
//         method:'get',
//         url:`/dictionary/${obts}`
//     })
// }

export function editDictionary(opts) {
    return instance({
        method: 'put',
        url: '/dictionary',
        opts: { data: opts }
    });
}

export function removeDictionary(opts) {
    return instance({
        method: 'delete',
        url: `/dictionary/${opts}`
    });
}

export function logicBatchDelete(opts) {
    return instance({
        method: 'delete',
        url: '/dictionary/logicBatchDelete',
        opts: { data: opts }
    });
}

export function addDictionary(opts) {
    return instance({
        method: 'post',
        url: '/dictionary',
        opts: { data: opts }
    });
}

export function getTable(opts) {
    return instance({
        method: 'post',
        url: '/dictionary/page',
        opts: { data: opts }
    });
}

export function proxy_get(opts) {
    return instance({
        method: 'get',
        url: '/proxy',
        opts: opts
    });
}
