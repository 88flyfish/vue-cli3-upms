/**
 * created by DELL-PC  2018-10-24
 * @description 全局地址，可配置多个自由切换
 */

import { createAPI } from '../util';
import config from '../config';

export const baseUrl = {
    mock: 'https://www.easy-mock.com/mock/5bbeaeaaf4b86703a7bef6aa/resource',
    dev: 'http://192.168.1.241:9091/upms/',
    pre: '',
    prod: ''
}[config.env || 'mock'];

export default createAPI(baseUrl);
