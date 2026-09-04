/* ==========================================================================
   DXTRNPHUB — INTERACTIVE LOGIC & DOWNLOAD GATEWAY SYSTEM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // 2. Platform Filter Tabs (All / Android / PC)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. Realtime Catalog Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            cards.forEach(card => {
                const title = card.getAttribute('data-title').toLowerCase();
                card.style.display = title.includes(query) ? 'flex' : 'none';
            });
        });
    }

    // 4. Dedicated Download Gateway Page & Timer Logic
    const portalOverlay = document.getElementById('downloadPortal');
    const closePortalBtn = document.getElementById('closePortalBtn');
    const openPortalBtns = document.querySelectorAll('.open-portal-btn');

    // Modal elements
    const portalTitle = document.getElementById('portalTitle');
    const portalCategory = document.getElementById('portalCategory');
    const portalPlatform = document.getElementById('portalPlatform');
    const portalSize = document.getElementById('portalSize');
    const portalDownloads = document.getElementById('portalDownloads');
    const portalRating = document.getElementById('portalRating');
    const portalVersion = document.getElementById('portalVersion');
    const portalImage = document.getElementById('portalImage');
    const portalVideo = document.getElementById('portalVideo');
    const portalDesc = document.getElementById('portalDesc');
    const finalDownloadBtn = document.getElementById('finalDownloadBtn');
    const countdownEl = document.getElementById('countdown');
    const timerText = document.getElementById('timerText');

    let timerInterval;

    openPortalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Read dataset attributes
            const title = btn.getAttribute('data-title');
            const category = btn.getAttribute('data-category');
            const platform = btn.getAttribute('data-platform');
            const size = btn.getAttribute('data-size');
            const downloads = btn.getAttribute('data-downloads');
            const rating = btn.getAttribute('data-rating');
            const version = btn.getAttribute('data-version');
            const img = btn.getAttribute('data-img');
            const video = btn.getAttribute('data-video');
            const desc = btn.getAttribute('data-desc');
            const link = btn.getAttribute('data-link');

            // Populate Modal Content
            portalTitle.textContent = title;
            portalCategory.textContent = category;
            portalPlatform.textContent = platform;
            portalSize.textContent = size;
            portalDownloads.textContent = downloads;
            portalRating.textContent = rating;
            portalVersion.textContent = version;
            portalImage.src = img;
            portalVideo.src = video;
            portalDesc.textContent = desc;

            // Reset Download Button State & Countdown
            finalDownloadBtn.href = "#";
            finalDownloadBtn.classList.add('disabled');
            let timeLeft = 5; // 5-second AdSense safety buffer
            countdownEl.textContent = timeLeft;
            timerText.style.display = "block";

            portalOverlay.classList.add('open');

            // Start countdown
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timeLeft--;
                countdownEl.textContent = timeLeft;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    timerText.style.display = "none";
                    finalDownloadBtn.classList.remove('disabled');
                    finalDownloadBtn.href = link;
                }
            }, 1000);
        });
    });

    if (closePortalBtn) {
        closePortalBtn.addEventListener('click', () => {
            portalOverlay.classList.remove('open');
            portalVideo.src = ""; // Stop video playback
            clearInterval(timerInterval);
        });
    }

    // 5. Legal Modals
    const legalModal = document.getElementById('legalModal');
    const closeLegalBtn = document.getElementById('closeLegalBtn');
    const legalContent = document.getElementById('legalContent');
    const legalTriggers = document.querySelectorAll('.open-legal-modal');

    const legalDocs = {
        privacy: `<h2>Privacy Policy</h2><p>At DXTRNPHUB, we respect your data privacy. We do not collect personal identification info unless voluntarily submitted. Third-party ad vendors like Google AdSense use cookies to serve ads based on user interactions.</p>`,
        terms: `<h2>Terms of Service</h2><p>All software hosted on DXTRNPHUB is original or authorized for release. Downloaded files are intended for personal evaluation and non-commercial use.</p>`,
        dmca: `<h2>DMCA Notice</h2><p>DXTRNPHUB complies with digital copyright policies. All files are verified original builds. Contact developer channels for any ownership inquiries.</p>`
    };

    legalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const type = trigger.getAttribute('data-type');
            if (legalDocs[type]) {
                legalContent.innerHTML = legalDocs[type];
                legalModal.classList.add('open');
            }
        });
    });

    if (closeLegalBtn) {
        closeLegalBtn.addEventListener('click', () => legalModal.classList.remove('open'));
    }
});