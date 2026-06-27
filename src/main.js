// Main JavaScript entry point
console.log('amora.ai project loaded!');

// Add smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add click animation to amora.ai link
    const amoraLink = document.querySelector('.amora-link');
    if (amoraLink) {
        amoraLink.addEventListener('click', (e) => {
            // Add a subtle animation before navigation
            amoraLink.style.transform = 'scale(0.95)';
        });
    }
    
    // Add entrance animation to floating images
    const floatingImages = document.querySelectorAll('.floating-image');
    floatingImages.forEach((img, index) => {
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Handle image loading errors - show placeholder if image not found
    const floatingImgs = document.querySelectorAll('.floating-img');
    floatingImgs.forEach((img, index) => {
        img.addEventListener('error', function() {
            // If image fails to load, show a placeholder emoji
            const parent = this.parentElement;
            parent.innerHTML = `<div class="image-placeholder">✨</div>`;
        });
    });
    
    // Handle baby girl animation and audio on about page
    const babyGirlContainer = document.getElementById('babyGirlContainer');
    const greetingAudio = document.getElementById('greetingAudio');
    const aboutPage = document.getElementById('aboutPage');
    
    if (babyGirlContainer && greetingAudio) {
        // Animation timing: 1s to move, 2s pause, then play audio
        // Total animation is 3s (1s move + 2s pause at center)
        // Audio should play after the 2-second pause, so at 3.5s total
        setTimeout(() => {
            // Try to play audio
            greetingAudio.play().catch(error => {
                console.log('Audio autoplay prevented. User interaction required.');
                // If autoplay is blocked, show a message or play on click
                const playAudioOnClick = () => {
                    greetingAudio.play();
                    document.removeEventListener('click', playAudioOnClick);
                };
                document.addEventListener('click', playAudioOnClick);
            });
        }, 3500); // 3.5 seconds: 0.5s delay + 1s move + 2s pause
        
        // Handle baby-girl.gif loading error
        const babyGirlGif = document.getElementById('babyGirlGif');
        if (babyGirlGif) {
            babyGirlGif.addEventListener('error', function() {
                console.log('Baby girl gif not found. Please add baby-girl.gif to /public/ folder');
                // Show placeholder if gif not found
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.textContent = '👶';
                placeholder.style.fontSize = '4rem';
                this.parentElement.insertBefore(placeholder, this);
            });
        }
        
        // Fade to quiz page after cloud appears
        // Timing: 0s start + 2s animation + 1s wait + 0.6s cloud animation + 1s display = ~4.6s
        if (aboutPage) {
            setTimeout(() => {
                aboutPage.style.opacity = '0';
                aboutPage.style.transition = 'opacity 1s ease-out';
                setTimeout(() => {
                    window.location.href = 'quiz.html';
                }, 1000);
            }, 4600); // After cloud appears and displays for a moment
        }
    }
});

