import './styles/global.css';
import './components/component-manager.css';
import componentManagerHtml from './components/component-manager.html';
import { initComponentManager } from './components/component-manager';

// 将组件管理模块注入到页面
document.getElementById('componentManagerContainer').innerHTML = componentManagerHtml;

// 初始化组件管理器
document.addEventListener('DOMContentLoaded', () => {
    initComponentManager();
});