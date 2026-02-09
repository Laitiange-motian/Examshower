/**
 * Material You 动态配色系统 (基于Google官方material-color-utilities)
 * 使用CDN加载官方库，确保颜色标准和对比度正确
 */

class MaterialYouColorSystem {
    constructor() {
        this.sourceColor = '#1976D2'; // 默认源颜色
        this.isDarkMode = false;
        this.scheme = null;
        this.initialized = false;
    }

    /**
     * 等待material-color-utilities库加载
     */
    async ensureLibLoaded() {
        if (this.initialized) return;
        
        // 检查是否已加载
        if (typeof materialColorUtilities !== 'undefined') {
            this.initialized = true;
            return;
        }

        // 等待库加载
        return new Promise((resolve) => {
            const checkLib = setInterval(() => {
                if (typeof materialColorUtilities !== 'undefined') {
                    clearInterval(checkLib);
                    this.initialized = true;
                    resolve();
                }
            }, 100);
            
            // 超时处理 - 如果库没加载，使用备用方案
            setTimeout(() => {
                clearInterval(checkLib);
                if (!this.initialized) {
                    console.warn('material-color-utilities 未加载，使用备用配色方案');
                    this.initialized = true;
                    resolve();
                }
            }, 5000);
        });
    }

    /**
     * 使用官方库生成颜色方案
     */
    async generateScheme(sourceColor, isDark) {
        await this.ensureLibLoaded();

        if (typeof materialColorUtilities === 'undefined') {
            // 备用方案：使用本地简化算法
            return this.generateSimplePalette(sourceColor, isDark);
        }

        try {
            const { argbFromHex, themeFromSourceColor } = materialColorUtilities;
            const argb = argbFromHex(sourceColor);
            const theme = themeFromSourceColor(argb, isDark);
            
            return {
                primary: this.argbToHex(theme.palettes.primary.getOrDefault(40)),
                onPrimary: this.argbToHex(theme.palettes.primary.getOrDefault(100)),
                primaryContainer: this.argbToHex(theme.palettes.primary.getOrDefault(90)),
                onPrimaryContainer: this.argbToHex(theme.palettes.primary.getOrDefault(10)),
                
                secondary: this.argbToHex(theme.palettes.secondary.getOrDefault(40)),
                onSecondary: this.argbToHex(theme.palettes.secondary.getOrDefault(100)),
                secondaryContainer: this.argbToHex(theme.palettes.secondary.getOrDefault(90)),
                onSecondaryContainer: this.argbToHex(theme.palettes.secondary.getOrDefault(10)),
                
                tertiary: this.argbToHex(theme.palettes.tertiary.getOrDefault(40)),
                onTertiary: this.argbToHex(theme.palettes.tertiary.getOrDefault(100)),
                tertiaryContainer: this.argbToHex(theme.palettes.tertiary.getOrDefault(90)),
                onTertiaryContainer: this.argbToHex(theme.palettes.tertiary.getOrDefault(10)),
                
                background: this.argbToHex(theme.palettes.neutral.getOrDefault(isDark ? 10 : 99)),
                onBackground: this.argbToHex(theme.palettes.neutral.getOrDefault(isDark ? 90 : 10)),
                surface: this.argbToHex(theme.palettes.neutral.getOrDefault(isDark ? 10 : 99)),
                onSurface: this.argbToHex(theme.palettes.neutral.getOrDefault(isDark ? 90 : 10)),
                
                surfaceVariant: this.argbToHex(theme.palettes.neutralVariant.getOrDefault(isDark ? 30 : 90)),
                onSurfaceVariant: this.argbToHex(theme.palettes.neutralVariant.getOrDefault(isDark ? 80 : 30)),
                
                outline: this.argbToHex(theme.palettes.neutralVariant.getOrDefault(isDark ? 60 : 50)),
                outlineVariant: this.argbToHex(theme.palettes.neutralVariant.getOrDefault(isDark ? 30 : 80)),
                
                error: this.argbToHex(theme.palettes.error.getOrDefault(40)),
                onError: this.argbToHex(theme.palettes.error.getOrDefault(100)),
                errorContainer: this.argbToHex(theme.palettes.error.getOrDefault(90)),
                onErrorContainer: this.argbToHex(theme.palettes.error.getOrDefault(10)),
                
                scrim: this.argbToHex(theme.palettes.neutral.getOrDefault(0))
            };
        } catch (error) {
            console.warn('颜色生成失败，使用备用方案:', error);
            return this.generateSimplePalette(sourceColor, isDark);
        }
    }

