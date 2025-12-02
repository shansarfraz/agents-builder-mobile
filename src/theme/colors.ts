export const Colors = {
  light: {
    // Primary
    primary: '#5856D6',
    primaryLight: '#7B79E8',
    primaryDark: '#4240A8',
    
    // Status
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    
    // Background
    background: '#F5F5F7',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text
    text: '#1A1A1A',
    textSecondary: '#8E8E93',
    textTertiary: '#C7C7CC',
    textInverse: '#FFFFFF',
    
    // Border
    border: '#E5E5EA',
    borderLight: '#F0F0F5',
    
    // Category colors
    customerSupport: '#5856D6',
    sales: '#34C759',
    content: '#FF9500',
    analysis: '#007AFF',
    development: '#AF52DE',
    general: '#FF2D55',
    
    // Shadow
    shadow: '#000000',
  },
  dark: {
    // Primary
    primary: '#7B79E8',
    primaryLight: '#9C9AF0',
    primaryDark: '#5856D6',
    
    // Status
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
    
    // Background
    background: '#000000',
    surface: '#1C1C1E',
    card: '#2C2C2E',
    
    // Text
    text: '#FFFFFF',
    textSecondary: '#98989D',
    textTertiary: '#636366',
    textInverse: '#000000',
    
    // Border
    border: '#38383A',
    borderLight: '#48484A',
    
    // Category colors (adjusted for dark mode)
    customerSupport: '#7B79E8',
    sales: '#32D74B',
    content: '#FF9F0A',
    analysis: '#0A84FF',
    development: '#BF5AF2',
    general: '#FF375F',
    
    // Shadow
    shadow: '#000000',
  },
};

export type ThemeMode = 'light' | 'dark';
export type ColorScheme = typeof Colors.light;

