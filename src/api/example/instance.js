import { createAPI } from '../util';
import config from '../config';

const baseUrl = {
    mock: 'https://www.easy-mock.com/mock/5ab9b7eefe62cc6badfbd285/example',
    dev: '',
    pre: '',
    prod: ''
}[config.env || 'mock'];

export default createAPI(baseUrl);
