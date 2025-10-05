import './styles/global.css';
import './components/component-manager.css';
import componentManagerHtml from './components/component-manager.html';
import { initComponentManager } from './components/component-manager';
import {getRemoteComponents} from "./api/componentApi";
import {saveLastSyncTime} from "./utils/storage";

// 将组件管理模块注入到页面
bindEvents()
{
    // 绑定“同步远程组件”按钮事件
    document.getElementById('sync-components').addEventListener('click', async () => {
        const listEl = document.getElementById('componentList');
        listEl.innerHTML = '<div style="text-align: center; padding: 2rem;">同步中...</div>';

        try {
            const remoteData = await getRemoteComponents();
            this.components = remoteData.data || [];
            await saveLastSyncTime(Date.now()); // 更新同步时间
            this.renderComponentList();
        } catch (error) {
            console.error('同步组件失败：', error);
            listEl.innerHTML = '<div style="text-align: center; padding: 2rem; color: #f44336;">同步失败，请稍后重试</div>';
        }
    });
    // 初始化组件管理器
    document.addEventListener('DOMContentLoaded', () => {
        initComponentManager();
    });
}