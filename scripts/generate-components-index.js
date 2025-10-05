const fs = require('fs');
const path = require('path');

// 组件根目录
const componentsDir = path.resolve(__dirname, '../public/components');
// 生成的索引文件路径
const indexPath = path.resolve(componentsDir, 'components-index.json');

// 读取所有组件文件夹名称
const getComponentFolders = () => {
    return fs.readdirSync(componentsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
};

// 生成索引文件
fs.writeFileSync(
    indexPath,
    JSON.stringify(getComponentFolders(), null, 2),
    'utf-8'
);

console.log('组件索引生成成功：', indexPath);