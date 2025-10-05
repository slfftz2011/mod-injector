import request from './request';

// 基础路径（根据部署环境调整）
const BASE_URL = '/components';

// 获取所有组件文件夹名称
export const getComponentFolders = async () => {
    return await request.get(`${BASE_URL}/components-index.json`);
};

// 获取组件元信息（meta.json）
export const getComponentMeta = async (folderName) => {
    return await request.get(`${BASE_URL}/${folderName}/meta.json`);
};

// 获取组件README.md
export const getComponentReadme = async (folderName) => {
    return await request.get(`${BASE_URL}/${folderName}/README.md`);
};

// 获取COP文件下载链接
export const getCopFileUrl = (folderName, copFileName) => {
    return `${BASE_URL}/${folderName}/${copFileName}`;
};