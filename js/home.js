/**Homepage Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const heroMedia = document.querySelector('.hero-media');
    if (!heroMedia) return;

    const img = heroMedia.querySelector('img');
    const video = heroMedia.querySelector('video');
    
    let isVideoVisible = false;

    // Switch every 5 seconds
    setInterval(() => {
        if (isVideoVisible) {
            // Switch to Image
            video.classList.remove('active');
            img.classList.add('active');
            video.pause();
        } else {
            // Switch to Video
            img.classList.remove('active');
            video.classList.add('active');
            video.play().catch(e => console.log("Auto-play blocked or failed", e));
        }
        isVideoVisible = !isVideoVisible;
    }, 5000);
});
