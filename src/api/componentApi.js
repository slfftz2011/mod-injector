import request from './request';

// 组件基础路径，生产环境指向 GitHub Pages 上的实际路径
const COMPONENTS_BASE_URL = process.env.NODE_ENV === 'development'
    ? '/components'
    : '/mod-injector/components';

/**
 * 获取所有组件文件夹名称（从 components-index.json 索引文件）
 * @returns {Promise<Array<string>>} 组件文件夹名称列表
 */
export const getComponentFolders = async () => {
    try {
        const { success, data } = await request.get(`${COMPONENTS_BASE_URL}/components-index.json`);
        if (!success) throw new Error('获取组件列表索引失败');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('getComponentFolders 失败:', error);
        throw new Error(`获取组件列表失败: ${error.message}`);
    }
};

/**
 * 获取组件的 meta.json 元信息
 * @param {string} folderName - 组件文件夹名称
 * @returns {Promise<Object>} meta 信息
 */
export const getComponentMeta = async (folderName) => {
    if (!folderName) throw new Error('组件文件夹名称不能为空');
    try {
        const { success, data } = await request.get(`${COMPONENTS_BASE_URL}/${folderName}/meta.json`);
        if (!success) throw new Error('获取组件元信息失败');
        const requiredFields = ['author', 'version', 'displayName', 'copNames'];
        requiredFields.forEach(field => {
            if (data[field] === undefined) throw new Error(`meta.json 缺少必要字段: ${field}`);
        });
        return data;
    } catch (error) {
        console.error(`getComponentMeta(${folderName}) 失败:`, error);
        throw new Error(`获取组件信息失败: ${error.message}`);
    }
};

/**
 * 获取组件的 README.md 内容
 * @param {string} folderName - 组件文件夹名称
 * @returns {Promise<string>} README 文本内容
 */
export const getComponentReadme = async (folderName) => {
    if (!folderName) throw new Error('组件文件夹名称不能为空');
    try {
        const response = await request.get(`${COMPONENTS_BASE_URL}/${folderName}/README.md`, {
            responseType: 'text'
        });
        return response.success ? response.data : response;
    } catch (error) {
        console.error(`getComponentReadme(${folderName}) 失败:`, error);
        return '该组件暂无说明文档';
    }
};

/**
 * 生成 COP 文件的下载 URL
 * @param {string} folderName - 组件文件夹名称
 * @param {string} copFileName - COP 文件名
 * @returns {string} 下载 URL
 */
export const getCopFileUrl = (folderName, copFileName) => {
    if (!folderName || !copFileName) {
        console.error('生成下载链接失败：文件夹或文件名不能为空');
        return '';
    }
    return `${COMPONENTS_BASE_URL}/${folderName}/${copFileName}`;
};
