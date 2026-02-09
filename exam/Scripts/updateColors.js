/**
 * CSS颜色更新脚本 - 自动为所有硬编码颜色应用CSS变量后备
 * 这个脚本在colorSystem应用颜色后执行
 */

function applyColorFallbacks() {
    const style = document.createElement('style');
    const root = document.documentElement;
    
    // 获取当前应用的CSS变量
    const computedStyle = getComputedStyle(root);
    
    // 颜色映射表：硬编码颜色 -> CSS变量
    const colorMap = {
        // light.css中的颜色
        '#E3F2FD': 'var(--md3-primaryContainer, #E3F2FD)',
        '#0D47A1': 'var(--md3-onPrimaryContainer, #0D47A1)',
        '#BBDEFB': 'var(--md3-outline, #BBDEFB)',
        '#FFFFFF': 'var(--md3-surface, #FFFFFF)',
        '#1976D2': 'var(--md3-primary, #1976D2)',
        '#90CAF9': 'var(--md3-secondary, #90CAF9)',
        '#F0F7FF': 'var(--md3-primaryContainer, #F0F7FF)',
        '#B3E5FC': 'var(--md3-tertiaryContainer, #B3E5FC)',
        '#01579B': 'var(--md3-onTertiary, #01579B)',
        '#E1F5FE': 'var(--md3-secondaryContainer, #E1F5FE)',
        '#0277BD': 'var(--md3-onSecondary, #0277BD)',
        '#B0BEC5': 'var(--md3-surfaceVariant, #B0BEC5)',
        '#263238': 'var(--md3-onSurfaceVariant, #263238)',
        
        // dark.css中的颜色
        '#1565C0': 'var(--md3-primaryContainer, #1565C0)',
        '#E3F2FD': 'var(--md3-onBackground, #E3F2FD)',
        '#81D4FA': 'var(--md3-primary, #81D4FA)',
        '#004B7A': 'var(--md3-primaryContainer, #004B7A)',
        '#B3E5FC': 'var(--md3-onPrimaryContainer, #B3E5FC)',
        '#0D223A': 'var(--md3-background, #0D223A)',
        '#102840': 'var(--md3-surface, #102840)',
        '#183A5A': 'var(--md3-surfaceVariant, #183A5A)',
        '#37474F': 'var(--md3-outline, #37474F)',
    };
    
    // 为整个文档应用动态样式
    let cssRules = ':root {';
    
    Object.entries(colorMap).forEach(([hardColor, cssVar]) => {
        // 如果这个颜色在任何地方被使用，确保有适当的后备
        const varName = cssVar.match(/--md3-(\w+)/)?.[1];
        if (varName) {
            const value = computedStyle.getPropertyValue(`--md3-${varName}`).trim();
            if (value) {
                cssRules += `--color-${hardColor.toLowerCase().replace('#', '')}: ${value};`;
            }
        }
    });
    
    cssRules += '}';
    style.textContent = cssRules;
    document.head.appendChild(style);
    
    console.log('Color fallbacks applied');
}

// 当colorSystem应用颜色时调用
document.addEventListener('DOMContentLoaded', () => {
    // 等待colorSystem初始化
    const checkColorSystem = setInterval(() => {
        if (typeof colorSystem !== 'undefined' && colorSystem.initialized) {
            clearInterval(checkColorSystem);
            applyColorFallbacks();
        }
    }, 100);
    
    // 超时处理
    setTimeout(() => clearInterval(checkColorSystem), 5000);
});

// 监听颜色变化
const originalApplyTheme = colorSystem?.applyThemeColors;
if (originalApplyTheme) {
    colorSystem.applyThemeColors = function(colors) {
        originalApplyTheme.call(this, colors);
        applyColorFallbacks();
    };
}
