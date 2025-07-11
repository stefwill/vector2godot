/**
 * Splash Screen Management
 * Handles the loading screen display and transition
 */
export class SplashScreen {
  constructor() {
    this.splashElement = document.getElementById('splash-screen');
    this.appElement = document.getElementById('app');
    this.minDisplayTime = 1500; // Minimum 1.5 seconds
    this.startTime = Date.now();
  }

  hide() {
    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);
    
    setTimeout(() => {
      this.splashElement.classList.add('fade-out');
      
      setTimeout(() => {
        this.splashElement.style.display = 'none';
        this.appElement.classList.remove('app-hidden');
        
        // Dispatch custom event for app initialization
        window.dispatchEvent(new CustomEvent('splashComplete'));
      }, 350); // Match CSS transition duration
    }, remainingTime);
  }

  updateLoadingText(text) {
    const loadingText = this.splashElement.querySelector('.loading-text');
    if (loadingText) {
      loadingText.textContent = text;
    }
  }
}
