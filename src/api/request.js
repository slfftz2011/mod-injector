import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
    timeout: 10000, // 10秒超时
    headers: {
        'Content-Type': 'application/json'
    }
});

// 响应拦截器（统一处理响应格式）
request.interceptors.response.use(
    (response) => {
        // 对于非 JSON 响应（如 README.md 文本），直接返回原始数据
        if (response.config.responseType === 'text') {
            return { success: true, data: response.data };
        }
        // 对于 JSON 响应，假设后端返回 { code: 200, data: ... } 格式
        const { code, data, message } = response.data;
        if (code === 200 || code === undefined) { // 兼容静态 JSON 文件（无 code 字段）
            return { success: true, data: data || response.data, message: message || '请求成功' };
        } else {
            return { success: false, message: message || '请求失败' };
        }
    },
    (error) => {
        let message = '网络请求失败';
        if (error.response) {
            message = `请求失败（${error.response.status}）`;
        } else if (error.request) {
            message = '服务器无响应';
        }
        return { success: false, message, error };
    }
);

export default request;