/**
 * Vector2Godot - Main Entry Point
 * 
 * This is the main entry point for the Vector2Godot application.
 * It initializes the splash screen, loads the theme, and starts the main application.
 */

import './style.css';
import { SplashScreen } from './src/core/SplashScreen.js';
import { VectorDrawingApp } from './src/VectorDrawingApp.js';

// Initialize splash screen
const splash = new SplashScreen();

// Load theme immediately to prevent flash
const savedTheme = localStorage.getItem('vector2godot-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Initialize the main application
let app = null;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  splash.updateLoadingText('Loading Vector2Godot...');
  
  // Initialize the application after splash screen
  window.addEventListener('splashComplete', () => {
    try {
      app = new VectorDrawingApp();
      window.app = app; // Make app globally accessible for debugging and compatibility
      
      splash.updateLoadingText('Application ready!');
      
      // Hide splash screen
      setTimeout(() => {
        splash.hide();
      }, 500);
      
    } catch (error) {
      console.error('Failed to initialize Vector2Godot:', error);
      splash.updateLoadingText('Failed to load application');
      
      // Show error message
      setTimeout(() => {
        splash.hide();
        alert('Failed to initialize Vector2Godot: ' + error.message);
      }, 1000);
    }
  });
  
  // Auto-hide splash screen after a delay
  setTimeout(() => {
    if (!app) {
      window.dispatchEvent(new CustomEvent('splashComplete'));
    }
  }, 2000);
});

// Handle window events
window.addEventListener('beforeunload', (e) => {
  if (app && app.getShapes().length > 0) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  }
});

// Handle errors
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
  if (window.app && window.app.uiManager) {
    window.app.uiManager.showError('An error occurred: ' + e.error.message);
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  if (window.app && window.app.uiManager) {
    window.app.uiManager.showError('An error occurred: ' + e.reason);
  }
});

// Export for debugging
window.Vector2Godot = {
  version: '1.4.0',
  getApp: () => app,
  restart: () => {
    location.reload();
  }
};

console.log('Vector2Godot v1.4.0 - Modular Edition');
console.log('Created by Stefan Willoughby');
console.log('Access the app instance via window.app or window.Vector2Godot.getApp()');
