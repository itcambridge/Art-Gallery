document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.gallery-img');
    const centerImage = document.querySelector('.center-image');
    const imageTitle = document.getElementById('image-title');
    const totalImages = images.length;
    const circleGallery = document.querySelector('.circle-gallery');
    const enableSoundButton = document.getElementById('enable-sound');
    let soundEnabled = false;
    
    enableSoundButton.addEventListener('click', () => {
        soundEnabled = true;
        enableSoundButton.classList.add('enabled');
        enableSoundButton.textContent = 'Sound Enabled';
        
        document.querySelectorAll('audio').forEach(audio => {
            audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
            }).catch(error => console.log('Initial audio load:', error));
        });
    });
    
    // Position images in a circle
    images.forEach((img, index) => {
        const angle = (index / totalImages) * 2 * Math.PI;
        const radius = 300;
        
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        img.style.transform = `translate(-50%, -50%)`;
        img.style.left = `${300 + x}px`;
        img.style.top = `${300 + y}px`;

        // Add counter-rotation to keep images vertical
        function updateImageRotation() {
            const galleryRotation = getComputedStyle(circleGallery).transform;
            let currentRotation = 0;
            
            if (galleryRotation !== 'none') {
                const values = galleryRotation.split('(')[1].split(')')[0].split(',');
                currentRotation = Math.atan2(values[1], values[0]) * (180/Math.PI);
            }

            // Apply counter-rotation to keep image vertical
            img.style.transform = `translate(-50%, -50%) rotate(${-currentRotation}deg)`;
        }

        // Update rotation on animation frame
        function animate() {
            updateImageRotation();
            requestAnimationFrame(animate);
        }
        animate();

        img.addEventListener('mouseenter', () => {
            centerImage.style.backgroundImage = `url(${img.src})`;
            centerImage.style.opacity = '1';
            imageTitle.textContent = img.alt;
            
            if (soundEnabled) {
                const soundId = img.getAttribute('data-sound');
                const sound = document.getElementById(soundId);
                if (sound) {
                    sound.currentTime = 0;
                    sound.volume = 0.3;
                    sound.play().catch(error => console.error('Error playing sound:', error));
                }
            }
        });

        img.addEventListener('mouseleave', () => {
            centerImage.style.opacity = '0';
        });
    });

    // Hover events for pausing rotation
    circleGallery.addEventListener('mouseover', () => {
        circleGallery.style.animationPlayState = 'paused';
    });

    circleGallery.addEventListener('mouseout', () => {
        circleGallery.style.animationPlayState = 'running';
    });
}); 