import localforage from 'localforage';

// 初始化存储
localforage.config({
    name: 'NeteaseModInjector',
    storeName: 'components'
});

// 存储键名
const STORAGE_KEYS = {
    INSTALLED_COMPONENTS: 'installedComponents',
    LAST_SYNC_TIME: 'lastSyncTime'
};

// 存储已安装组件
export const saveInstalledComponents = async (components) => {
    await localforage.setItem(STORAGE_KEYS.INSTALLED_COMPONENTS, components);
};

// 获取已安装组件
export const getInstalledComponents = async () => {
    return await localforage.getItem(STORAGE_KEYS.INSTALLED_COMPONENTS) || [];
};

// 存储最后同步时间
export const saveLastSyncTime = async (time) => {
    await localforage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, time);
};

// 获取最后同步时间
export const getLastSyncTime = async () => {
    return await localforage.getItem(STORAGE_KEYS.LAST_SYNC_TIME) || 0;
};