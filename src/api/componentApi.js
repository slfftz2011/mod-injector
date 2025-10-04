import request from './request';

// 获取远程组件列表
export const getRemoteComponents = async () => {
    return await request.get('/components.json');
};

// 下载组件（返回下载链接）
export const getComponentDownloadUrl = async (componentId) => {
    return await request.get(`/download?componentId=${componentId}`);
};