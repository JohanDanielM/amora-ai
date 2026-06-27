(function() {
  
  function initToast() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      `;
      
      // Safe append - check body exists
      if (document.body) {
        document.body.appendChild(container);
      } else {
        // Body not ready, wait for it
        document.addEventListener('DOMContentLoaded', () => {
          document.body.appendChild(container);
        });
      }
    }
  }

  // Run init immediately (will hook to DOMContentLoaded if needed)
  initToast();

  window.showToast = function(message, type = 'info', duration = 3000) {
    // Re-check container exists at toast time
    let c = document.getElementById('toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'toast-container';
      c.style.cssText = `
        position: fixed; top: 24px; right: 24px; z-index: 10000;
        display: flex; flex-direction: column; gap: 12px;
        pointer-events: none;
      `;
      document.body.appendChild(c);
    }
    
    const colors = {
      success: { border: '#10b981', icon: '✓' },
      error: { border: '#ef4444', icon: '✗' },
      info: { border: '#6b46c1', icon: 'ℹ' },
      warning: { border: '#f59e0b', icon: '⚠' }
    };
    const config = colors[type] || colors.info;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      background: white;
      border-left: 4px solid ${config.border};
      padding: 14px 18px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(107, 70, 193, 0.12);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 280px;
      max-width: 400px;
      pointer-events: auto;
      transform: translateX(120%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: var(--font-family, system-ui);
      font-size: 14px;
      color: var(--color-neutral-900);
    `;
    
    toast.innerHTML = `
      <span style="color: ${config.border}; font-size: 18px; font-weight: bold;">${config.icon}</span>
      <span style="flex: 1;">${message}</span>
      <button style="background: none; border: none; cursor: pointer; color: #999; font-size: 18px; padding: 0; line-height: 1;" onclick="this.parentElement.remove()">×</button>
    `;
    
    c.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });
    
    // Auto-dismiss
    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // Skeleton Loader helpers
  window.showSkeleton = function(containerId, type = 'image') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `<div class="skeleton skeleton-${type}"></div>`;
  };

  window.hideSkeleton = function(containerId) {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '';
  };
})();
