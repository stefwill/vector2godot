/**
 * Settings Management
 * Handles application settings, persistence, and configuration
 */
export class SettingsManager {
  constructor() {
    this.defaultSettings = {
      canvasWidth: 256,
      canvasHeight: 256,
      gridSize: 10,
      showGrid: true,
      snapToGrid: true,
      strokeWidth: 2,
      strokeColor: '#000000',
      fillColor: '#ffffff',
      theme: 'light'
    };
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('vector2godot-settings');
    if (savedSettings) {
      try {
        return { ...this.defaultSettings, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.warn('Failed to parse saved settings:', error);
        return this.defaultSettings;
      }
    }
    return this.defaultSettings;
  }

  saveSettings(settings) {
    try {
      localStorage.setItem('vector2godot-settings', JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }

  resetSettings() {
    this.saveSettings(this.defaultSettings);
    return this.defaultSettings;
  }

  getDefaultSettings() {
    return { ...this.defaultSettings };
  }

  // Theme management
  loadTheme() {
    const savedTheme = localStorage.getItem('vector2godot-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    return savedTheme;
  }

  saveTheme(theme) {
    localStorage.setItem('vector2godot-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
