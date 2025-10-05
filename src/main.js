import './styles/global.css';
import './components/component-manager.css';
import componentManagerHtml from './components/component-manager.html';
import { initComponentManager } from './components/component-manager';
import request from './api/request'; // 导入请求工具（用于未来扩展）

// 增强DOM元素存在性检查
const container = document.getElementById('componentManagerContainer');
if (!container) {
    console.error('未找到组件管理器容器元素（componentManagerContainer），请检查HTML结构');
} else {
    // 注入组件管理模块HTML
    container.innerHTML = componentManagerHtml;
}

// 初始化组件管理器（增加错误处理和加载状态）
const initApp = async () => {
    try {
        // 可以在这里添加远程组件数据获取逻辑（示例）
        // const remoteComponents = await request.get('/components');
        // 若需要向初始化函数传递数据，可修改 initComponentManager 接收参数

        // 等待DOM完全加载后初始化
        await new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', resolve);
            }
        });

        // 初始化组件管理器
        await initComponentManager();
        console.log('组件管理器初始化成功');
    } catch (error) {
        console.error('组件管理器初始化失败:', error);
        // 显示用户可见的错误提示
        if (container) {
            container.innerHTML += `<div style="color: red; margin-top: 1rem;">初始化失败，请刷新页面重试</div>`;
        }
    }
};

// 启动应用初始化
initApp();