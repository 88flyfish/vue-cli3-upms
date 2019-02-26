import axios from 'axios';
import instance from './instance';
var instanceGeneral = axios.create({
    baseURL: 'http://192.168.1.241:9091/'
});
export function login(opts) {
    return instanceGeneral({
        method: 'post',
        url: '/auth/oauth/token',
        headers: { Authorization: 'Basic d2ViOndlYg==' },
        params: {
            ...opts
        }
    });
}

export function logout() {
    return instance({
        method: 'get',
        url: '../auth/oauth/removeToken'
    });
}
