import {
    getComponentFolders,
    getComponentMeta,
    getComponentReadme,
    getCopFileUrl
} from '../api/componentApi';
import { saveLastSyncTime, getLastSyncTime, saveInstalledComponents, getInstalledComponents } from '../utils/storage';

export class ComponentManager {
    constructor() {
        this.components = []; // 存储组件元信息列表
        this.installedComponents = []; // 已安装组件列表
        this.isLoading = false; // 加载状态标记
    }

    // 初始化：加载组件列表
    async init() {
        this.setLoading(true);
        try {
            this.installedComponents = await getInstalledComponents(); // 加载已安装组件
            await this.loadComponents(); // 加载组件数据
            this.renderComponentList(); // 渲染列表
            this.bindEvents(); // 绑定事件
            this.updateLastSyncTime(); // 显示最后同步时间
        } catch (error) {
            this.renderError(`加载失败: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    // 从本地/远程加载组件数据
    async loadComponents() {
        const folders = await getComponentFolders(); // 获取所有组件文件夹
        // 批量加载每个组件的meta信息
        this.components = await Promise.all(
            folders.map(async (folderName) => {
                const meta = await getComponentMeta(folderName);
                return { ...meta, folderName }; // 关联文件夹名称（用于后续加载详情）
            })
        );
    }

    // 同步组件列表（刷新数据）
    async syncComponents() {
        if (this.isLoading) return;
        this.setLoading(true);
        try {
            await this.loadComponents();
            await saveLastSyncTime(Date.now());
            this.updateLastSyncTime();
            this.renderComponentList();
        } catch (error) {
            alert(`同步失败: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    // 更新最后同步时间显示
    async updateLastSyncTime() {
        const lastSync = await getLastSyncTime();
        const syncBtn = document.getElementById('sync-components');
        syncBtn.textContent = lastSync
            ? `最后同步: ${new Date(lastSync).toLocaleString()}`
            : '同步组件列表';
    }

    // 渲染组件列表
    renderComponentList() {
        const listEl = document.getElementById('componentList');
        if (!listEl) return;

        const searchTerm = document.getElementById('component-search').value.toLowerCase();
        // 搜索筛选
        const filtered = this.components.filter(component =>
            component.displayName.toLowerCase().includes(searchTerm) ||
            component.description?.toLowerCase().includes(searchTerm)
        );

        // 渲染列表项
        listEl.innerHTML = filtered.length
            ? filtered.map(component => this.createComponentCard(component)).join('')
            : '<div style="text-align: center; padding: 2rem;">暂无匹配组件</div>';
    }

    // 创建组件卡片HTML（仅显示基础信息和查看按钮）
    createComponentCard(component) {
        return `
      <div class="component-card" data-folder="${component.folderName}">
        <h3>${component.displayName}</h3>
        <p class="component-desc">${component.description || '无描述'}</p>
        <div style="font-size: 0.8rem; color: #666;">
          作者: ${component.author} | 主版本: ${component.version}
        </div>
        <button class="component-btn detail-btn" data-folder="${component.folderName}">
          查看版本分支
        </button>
      </div>
    `;
    }

    // 显示组件详情（版本分支+下载按钮+README）
    async showComponentDetail(folderName) {
        try {
            // 获取组件元信息和README
            const component = this.components.find(c => c.folderName === folderName);
            const readme = await getComponentReadme(folderName);

            // 创建模态框内容
            const modalHtml = `
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <h2>${component.displayName}</h2>
          <p>作者: ${component.author} | 主版本: ${component.version}</p>
          
          <h3>可用版本分支（点击下载）</h3>
          <div class="cop-branches">
            ${component.copNames.map(copName => `
              <a href="${getCopFileUrl(folderName, copName)}" 
                 download 
                 class="cop-download-btn">
                ${copName}
              </a>
            `).join('')}
          </div>
          
          <h3>组件说明</h3>
          <div class="component-readme">${this.formatReadme(readme)}</div>
        </div>
      `;

            // 显示模态框
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = modalHtml;
            document.body.appendChild(modal);
            modal.style.display = 'flex';

            // 绑定关闭事件
            modal.querySelector('.close-btn').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        } catch (error) {
            alert(`加载详情失败: ${error.message}`);
        }
    }



    // 简单格式化README（保留换行）
    formatReadme(text) {
        return text ? text.replace(/\n/g, '<br>') : '暂无说明文档';
    }

    // 绑定所有事件
    bindEvents() {
        const listEl = document.getElementById('componentList');

        // 组件列表事件委托（查看详情）
        listEl.addEventListener('click', async (e) => {
            if (e.target.classList.contains('detail-btn')) {
                const folderName = e.target.dataset.folder;
                await this.showComponentDetail(folderName);
            }
        });

        // 搜索和筛选事件
        document.getElementById('component-search').addEventListener('input', () => this.renderComponentList());
        document.getElementById('component-filter').addEventListener('change', () => this.renderComponentList());

        // 同步远程组件按钮事件
        document.getElementById('sync-components')?.addEventListener('click', async () => {
            // 模拟同步加载
            const syncBtn = document.getElementById('sync-components');
            syncBtn.disabled = true;
            syncBtn.textContent = '同步中...';

            try {
                // 实际项目中这里会调用接口获取最新组件列表
                await new Promise(resolve => setTimeout(resolve, 1500));
                alert('组件同步完成');
                this.renderComponentList(); // 重新渲染列表
                await saveLastSyncTime(Date.now());
            } catch (error) {
                console.error('同步失败:', error);
                alert('同步失败，请稍后重试');
            } finally {
                syncBtn.disabled = false;
                syncBtn.textContent = '同步远程组件';
            }
        });
    }


    showVersionBranch(componentId, versions) {
        // 创建弹窗或下拉菜单
        const branchModal = document.createElement('div');
        branchModal.className = 'version-branch-modal';
        branchModal.innerHTML = `
    <div class="modal-content">
      <h3>版本分支</h3>
      <ul>
        ${versions.map(version => `
          <li data-version="${version}">${version}</li>
        `).join('')}
      </ul>
    </div>
  `;
        document.body.appendChild(branchModal);

        // 点击版本项的事件
        branchModal.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                const selectedVersion = li.dataset.version;
                alert(`选择了 ${componentId} 的版本: ${selectedVersion}`);
                document.body.removeChild(branchModal);
            });
        });
    }

    toggleModal(show) {
        const modal = document.getElementById('installModal');
        if (modal) {
            modal.style.display = show ? 'flex' : 'none';
            modal.classList.toggle('active', show);
        }
    }

    // 新增：通过组件文件夹名和版本名安装组件并下载文件
    async installComponent(folderName, copName) {
        try {
            // 生成唯一组件ID用于判断是否已安装
            const componentId = `${folderName}-${copName}`;
            const isInstalled = this.installedComponents.some(c => c.id === componentId);
            if (isInstalled) {
                alert('该组件已安装');
                return;
            }

            // 使用 getCopFileUrl 生成下载链接
            const downloadUrl = getCopFileUrl(folderName, copName);
            if (!downloadUrl) {
                throw new Error('下载链接无效');
            }

            // 下载文件
            console.log('下载链接:', downloadUrl);
            const response = await fetch(downloadUrl);
            console.log('响应状态:', response.status);
            if (!response.ok) {
                throw new Error(`下载失败: HTTP ${response.status}`);
            }

            // 检查文件大小，避免空文件
            const contentLength = response.headers.get('content-length');
            console.log('content-length:', contentLength);
            if (!contentLength || parseInt(contentLength) <= 0) {
                throw new Error('下载的文件为空');
            }

            const blob = await response.blob();
            console.log('blob size:', blob.size);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${folderName}-${copName}.COP`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // 添加到已安装列表
            const component = this.components.find(c => c.folderName === folderName) || { folderName };
            this.installedComponents.push({ id: componentId, ...component, enabled: true });
            await saveInstalledComponents(this.installedComponents);
            this.renderComponentList();
            alert(`组件《${component.displayName || componentId}》安装成功`);
        } catch (error) {
            console.error('安装失败:', error);
            alert(`安装失败: ${error.message}`);
        }
    }

    // 设置加载状态
    setLoading(isLoading) {
        this.isLoading = isLoading;
        const listEl = document.getElementById('componentList');
        const syncBtn = document.getElementById('sync-components');

        if (isLoading) {
            listEl.innerHTML = '<div style="text-align: center; padding: 2rem;">加载中...</div>';
            syncBtn.disabled = true;
        } else {
            syncBtn.disabled = false;
        }
    }

    // 渲染错误提示
    renderError(message) {
        const listEl = document.getElementById('componentList');
        listEl.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #e74c3c;">
        ${message}
        <button class="component-btn retry-btn">重试</button>
      </div>
    `;
        document.querySelector('.retry-btn').addEventListener('click', () => this.init());
    }
}

// 初始化函数
export const initComponentManager = async () => {
    const manager = new ComponentManager();
    await manager.init();
    return manager;
};