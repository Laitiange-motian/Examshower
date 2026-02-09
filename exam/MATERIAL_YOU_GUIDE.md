# Material You 动态配色系统 - 使用指南

## 概述
已为考试看板实现了基于Google官方 **material-color-utilities** 库的Material You动态配色系统。

## 实现内容

### 1. 颜色生成引擎 (Scripts/colorSystem.js)
- 集成Google官方的material-color-utilities库
- 支持从任意源颜色生成标准MD3调色板
- 自动区分亮色/暗色主题的颜色方案
- 完整的色彩空间转换（RGB↔HSL）
- 备用简化算法（当官方库加载失败时）

### 2. HTML界面增强 (index.html)
- 在MD3主题下显示"Material You主颜色"选择器
- 实时颜色预览提示
- 与设置系统完全集成

### 3. 设置面板集成 (Scripts/settings.js)
- 主题切换时自动应用对应的颜色方案
- 亮/暗模式切换时实时调整颜色对比度
- 颜色持久化存储（localStorage）
- 异步颜色应用，确保库加载完成

### 4. CSS系统更新
- **light.css**: 用CSS变量替换关键硬编码颜色
  - 支持17种Material Design 3标准色彩角色
  - 包括primary、secondary、tertiary、error等
- **dark.css**: 暗色主题的完整CSS变量适配
- **updateColors.js**: 颜色后备系统，确保无遗漏

## CSS变量列表

已定义的CSS变量包括：
```css
--md3-primary           /* 主色 */
--md3-onPrimary         /* 主色文本 */
--md3-primaryContainer  /* 主色容器 */
--md3-onPrimaryContainer /* 主色容器文本 */

--md3-secondary         /* 次色 */
--md3-onSecondary       /* 次色文本 */
--md3-secondaryContainer
--md3-onSecondaryContainer

--md3-tertiary          /* 第三色 */
--md3-onTertiary
--md3-tertiaryContainer
--md3-onTertiaryContainer

--md3-background        /* 背景 */
--md3-onBackground      /* 背景文本 */
--md3-surface           /* 表面 */
--md3-onSurface         /* 表面文本 */

--md3-surfaceVariant    /* 表面变体 */
--md3-onSurfaceVariant

--md3-outline           /* 边框和分隔线 */
--md3-outlineVariant

--md3-error             /* 错误 */
--md3-onError
--md3-errorContainer
--md3-onErrorContainer

--md3-scrim             /* 遮罩 */
```

## 使用方法

### 方法1: 通过设置界面（推荐）
1. 打开考试看板
2. 点击右上角"设置"按钮
3. 主题选择改为"Material Design 3"
4. 会显示"Material You主颜色"选择器
5. 点击颜色输入框，选择任意颜色
6. 实时预览效果
7. 点击"确定"保存

### 方法2: 通过URL参数
可以直接在URL中指定颜色：
```
exam/index.html?theme=md3&color=%231976D2
```

### 方法3: 编程API
```javascript
// 应用指定颜色
await colorSystem.applyMaterialYou('#FF6B6B', isDarkMode);

// 获取当前源颜色
const color = colorSystem.getSourceColor();

// 从localStorage恢复
await colorSystem.restoreColors(isDarkMode);
```

## 颜色对比度和无障碍性

系统使用Google官方算法确保：
- WCAG AAA级文本对比度
- 明色和暗色的自适应颜色方案
- 无法区分颜色的用户支持（通过对比度）

## 浏览器兼容性

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- 移动浏览器：iOS Safari 14+, Chrome Android 88+

需要支持的特性：
- CSS自定义属性 (--var-name)
- 现代JavaScript (ES6+)
- fetch API

## 故障排除

### 颜色没有应用
1. 检查浏览器控制台是否有错误
2. 确保使用了MD3主题
3. 检查localStorage是否被清除了配置

### 颜色对比度不足
1. 某些颜色组合可能在特定主题下对比度不足
2. 系统会自动调整亮度以改善对比度
3. 如果问题仍存在，尝试其他源颜色

### 库加载失败
- 系统自动切换到备用简化算法
- 功能完整但颜色生成算法更简单
- 检查网络连接和CDN可用性

## 迁移其他主题

如需为ealg、old或md2主题添加类似功能：

1. 复制light.css中的:root CSS变量定义
2. 用相应主题的默认颜色填充变量
3. 在CSS中Replace硬编码颜色值为CSS变量
4. 设置面板会自动支持

## 性能优化

- CSS变量使用native浏览器实现，性能无损耗
- 颜色生成使用Web Worker（若支持）
- 只在主题切换时重新计算颜色

## 反馈和改进

如发现下列问题，请反馈：
- [ ] 某些界面元素未应用新颜色
- [ ] 颜色对比度不够
- [ ] 特定浏览器出现问题
- [ ] 建议添加更多颜色角色

## 技术细节

### 颜色生成算法

使用Google Material Color Utilities库的HCT色彩空间：
- H (Hue): 色调 0-360°
- C (Chroma): 色度 0-150+
- T (Tone): 亮度 0-100

相比HSL，HCT更能准确感知颜色的视觉均衡性。

### CSS变量后备

所有CSS变量都包含后备静态颜色值：
```css
background-color: var(--md3-primary, #1976D2);
```

即使变量未定义，也会使用后备颜色正常工作。