    /**
     * 备用简化调色板
     */
    generateSimplePalette(sourceHex, isDark) {
        const rgb = this.hexToRgb(sourceHex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        const createColor = (lightness) => {
            const newRgb = this.hslToRgb(hsl.h, hsl.s, lightness);
            return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        };

        if (isDark) {
            // Dark mode colors - 使用源色的高lightness值作为文字颜色
            const lightTextColor = createColor(85);  // 浅蓝色，用于暗色背景上的文字
            const mediumColor = createColor(55);     // 中等颜色，用于 outline
            const darkBgColor = createColor(15);     // 深蓝色，用于 background
            
            return {
                primary: createColor(80),
                onPrimary: createColor(20),
                primaryContainer: createColor(30),
                onPrimaryContainer: createColor(90),
                secondary: createColor(80),
                onSecondary: createColor(20),
                secondaryContainer: createColor(30),
                onSecondaryContainer: createColor(90),
                tertiary: createColor(80),
                onTertiary: createColor(20),
                tertiaryContainer: createColor(30),
                onTertiaryContainer: createColor(90),
                background: darkBgColor,              // ← 基于源色的深蓝色背景
                onBackground: lightTextColor,        // ← 基于源色的浅蓝色文字
                surface: darkBgColor,                // ← 基于源色的深蓝色surface
                onSurface: lightTextColor,           // ← 基于源色的浅蓝色文字
                surfaceVariant: createColor(25),     // ← 深蓝色变体
                onSurfaceVariant: lightTextColor,    // ← 浅蓝色
                outline: mediumColor,                // ← 基于源色的中等蓝色
                outlineVariant: createColor(30),     // ← 深蓝色变体
                error: '#F2B8B5',
                onError: '#601410',
                errorContainer: '#8C1D18',
                onErrorContainer: '#F9DEDC',
                scrim: '#000000'
            };
        } else {
            // Light mode colors - 确保与 light.css 中的配色一致
            // 使用 primary color family 的深色作为文字颜色，以保持与 light.css 的一致性
            const darkTextColor = createColor(20); // 深蓝色文字，匹配 light.css 的 #0D47A1 风格
            return {
                primary: createColor(40),
                onPrimary: createColor(100),
                primaryContainer: createColor(90),
                onPrimaryContainer: createColor(10),
                secondary: createColor(40),
                onSecondary: createColor(100),
                secondaryContainer: createColor(90),
                onSecondaryContainer: createColor(10),
                tertiary: createColor(40),
                onTertiary: createColor(100),
                tertiaryContainer: createColor(90),
                onTertiaryContainer: createColor(10),
                background: '#FFFFFF',        // 保持与 light.css 一致
                onBackground: darkTextColor,  // 使用源色的深蓝色而不是固定的灰色
                surface: '#FFFFFF',           // 保持与 light.css 一致
                onSurface: darkTextColor,     // 使用源色的深蓝色而不是固定的灰色
                surfaceVariant: '#E7E0EC',
                onSurfaceVariant: '#49454F',
                outline: '#79747E',
                outlineVariant: '#CAC7D0',
                error: '#B3261E',
                onError: '#FFFFFF',
                errorContainer: '#F9DEDC',
                onErrorContainer: '#410E0B',
                scrim: '#000000'
            };
        }
    }

    /**
     * ARGB转HEX
     */
    argbToHex(argb) {
        const r = (argb >> 16) & 0xFF;
        const g = (argb >> 8) & 0xFF;
        const b = argb & 0xFF;
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    /**
     * HEX转RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    /**
     * RGB转HEX
     */
    rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join("").toUpperCase();
    }

    /**
     * RGB转HSL
     */
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        
        if (max === min) {
            return { h: 0, s: 0, l: l * 100 };
        }
        
        const d = max - min;
        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        let h;
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        return { h: h * 60, s: s * 100, l: l * 100 };
    }

