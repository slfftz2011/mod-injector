import { getRemoteComponents, getComponentDownloadUrl } from '../api/componentApi';
import {
    getInstalledComponents,
    saveInstalledComponents,
    saveLastSyncTime,
    getLastSyncTime
} from '../utils/storage';

// 组件管理器类
class ComponentManager {
    constructor() {
        this.components = []; // 所有组件（远程+本地）
        this.installedComponents = []; // 已安装组件
        this.init();
    }

    // 初始化
    async init() {
        try {
            // 加载本地已安装组件
            this.installedComponents = await getInstalledComponents();
            // 加载远程组件列表
            await this.loadRemoteComponents();
            // 渲染列表
            this.renderComponentList();
            // 绑定事件
            this.bindEvents();
        } catch (error) {
            console.error('初始化失败:', error);
            document.getElementById('componentList').innerHTML = '<div style="text-align: center; color: #f44336; padding: 2rem;">加载失败，请刷新页面重试</div>';
        }
    }

    // 加载远程组件列表
    async loadRemoteComponents() {
        const res = await getRemoteComponents();
        if (res.code === 200) {
            this.components = res.data;
            // 记录同步时间
            await saveLastSyncTime(Date.now());
        } else {
            throw new Error('获取组件列表失败');
        }
    }

    // 安装组件
    async installComponent(componentId) {
        const component = this.components.find(c => c.id === componentId);
        if (!component) return false;

        const isInstalled = this.installedComponents.some(c => c.id === componentId);
        if (isInstalled) return false;

        try {
            // 实际项目中应调用下载接口
            const downloadRes = await getComponentDownloadUrl(componentId);
            console.log('下载链接:', downloadRes.url);

            // 模拟下载成功后更新本地状态
            this.installedComponents.push({
                id: component.id,
                enabled: true,
                version: component.version,
                installTime: Date.now()
            });

            await saveInstalledComponents(this.installedComponents);
            this.renderComponentList();
            alert(`组件《${component.name}》安装成功`);
            return true;
        } catch (error) {
            console.error('安装失败:', error);
            alert('安装失败: ' + error.message);
            return false;
        }
    }

    // 卸载组件
    async uninstallComponent(componentId) {
        const component = this.components.find(c => c.id === componentId);
        if (component?.required) {
            alert('核心组件不能卸载');
            return false;
        }

        this.installedComponents = this.installedComponents.filter(c => c.id !== componentId);
        await saveInstalledComponents(this.installedComponents);
        this.renderComponentList();
        alert(`组件《${component?.name || componentId}》已卸载`);
        return true;
    }

    // 切换组件启用状态
    async toggleComponentStatus(componentId) {
        const component = this.installedComponents.find(c => c.id === componentId);
        if (!component) return false;

        component.enabled = !component.enabled;
        await saveInstalledComponents(this.installedComponents);
        this.renderComponentList();
        return true;
    }

    // 渲染组件列表
    renderComponentList() {
        const listEl = document.getElementById('componentList');
        const searchTerm = document.getElementById('component-search').value.toLowerCase();
        const filter = document.getElementById('component-filter').value;

        if (this.components.length === 0) {
            listEl.innerHTML = '<div style="text-align: center; padding: 2rem;">暂无组件数据</div>';
            return;
        }

        // 筛选组件
        const filteredComponents = this.components.filter(component => {
            const matchesSearch = component.name.toLowerCase().includes(searchTerm) ||
                component.description.toLowerCase().includes(searchTerm);
            const isInstalled = this.installedComponents.some(c => c.id === component.id);
            const isEnabled = this.installedComponents.find(c => c.id === component.id)?.enabled;

            if (filter === 'all') return matchesSearch;
            if (filter === 'installed') return matchesSearch && isInstalled;
            if (filter === 'enabled') return matchesSearch && isInstalled && isEnabled;
            return matchesSearch;
        });

        // 生成组件卡片
        listEl.innerHTML = filteredComponents.map(component => {
            const isInstalled = this.installedComponents.some(c => c.id === component.id);
            const isEnabled = this.installedComponents.find(c => c.id === component.id)?.enabled;
            const installedVersion = this.installedComponents.find(c => c.id === component.id)?.version;

            return `
        <div class="component-card">
          <h3>
            ${component.name}
            <span class="component-version">v${installedVersion || component.version}</span>
          </h3>
          <p class="component-desc">${component.description}</p>
          <div style="font-size: 0.8rem; color: #666; margin: 0.5rem 0;">
            大小: ${component.size} | 最后更新: ${component.updateTime}
          </div>
          ${component.required ? '<span style="display: inline-block; background: #ff9800; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">核心组件</span>' : ''}
          <div class="component-actions">
            ${isInstalled ? '' : `<button class="component-btn install-btn" data-id="${component.id}">安装</button>`}
            ${isInstalled ? `<button class="component-btn ${isEnabled ? 'disable-btn' : 'enable-btn'}" data-id="${component.id}">${isEnabled ? '禁用' : '启用'}</button>` : ''}
            ${isInstalled && !component.required ? `<button class="component-btn uninstall-btn" data-id="${component.id}">卸载</button>` : ''}
          </div>
        </div>
      `;
        }).join('');
    }

    // 绑定事件
    bindEvents() {
        // 组件操作按钮事件
        document.getElementById('componentList').addEventListener('click', async (e) => {
            const target = e.target.closest('.component-btn');
            if (!target) return;

            const componentId = target.dataset.id;
            if (target.classList.contains('install-btn')) {
                await this.installComponent(componentId);
            } else if (target.classList.contains('uninstall-btn')) {
                await this.uninstallComponent(componentId);
            } else if (target.classList.contains('enable-btn') || target.classList.contains('disable-btn')) {
                await this.toggleComponentStatus(componentId);
            }
        });

        // 搜索和筛选事件
        document.getElementById('component-search').addEventListener('input', () => {
            this.renderComponentList();
        });

        document.getElementById('component-filter').addEventListener('change', () => {
            this.renderComponentList();
        });

        // 同步远程组件事件
        document.getElementById('sync-components').addEventListener('click', async () => {
            const syncBtn = document.getElementById('sync-components');
            syncBtn.disabled = true;
            syncBtn.textContent = '同步中...';

            try {
                await this.loadRemoteComponents();
                this.renderComponentList();
                alert('组件列表已同步至最新');
            } catch (error) {
                alert('同步失败: ' + error.message);
            } finally {
                syncBtn.disabled = false;
                syncBtn.textContent = '同步远程组件';
            }
        });

        // 模态框事件
        const modal = document.getElementById('installModal');
        // 打开模态框（实际项目中可通过"手动安装"按钮触发）
        // 这里预留触发逻辑，可在需要时添加按钮绑定
        document.getElementById('confirm-install').addEventListener('click', async () => {
            const input = document.getElementById('component-url');
            const value = input.value.trim();
            if (!value) {
                alert('请输入组件ID或URL');
                return;
            }

            // 简单判断是ID还是URL
            if (value.includes('http')) {
                // 处理URL安装逻辑
                alert(`正在从URL安装: ${value}`);
            } else {
                // 处理ID安装逻辑
                await this.installComponent(value);
            }

            modal.style.display = 'none';
            input.value = '';
        });

        document.querySelector('.close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// 导出初始化函数
export const initComponentManager = () => {
    new ComponentManager();
};