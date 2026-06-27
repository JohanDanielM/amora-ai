(function() {
  function initLightbox() {
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        cursor: zoom-out;
        animation: fadeIn 0.2s ease;
      `;
      lightbox.innerHTML = `
        <button id="lightbox-close" style="
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        ">×</button>
        <img id="lightbox-img" style="
          max-width: 90vw;
          max-height: 85vh;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: zoomIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        " />
        <div id="lightbox-caption" style="
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.6);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          max-width: 80vw;
          text-align: center;
        "></div>
      `;
      
      if (document.body) {
        document.body.appendChild(lightbox);
      } else {
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(lightbox));
      }
      
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.id === 'lightbox-close') {
          window.closeLightbox();
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeLightbox();
      });
    }
    
    window.openLightbox = function(imgSrc, caption = '') {
      const img = document.getElementById('lightbox-img');
      const cap = document.getElementById('lightbox-caption');
      if (img) img.src = imgSrc;
      if (cap) {
        cap.textContent = caption;
        cap.style.display = caption ? 'block' : 'none';
      }
      const lb = document.getElementById('lightbox');
      if (lb) lb.style.display = 'flex';
      if (document.body) document.body.style.overflow = 'hidden';
    };
    
    window.closeLightbox = function() {
      const lb = document.getElementById('lightbox');
      if (lb) lb.style.display = 'none';
      if (document.body) document.body.style.overflow = '';
    };
  }

  // Inject keyframes
  if (!document.getElementById('lightbox-styles')) {
    const style = document.createElement('style');
    style.id = 'lightbox-styles';
    style.textContent = `
      @keyframes zoomIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    if (document.head) document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
