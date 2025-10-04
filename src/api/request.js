import axios from 'axios';

// 创建axios实例
const request = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? '/mock'  // 开发环境仍用本地mock
        : 'https://modinjector.slfftz520.github.io/api',  // 生产环境API地址（根据实际调整）
    timeout: 10000
});

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 可添加请求头（如认证信息）
        return config;
    },
    error => {
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        console.error('响应错误:', error);
        alert('请求失败: ' + (error.response?.data?.message || '网络错误'));
        return Promise.reject(error);
    }
);

export default request;