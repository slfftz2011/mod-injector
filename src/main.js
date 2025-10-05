import './styles/global.css';
import './styles/footer.css';
import './components/component-manager.css';
import componentManagerHtml from './components/component-manager.html';
import { initComponentManager } from './components/component-manager';

// 初始化入口
async function bootstrap() {
    try {
        // 注入组件管理HTML结构
        const container = document.getElementById('componentManagerContainer');
        if (!container) throw new Error('未找到组件容器（componentManagerContainer）');
        container.innerHTML = componentManagerHtml;

        // 初始化组件管理器
        await initComponentManager();
        console.log('组件列表初始化完成');
    } catch (error) {
        console.error('初始化失败:', error);
        document.body.innerHTML = `<div style="padding: 2rem; color: red;">加载失败: ${error.message}</div>`;
    }
}

// 等待DOM加载完成后启动
document.addEventListener('DOMContentLoaded', bootstrap);