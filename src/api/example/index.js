/**
 * created by DELL
 * @Description 样例，不参与实际调用，也可以写demo
 * @example  两种模式，各取所需
 * 调用模式1：
 * async getData() {
       const result = await proxy_get({
           params: {
               id: '001'
           }
       });
       console.log(result);
 }
 调用模式2：
 getData() {
      proxy_get().then((result) => {
           console.log(result);
      });
 }
 */

import instance from './instance';
import { convertRESTAPI } from '../util';

/** 支持接口代理的 mock，试试在 url 上加 ?s={数字} */
function proxy_get(opts) {
    return instance({
        method: 'get',
        url: '/proxy',
        opts: opts
    });
}

/** 带随机数据的 mock */
function mock_get(opts) {
    return instance({
        method: 'get',
        url: '/mock',
        opts: opts
    });
}

/** 自定义响应的 mock */
function _get(opts) {
    return instance({
        method: 'get',
        url: '/',
        opts: opts
    });
}

/** 这只是一个响应 post 接口返回随机数据的例子 */
function upload_post(opts) {
    return instance({
        method: 'post',
        url: '/upload',
        opts: opts
    });
}

/** 根据请求参数返回指定数据，试试在 url 上加 ?name={任意值} */
function query_get(opts) {
    return instance({
        method: 'get',
        url: '/query',
        opts: opts
    });
}

/** 支持 restful 的 mock，替换 id 试试 */
function restful_id_list_get(opts) {
    return instance({
        method: 'get',
        url: convertRESTAPI('/restful/:id/list', opts),
        opts: opts
    });
}

export { proxy_get, mock_get, _get, upload_post, query_get, restful_id_list_get };