    /**
     * HSL转RGB
     */
    hslToRgb(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * 为指定的主题应用颜色
     */
    applyThemeColors(colors) {
        const root = document.documentElement;
        
        // 设置CSS变量
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--md3-${key}`, value);
        });

        // 存储当前的源颜色和主题模式
        localStorage.setItem('md3SourceColor', this.sourceColor);
        localStorage.setItem('md3DarkMode', this.isDarkMode);
    }

    /**
     * 应用Material You颜色方案
     */
    async applyMaterialYou(sourceHex, isDarkTheme = false) {
        this.sourceColor = sourceHex;
        this.isDarkMode = isDarkTheme;
        
        const colors = await this.generateScheme(sourceHex, isDarkTheme);
        this.applyThemeColors(colors);
    }

    /**
     * 从localStorage恢复颜色方案
     */
    async restoreColors(isDarkTheme) {
        const savedColor = localStorage.getItem('md3SourceColor');
        if (savedColor) {
            await this.applyMaterialYou(savedColor, isDarkTheme);
        }
    }

    /**
     * 获取当前的源颜色
     */
    getSourceColor() {
        return localStorage.getItem('md3SourceColor') || this.sourceColor;
    }
}

// 创建全局实例
const colorSystem = new MaterialYouColorSystem();

/**
 * 初始化Material You颜色系统
 * 在settings.js加载完成后调用
 */
async function initMaterialYouColors(currentTheme, isDarkTheme) {
    // 只在MD3主题时应用Material You颜色
    if (currentTheme !== 'md3') {
        console.log('[initMaterialYouColors] 当前主题不是 md3，跳过初始化');
        return;
    }
    
    const savedColor = localStorage.getItem('md3SourceColor');
    const materialYouColor = localStorage.getItem('materialYouColor') || '#1976D2';
    
    // 调试日志：检查 isDarkTheme 是否正确
    console.log('[initMaterialYouColors] 初始化参数:', {
        currentTheme,
        isDarkTheme,
        materialYouColor,
        savedColor
    });
    
    // 应用颜色
    await colorSystem.applyMaterialYou(materialYouColor, isDarkTheme);
}

// 页面加载时恢复颜色（备用初始化 - 作为 settings.js 的备份）
document.addEventListener('DOMContentLoaded', async () => {
    // 延迟执行，确保 DOM 完全加载和 settings.js 初始化完成
    setTimeout(async () => {
        const themeToggle = document.getElementById('theme-toggle');
        const themeSelect = document.getElementById('theme-select');
        
        // 只在以下情况下初始化：settings.js 没有调用 initMaterialYouColors（如果 theme 不是 md3）
        if (themeSelect && themeSelect.value === 'md3' && themeToggle) {
            // 确保正确解析 isDarkTheme：themeToggle.checked === true 表示 light mode
            const isDarkTheme = !themeToggle.checked;
            const materialYouColor = localStorage.getItem('materialYouColor') || '#1976D2';
            console.log('[colorSystem] DOMContentLoaded 备用初始化:', { isDarkTheme, materialYouColor });
            await colorSystem.applyMaterialYou(materialYouColor, isDarkTheme);
        }
    }, 200); // 增加延迟到 200ms，确保 settings.js fetch 完成
});
