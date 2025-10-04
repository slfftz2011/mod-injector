import {
    saveInstalledComponents,
    getInstalledComponents,
    saveLastSyncTime
} from '../utils/storage';

export class ComponentManager {
    constructor() {
        // 组件列表数据（实际项目中可能从接口获取）
        this.components = [
            {
                id: 'comp1',
                name: '基础样式优化',
                description: '优化页面基础样式，提升视觉体验',
                version: '1.0.0',
                size: '2.3KB',
                updateTime: '2024-05-01',
                required: false
            },
            {
                id: 'comp2',
                name: '核心功能扩展',
                description: '提供核心功能扩展，不可卸载',
                version: '2.1.0',
                size: '5.7KB',
                updateTime: '2024-04-20',
                required: true
            }
        ];
        this.installedComponents = []; // 已安装组件列表
    }

    // 初始化组件管理器
    async init() {
        // 从本地存储加载已安装组件
        this.installedComponents = await getInstalledComponents();
        this.renderComponentList();
        this.bindEvents();
    }

    // 渲染组件列表（已有的渲染逻辑）
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
        const listEl = document.getElementById('componentList');

        // 安装组件
        listEl.addEventListener('click', async (e) => {
            if (e.target.classList.contains('install-btn')) {
                const componentId = e.target.dataset.id;
                await this.installComponent(componentId);
            }

            // 启用/禁用组件
            if (e.target.classList.contains('enable-btn') || e.target.classList.contains('disable-btn')) {
                const componentId = e.target.dataset.id;
                await this.toggleComponentStatus(componentId);
            }

            // 卸载组件
            if (e.target.classList.contains('uninstall-btn')) {
                const componentId = e.target.dataset.id;
                await this.uninstallComponent(componentId);
            }
        });

        // 搜索和筛选事件
        document.getElementById('component-search').addEventListener('input', () => this.renderComponentList());
        document.getElementById('component-filter').addEventListener('change', () => this.renderComponentList());
    }

    // 安装组件
    async installComponent(componentId) {
        const component = this.components.find(c => c.id === componentId);
        if (!component) return;

        // 添加到已安装列表（默认启用）
        this.installedComponents.push({
            ...component,
            enabled: true
        });

        // 保存到本地存储
        await saveInstalledComponents(this.installedComponents);
        // 更新最后同步时间
        await saveLastSyncTime(Date.now());
        // 重新渲染
        this.renderComponentList();
    }

    // 切换组件启用/禁用状态
    async toggleComponentStatus(componentId) {
        const component = this.installedComponents.find(c => c.id === componentId);
        if (!component) return;

        // 切换状态
        component.enabled = !component.enabled;
        // 保存到本地存储
        await saveInstalledComponents(this.installedComponents);
        // 重新渲染
        this.renderComponentList();
    }

    // 卸载组件
    async uninstallComponent(componentId) {
        // 过滤掉要卸载的组件
        this.installedComponents = this.installedComponents.filter(c => c.id !== componentId);
        // 保存到本地存储
        await saveInstalledComponents(this.installedComponents);
        // 更新最后同步时间
        await saveLastSyncTime(Date.now());
        // 重新渲染
        this.renderComponentList();
    }
}

// 初始化函数（供main.js调用）
export const initComponentManager = async () => {
    const manager = new ComponentManager();
    await manager.init();
};