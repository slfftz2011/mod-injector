import { getComponentFolders, getComponentMeta, getComponentReadme, getCopFileUrl } from '../api/componentApi';
import { saveLastSyncTime } from '../utils/storage'; // 仅保留同步时间功能

export class ComponentManager {
    constructor() {
        this.components = []; // 存储所有组件的meta信息
    }

    // 初始化组件管理器
    async init() {
        try {
            // 加载组件列表
            await this.loadComponents();
            this.renderComponentList();
            this.bindEvents();
        } catch (error) {
            console.error('组件加载失败：', error);
            document.getElementById('componentList').innerHTML = '<div style="text-align: center; padding: 2rem; color: #f44336;">加载组件失败，请重试</div>';
        }
    }

    // 加载组件数据（从public/components获取）
    async loadComponents() {
        const folders = await getComponentFolders();
        this.components = await Promise.all(
            folders.map(async (folder) => {
                const meta = await getComponentMeta(folder);
                return { ...meta, folderName: folder };
            })
        );
    }

    // 渲染组件列表
    renderComponentList() {
        const listEl = document.getElementById('componentList');
        const searchTerm = document.getElementById('component-search').value.toLowerCase();

        if (this.components.length === 0) {
            listEl.innerHTML = '<div style="text-align: center; padding: 2rem;">暂无组件数据</div>';
            return;
        }

        // 搜索筛选
        const filteredComponents = this.components.filter(component =>
            component.displayName.toLowerCase().includes(searchTerm) ||
            component.description?.toLowerCase().includes(searchTerm)
        );

        // 生成组件卡片
        listEl.innerHTML = filteredComponents.map(component => `
            <div class="component-card" data-folder="${component.folderName}">
                <h3>
                    ${component.displayName}
                    <span class="component-version">v${component.version}</span>
                </h3>
                <p class="component-desc">${component.description || '无描述'}</p>
                <div style="font-size: 0.8rem; color: #666; margin: 0.5rem 0;">
                    作者: ${component.author}
                </div>
                <div class="component-actions">
                    <button class="component-btn detail-btn">查看下载列表</button>
                </div>
            </div>
        `).join('');
    }

    // 绑定事件
    bindEvents() {
        const listEl = document.getElementById('componentList');

        // 点击查看详情（下载列表）
        listEl.addEventListener('click', async (e) => {
            const card = e.target.closest('.component-card');
            if (card) {
                const folderName = card.dataset.folder;
                await this.showComponentDetail(folderName);
            }
        });

        // 搜索事件
        document.getElementById('component-search').addEventListener('input', () => this.renderComponentList());

        // 同步组件事件
        document.getElementById('sync-components').addEventListener('click', async () => {
            try {
                await this.loadComponents();
                await saveLastSyncTime(Date.now());
                this.renderComponentList();
                alert('组件同步成功');
            } catch (error) {
                console.error('同步失败：', error);
                alert('同步失败，请重试');
            }
        });
    }

    // 显示组件详情（下载列表和README）
    async showComponentDetail(folderName) {
        try {
            const component = this.components.find(c => c.folderName === folderName);
            const readme = await getComponentReadme(folderName);

            // 创建模态框
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-btn">&times;</span>
                    <h2>${component.displayName}</h2>
                    <p>作者: ${component.author} | 版本: ${component.version}</p>
                    
                    <h3>可用版本（点击下载）</h3>
                    <div class="cop-branches">
                        ${component.copNames.map(copName => `
                            <a href="${getCopFileUrl(folderName, copName)}" download class="cop-download">
                                ${copName}
                            </a>
                        `).join('')}
                    </div>
                    
                    <h3>组件说明</h3>
                    <div class="component-readme">${readme}</div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.style.display = 'flex';

            // 关闭模态框
            modal.querySelector('.close-btn').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        } catch (error) {
            console.error('加载详情失败：', error);
            alert('加载详情失败');
        }
    }
}

// 初始化函数
export const initComponentManager = async () => {
    const manager = new ComponentManager();
    await manager.init();
};