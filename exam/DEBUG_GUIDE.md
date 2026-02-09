# Material You 亮色模式调试指南

## 问题描述
用户报告"选择亮色模式后颜色还是会按照暗色初始化"，以及其他UI元素颜色未应用。

## 最近修复内容

### 1. Color System 初始化顺序改进 (colorSystem.js)
- **修复**: 增加 DOMContentLoaded 备用初始化的延迟从 100ms 到 200ms
- **原因**: 确保 settings.js 的 fetch 完成后再执行备用初始化
- **添加**: 调试日志，方便追踪初始化过程

### 2. 颜色持久化修复 (settings.js)
- **修复**: color input 改变时现在会保存到 localStorage
- **之前**: 只进行实时预览，页面刷新后新颜色丢失
- **现在**: `localStorage.setItem("materialYouColor", color)` 在输入时执行

### 3. Light 模式生成颜色改进 (colorSystem.js)
- **修复**: Light 模式的背景颜色和文字颜色更新
  - 背景: #FFFBFE → #FFFFFF（完全匹配 light.css）
  - 文字 (onBackground/onSurface): #1C1B1F → createColor(20)（基于源颜色的深蓝色）
- **原因**: 确保 Material You 生成的颜色与 light.css 默认定义一致

## 调试步骤

### 步骤 1: 打开浏览器控制台
1. 按 F12 打开开发者工具
2. 切换到 **Console** 标签页
3. 清空控制台内容

### 步骤 2: 测试初始化阶段
1. 刷新页面
2. 在控制台中查看：
   - `[initMaterialYouColors]` 开头的日志（来自 settings.js fetch callback）
   - `[colorSystem] DOMContentLoaded ...` 的日志（来自 backup 初始化）

**查看项**：
```
[initMaterialYouColors] 初始化参数: {
  currentTheme: "md3",
  isDarkTheme: false,        // ← 如果这是 light 模式，应该是 false
  materialYouColor: "#1976D2"
}
```

### 步骤 3: 测试亮色模式选择
1. 如果当前不是 MD3 主题，先进入设置页面
2. 选择 **MD3** 主题
3. 确保顶部的 **亮色/暗色** toggle 处于 **亮色** 状态（toggle 向右）
4. 观察控制台日志

**预期**: 应该看到 `isDarkTheme: false` 的日志

### 步骤 4: 测试暗色模式选择
1. 在设置中改变 **亮色/暗色** toggle 到 **暗色** 状态（toggle 向左）
2. 观察控制台

**预期**: 应该看到 `isDarkTheme: true` 的日志，且页面颜色应变深

### 步骤 5: 颜色选择器测试
1. 打开设置，确保 MD3 主题已选择
2. 在 **Material You 主颜色** 中选择一个新颜色（例如红色 #FF0000）
3. 实时查看页面颜色变化
4. **刷新页面**，确认新颜色被保存

**检查点**：
- 实时预览应立即变色
- 刷新后颜色应保持不变

## 常见问题排查

### 问题: 选择 light 模式后颜色仍是暗色
**可能原因**:
1. `isDarkTheme` 参数反了（应该是 false for light）
2. CSS 文件加载顺序混乱

**排查**:
1. 打开控制台，检查 `isDarkTheme` 的值
2. 检查当前加载的 CSS：F12 → Elements → 搜索 `theme-link`，查看 `href` 属性
3. 尝试强制刷新 (Ctrl+Shift+R)

### 问题: Color picker 不显示
**可能原因**:
1. 当前主题不是 MD3
2. HTML 中缺少 color picker 元素

**排查**:
1. 确认当前主题是 MD3（在设置中检查）
2. F12 → Elements → 搜索 `material-you-color`，检查元素是否存在且可见

### 问题: 页面刷新后颜色重置
**可能原因**:
1. localStorage 未正确保存

**排查**:
1. F12 → Application → Local Storage → 找到当前域名
2. 检查 `materialYouColor` 键是否存在且有值
3. 查看控制台是否有错误信息

## 验证检查列表

运行以下命令在控制台验证系统状态：

```javascript
// 检查 localStorage
console.log('materialYouColor:', localStorage.getItem('materialYouColor'));
console.log('currentTheme:', getCookie('currentTheme')); // 需要定义 getCookie
console.log('theme:', getCookie('theme'));

// 检查 CSS 变量（light 模式应该是白色)
console.log('--md3-background:', getComputedStyle(document.documentElement).getPropertyValue('--md3-background'));
console.log('--md3-onBackground:', getComputedStyle(document.documentElement).getPropertyValue('--md3-onBackground'));

// 检查 colorSystem 实例
console.log('colorSystem:', colorSystem);
console.log('colorSystem.isDarkMode:', colorSystem.isDarkMode);
```

## 如果仍有问题

### 收集诊断信息
1. 打开控制台，复制所有 `[initMaterialYouColors]` 和 `[colorSystem]` 开头的日志
2. 检查是否有错误信息（红色）
3. 提交这些信息到 issue 中

### 临时解决方案
如果问题仍未解决，可以在 light.css 中手动添加：
```css
:root {
    --md3-onBackground: #0D47A1 !important;
    --md3-onSurface: #0D47A1 !important;
}
```

这会强制使用 light 模式的文字颜色，直到 colorSystem 问题完全解决。

## 相关文件位置
- Color System: `/exam/Scripts/colorSystem.js`
- Settings Integration: `/exam/Scripts/settings.js`
- Light CSS Variables: `/exam/Styles/md3/light.css` (lines 1-30)
- Dark CSS Variables: `/exam/Styles/md3/dark.css` (lines 1-30)
