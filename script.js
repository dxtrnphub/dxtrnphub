document.addEventListener('DOMContentLoaded', () => {
    // OWNER LOGO CONFIGURATION
    const OWNER_LOGO_URL = "translogo.png";

    // REGISTERED OWNER PHONE NUMBERS (DEFAULT OWNER NUMBER)
    let defaultOwnerPhones = ["09102067016"]; 
    let registeredPhones = JSON.parse(localStorage.getItem('dxtrnp_owner_phones')) || defaultOwnerPhones;

    // DEFAULT APPS & GAMES LIST
    const defaultApps = [
        {
            title: "DXTRNP Pro Utility",
            badge: "Utility App",
            size: "150 MB",
            desc: "All-in-one system optimizer and security tool for PC and Android.",
            platform: "Both",
            androidUrl: "#",
            pcUrl: "#"
        },
        {
            title: "Shadow Quest 3D",
            badge: "Action Game",
            size: "1.8 GB",
            desc: "High-graphics offline RPG adventure optimized for PC.",
            platform: "PC",
            pcUrl: "#"
        }
    ];

    let uploadedApps = JSON.parse(localStorage.getItem('dxtrnp_apps')) || defaultApps;
    let publishedAds = JSON.parse(localStorage.getItem('dxtrnp_ads')) || [];

    // STATE VARIABLES
    let activeAdminSelectedUser = null;
    let currentGeneratedOtp = null;
    let activeVerifyingPhone = null;
    let selectedFeedbackMedia = null;
    let selectedFeedbackMediaType = null;

    // DOM ELEMENTS
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const openAdminBtn = document.getElementById('openAdminBtn');
    
    // SECRET DOT & SECRET AUTH FORM ELEMENTS
    const secretOwnerDot = document.getElementById('secretOwnerDot');
    const secretAuthModal = document.getElementById('secretAuthModal');
    const closeSecretAuthBtn = document.getElementById('closeSecretAuthBtn');
    const secretStep1 = document.getElementById('secretStep1');
    const secretStep2 = document.getElementById('secretStep2');
    const secretFullNameInput = document.getElementById('secretFullNameInput');
    const secretAddressInput = document.getElementById('secretAddressInput');
    const secretStep1NextBtn = document.getElementById('secretStep1NextBtn');
    const secretPhoneInput = document.getElementById('secretPhoneInput');
    const secretPhoneError = document.getElementById('secretPhoneError');
    const secretPhoneSubmitBtn = document.getElementById('secretPhoneSubmitBtn');

    // USER APP GRID & ADS CONTAINERS
    const userAppGrid = document.getElementById('userAppGrid');
    const largeAdsContainer = document.getElementById('largeAdsContainer');
    const smallCornerAds = document.getElementById('smallCornerAds');

    // ADS MANAGER ELEMENTS
    const adCategory = document.getElementById('adCategory');
    const adTitle = document.getElementById('adTitle');
    const adText = document.getElementById('adText');
    const adTargetUrl = document.getElementById('adTargetUrl');
    const btnPublishAd = document.getElementById('btnPublishAd');
    const activeAdsList = document.getElementById('activeAdsList');

    // APP UPLOADER & MANAGER ELEMENTS (ADMIN)
    const uploadTitle = document.getElementById('uploadTitle');
    const uploadBadge = document.getElementById('uploadBadge');
    const uploadSize = document.getElementById('uploadSize');
    const uploadPlatform = document.getElementById('uploadPlatform');
    const uploadDesc = document.getElementById('uploadDesc');
    const uploadAndroidUrl = document.getElementById('uploadAndroidUrl');
    const uploadPcUrl = document.getElementById('uploadPcUrl');
    const btnPublishApp = document.getElementById('btnPublishApp');
    const ownerAppsManagerList = document.getElementById('ownerAppsManagerList');

    // SEPARATE FEEDBACK FORM ELEMENTS
    const userChatMessageInput = document.getElementById('userChatMessageInput');
    const userChatMediaInput = document.getElementById('userChatMediaInput');
    const userSendBtn = document.getElementById('userSendBtn');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    // ADMIN ELEMENTS (OTP AUTHENTICATION)
    const adminModal = document.getElementById('adminModal');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const adminPhoneStep = document.getElementById('adminPhoneStep');
    const adminOtpStep = document.getElementById('adminOtpStep');
    const adminDashboard = document.getElementById('adminDashboard');
    
    const adminPhoneInput = document.getElementById('adminPhoneInput');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const phoneError = document.getElementById('phoneError');

    const adminOtpInput = document.getElementById('adminOtpInput');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const backToPhoneBtn = document.getElementById('backToPhoneBtn');
    const otpError = document.getElementById('otpError');
    const otpSentNotice = document.getElementById('otpSentNotice');

    // PHONE MANAGEMENT ELEMENTS
    const newOwnerPhoneInput = document.getElementById('newOwnerPhoneInput');
    const addPhoneBtn = document.getElementById('addPhoneBtn');
    const ownerNumbersList = document.getElementById('ownerNumbersList');

    // CHAT ADMIN DASHBOARD
    const adminUserList = document.getElementById('adminUserList');
    const adminChatMessages = document.getElementById('adminChatMessages');
    const activeChatHeader = document.getElementById('activeChatHeader');
    const adminInputArea = document.getElementById('adminInputArea');
    const adminChatMessageInput = document.getElementById('adminChatMessageInput');
    const adminChatMediaInput = document.getElementById('adminChatMediaInput');
    const adminSendBtn = document.getElementById('adminSendBtn');

    // OTP NOTIFICATION POPUP
    const otpPopup = document.getElementById('otpPopup');
    const otpPopupText = document.getElementById('otpPopupText');
    const closeOtpPopupBtn = document.getElementById('closeOtpPopupBtn');

    // INITIAL RENDERS
    renderUserApps();
    renderWebsiteAds();

    // 0.1 SECRET DOT TRIGGER & 2-STEP AUTHENTICATION
    if (secretOwnerDot) {
        secretOwnerDot.addEventListener('click', () => {
            secretAuthModal.classList.remove('hidden');
            secretStep1.classList.remove('hidden');
            secretStep2.classList.add('hidden');
            secretFullNameInput.value = '';
            secretAddressInput.value = '';
            secretPhoneInput.value = '';
            secretPhoneError.textContent = '';
        });
    }

    if (closeSecretAuthBtn) {
        closeSecretAuthBtn.addEventListener('click', () => {
            secretAuthModal.classList.add('hidden');
        });
    }

    if (secretStep1NextBtn) {
        secretStep1NextBtn.addEventListener('click', () => {
            secretStep1.classList.add('hidden');
            secretStep2.classList.remove('hidden');
        });
    }

    if (secretPhoneSubmitBtn) {
        secretPhoneSubmitBtn.addEventListener('click', () => {
            const enteredPhone = secretPhoneInput.value.trim();

            if (registeredPhones.includes(enteredPhone)) {
                secretAuthModal.classList.add('hidden');
                adminModal.classList.remove('hidden');
                adminPhoneStep.classList.add('hidden');
                adminOtpStep.classList.add('hidden');
                adminDashboard.classList.remove('hidden');
                renderOwnerPhoneNumbers();
                renderActiveAdsList();
                renderOwnerAppsManager();
                loadAdminUserList();
            } else {
                secretAuthModal.classList.add('hidden');
                window.location.href = '#hero';
            }
        });
    }

    // 0.2 ADS PUBLISHING LOGIC
    if (btnPublishAd) {
        btnPublishAd.addEventListener('click', () => {
            const category = adCategory.value;
            const title = adTitle.value.trim();
            const text = adText.value.trim();
            const targetUrl = adTargetUrl.value.trim() || '#';

            if (!title || !text) {
                alert('Please provide both Ad Title and Text.');
                return;
            }

            const newAd = { id: Date.now(), category, title, text, targetUrl };
            publishedAds.push(newAd);
            localStorage.setItem('dxtrnp_ads', JSON.stringify(publishedAds));

            adTitle.value = '';
            adText.value = '';
            adTargetUrl.value = '';

            renderWebsiteAds();
            renderActiveAdsList();
            alert('Website Ad successfully published!');
        });
    }

    function renderWebsiteAds() {
        if (!largeAdsContainer || !smallCornerAds) return;

        const largeAd = publishedAds.find(ad => ad.category === 'large');
        const smallAd = publishedAds.find(ad => ad.category === 'small');

        if (largeAd) {
            largeAdsContainer.innerHTML = `
                <div class="ads-large-content">
                    <div class="ads-large-text">
                        <h4>${escapeHtml(largeAd.title)}</h4>
                        <p>${escapeHtml(largeAd.text)}</p>
                    </div>
                    <a href="${largeAd.targetUrl}" target="_blank" class="btn btn-primary btn-sm">Learn More</a>
                </div>
            `;
            largeAdsContainer.classList.remove('hidden');
        } else {
            largeAdsContainer.classList.add('hidden');
        }

        if (smallAd) {
            smallCornerAds.innerHTML = `
                <div class="small-ads-header">
                    <span>Sponsored Announcement</span>
                    <button class="close-ad-btn" onclick="document.getElementById('smallCornerAds').classList.add('hidden')">&times;</button>
                </div>
                <div class="small-ads-body">
                    <h5>${escapeHtml(smallAd.title)}</h5>
                    <p>${escapeHtml(smallAd.text)}</p>
                    <a href="${smallAd.targetUrl}" target="_blank" class="btn btn-primary btn-sm btn-block">Visit</a>
                </div>
            `;
            smallCornerAds.classList.remove('hidden');
        } else {
            smallCornerAds.classList.add('hidden');
        }
    }

    function renderActiveAdsList() {
        if (!activeAdsList) return;
        activeAdsList.innerHTML = '';

        if (publishedAds.length === 0) {
            activeAdsList.innerHTML = '<span style="color:var(--text-muted);">No active ads posted.</span>';
            return;
        }

        publishedAds.forEach((ad, index) => {
            const chip = document.createElement('li');
            chip.className = 'number-chip';
            chip.innerHTML = `[${ad.category.toUpperCase()}] ${escapeHtml(ad.title)} <span class="remove-phone-btn" data-index="${index}">&times;</span>`;
            activeAdsList.appendChild(chip);
        });

        activeAdsList.querySelectorAll('.remove-phone-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                publishedAds.splice(idx, 1);
                localStorage.setItem('dxtrnp_ads', JSON.stringify(publishedAds));
                renderWebsiteAds();
                renderActiveAdsList();
            });
        });
    }

    // 0.3 DYNAMIC APP PUBLISHING & DELETION
    if (btnPublishApp) {
        btnPublishApp.addEventListener('click', () => {
            const title = uploadTitle.value.trim();
            const badge = uploadBadge.value.trim() || 'App / Game';
            const size = uploadSize.value.trim() || 'Unknown Size';
            const platform = uploadPlatform.value;
            const desc = uploadDesc.value.trim() || 'No description provided.';
            const androidUrl = uploadAndroidUrl.value.trim() || '#';
            const pcUrl = uploadPcUrl.value.trim() || '#';

            if (!title) {
                alert('Please enter an App/Game title.');
                return;
            }

            const newApp = { id: Date.now(), title, badge, size, platform, desc, androidUrl, pcUrl };
            uploadedApps.unshift(newApp);
            localStorage.setItem('dxtrnp_apps', JSON.stringify(uploadedApps));
            
            uploadTitle.value = '';
            uploadBadge.value = '';
            uploadSize.value = '';
            uploadDesc.value = '';
            uploadAndroidUrl.value = '';
            uploadPcUrl.value = '';

            renderUserApps();
            renderOwnerAppsManager();
            alert('App/Game successfully published!');
        });
    }

    function renderOwnerAppsManager() {
        if (!ownerAppsManagerList) return;
        ownerAppsManagerList.innerHTML = '';

        if (uploadedApps.length === 0) {
            ownerAppsManagerList.innerHTML = '<span style="color:var(--text-muted); font-size:0.85rem;">No uploaded apps or games found.</span>';
            return;
        }

        uploadedApps.forEach((app, index) => {
            const item = document.createElement('div');
            item.className = 'owner-app-item';
            item.innerHTML = `
                <div>
                    <strong>${escapeHtml(app.title)}</strong> (${escapeHtml(app.platform)})
                </div>
                <button class="btn-danger-sm" data-index="${index}"><i class="fa-solid fa-trash"></i> Delete</button>
            `;
            ownerAppsManagerList.appendChild(item);
        });

        ownerAppsManagerList.querySelectorAll('.btn-danger-sm').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.closest('button').getAttribute('data-index');
                if (confirm(`Are you sure you want to delete "${uploadedApps[idx].title}"?`)) {
                    uploadedApps.splice(idx, 1);
                    localStorage.setItem('dxtrnp_apps', JSON.stringify(uploadedApps));
                    renderUserApps();
                    renderOwnerAppsManager();
                }
            });
        });
    }

    function renderUserApps() {
        if (!userAppGrid) return;
        userAppGrid.innerHTML = '';

        if (uploadedApps.length === 0) {
            userAppGrid.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No apps or games uploaded yet.</p>';
            return;
        }

        uploadedApps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card animated-card';

            let downloadButtonsHtml = '';

            if (app.platform === 'Android') {
                downloadButtonsHtml = `<a href="${app.androidUrl}" class="dl-btn android"><i class="fa-brands fa-android"></i> Download for Android</a>`;
            } else if (app.platform === 'PC') {
                downloadButtonsHtml = `<a href="${app.pcUrl}" class="dl-btn pc"><i class="fa-brands fa-windows"></i> Download for PC</a>`;
            } else {
                downloadButtonsHtml = `
                    <a href="${app.androidUrl}" class="dl-btn android"><i class="fa-brands fa-android"></i> Download for Android</a>
                    <a href="${app.pcUrl}" class="dl-btn pc"><i class="fa-brands fa-windows"></i> Download for PC</a>
                `;
            }

            card.innerHTML = `
                <span class="card-badge">${escapeHtml(app.badge)}</span>
                <div class="card-icon"><i class="fa-solid fa-gamepad"></i></div>
                <h3>${escapeHtml(app.title)}</h3>
                <p>${escapeHtml(app.desc)}</p>
                <div class="card-meta">
                    <span><i class="fa-solid fa-hard-drive"></i> Size: <strong>${escapeHtml(app.size)}</strong></span>
                    <span><i class="fa-solid fa-laptop-mobile"></i> ${escapeHtml(app.platform)}</span>
                </div>
                <div class="download-stack">
                    ${downloadButtonsHtml}
                </div>
            `;

            userAppGrid.appendChild(card);
        });
    }

    // 1. MOBILE MENU TOGGLE
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 2. SCROLL ANIMATION OBSERVER
    const observerOptions = { threshold: 0.15 };
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-section');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(section => {
        scrollObserver.observe(section);
    });

    // 3. ONE-WAY FEEDBACK SUBMISSION LOGIC (PHOTOS & VIDEOS SUPPORT)
    if (userChatMediaInput) {
        userChatMediaInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                fileNameDisplay.textContent = file.name;
                selectedFeedbackMediaType = file.type.startsWith('video') ? 'video' : 'image';
                const reader = new FileReader();
                reader.onload = function(evt) {
                    selectedFeedbackMedia = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (userSendBtn) {
        userSendBtn.addEventListener('click', () => sendUserFeedback());
    }

    function sendUserFeedback() {
        const text = userChatMessageInput.value.trim();
        if (!text && !selectedFeedbackMedia) {
            alert('Please enter a message or attach a file before sending.');
            return;
        }

        let userSessionKey = localStorage.getItem('dxtrnp_visitor_id');
        if (!userSessionKey) {
            userSessionKey = 'Visitor_' + Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem('dxtrnp_visitor_id', userSessionKey);
        }

        const allChats = JSON.parse(localStorage.getItem('dxtrnp_chats') || '{}');
        if (!allChats[userSessionKey]) allChats[userSessionKey] = [];

        allChats[userSessionKey].push({
            sender: userSessionKey,
            text: text,
            media: selectedFeedbackMedia,
            mediaType: selectedFeedbackMediaType,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        localStorage.setItem('dxtrnp_chats', JSON.stringify(allChats));

        // RESET FORM AND SHOW CONFIRMATION TO USER
        userChatMessageInput.value = '';
        userChatMediaInput.value = '';
        selectedFeedbackMedia = null;
        selectedFeedbackMediaType = null;
        if (fileNameDisplay) fileNameDisplay.textContent = 'Attach photo or video (optional)';

        alert('Thank you! Your feedback has been sent to the website owner.');
    }

    // 4. ADMIN AUTHENTICATION
    if (openAdminBtn) {
        openAdminBtn.addEventListener('click', () => {
            adminModal.classList.remove('hidden');
            resetAdminModalState();
        });
    }

    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            adminModal.classList.add('hidden');
        });
    }

    if (closeOtpPopupBtn) {
        closeOtpPopupBtn.addEventListener('click', () => {
            otpPopup.classList.add('hidden');
        });
    }

    function resetAdminModalState() {
        adminPhoneStep.classList.remove('hidden');
        adminOtpStep.classList.add('hidden');
        adminDashboard.classList.add('hidden');
        phoneError.textContent = '';
        otpError.textContent = '';
        adminPhoneInput.value = '';
        adminOtpInput.value = '';
    }

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', () => {
            const enteredPhone = adminPhoneInput.value.trim();

            if (!registeredPhones.includes(enteredPhone)) {
                phoneError.textContent = 'Access Denied: Unregistered phone number.';
                return;
            }

            currentGeneratedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            activeVerifyingPhone = enteredPhone;

            phoneError.textContent = '';
            adminPhoneStep.classList.add('hidden');
            adminOtpStep.classList.remove('hidden');
            otpSentNotice.textContent = `A 6-digit verification code was generated for ${enteredPhone}.`;

            otpPopupText.textContent = `Security OTP Code: ${currentGeneratedOtp}`;
            otpPopup.classList.remove('hidden');
        });
    }

    if (backToPhoneBtn) {
        backToPhoneBtn.addEventListener('click', () => {
            adminOtpStep.classList.add('hidden');
            adminPhoneStep.classList.remove('hidden');
            otpError.textContent = '';
        });
    }

    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', () => {
            const enteredOtp = adminOtpInput.value.trim();

            if (enteredOtp === currentGeneratedOtp && currentGeneratedOtp !== null) {
                adminOtpStep.classList.add('hidden');
                adminDashboard.classList.remove('hidden');
                otpError.textContent = '';
                otpPopup.classList.add('hidden');

                renderOwnerPhoneNumbers();
                renderActiveAdsList();
                renderOwnerAppsManager();
                loadAdminUserList();
            } else {
                otpError.textContent = 'Invalid OTP code. Access denied.';
            }
        });
    }

    // 5. PHONE NUMBER MANAGEMENT
    function renderOwnerPhoneNumbers() {
        if (!ownerNumbersList) return;
        ownerNumbersList.innerHTML = '';
        registeredPhones.forEach((phone, index) => {
            const chip = document.createElement('li');
            chip.className = 'number-chip';
            chip.innerHTML = `${phone} ${registeredPhones.length > 1 ? `<span class="remove-phone-btn" data-index="${index}">&times;</span>` : ''}`;
            ownerNumbersList.appendChild(chip);
        });

        document.querySelectorAll('.remove-phone-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                registeredPhones.splice(idx, 1);
                saveOwnerPhoneNumbers();
            });
        });
    }

    if (addPhoneBtn) {
        addPhoneBtn.addEventListener('click', () => {
            const newPhone = newOwnerPhoneInput.value.trim();
            if (!newPhone) return;

            if (registeredPhones.includes(newPhone)) {
                alert('Phone number already registered.');
                return;
            }

            registeredPhones.push(newPhone);
            saveOwnerPhoneNumbers();
            newOwnerPhoneInput.value = '';
        });
    }

    function saveOwnerPhoneNumbers() {
        localStorage.setItem('dxtrnp_owner_phones', JSON.stringify(registeredPhones));
        renderOwnerPhoneNumbers();
    }

    // 6. ADMIN CHAT DASHBOARD & FEEDBACK MEDIA VIEW
    function loadAdminUserList() {
        if (!adminUserList) return;
        const allChats = JSON.parse(localStorage.getItem('dxtrnp_chats') || '{}');
        adminUserList.innerHTML = '';

        const users = Object.keys(allChats);

        if (users.length === 0) {
            adminUserList.innerHTML = '<div style="padding:1rem; text-align:center; color:var(--text-muted);">No user feedback received yet.</div>';
            return;
        }

        users.forEach(username => {
            const item = document.createElement('div');
            item.className = `user-item ${activeAdminSelectedUser === username ? 'active' : ''}`;
            item.textContent = username;
            item.onclick = () => {
                activeAdminSelectedUser = username;
                loadAdminUserList();
                loadAdminConversation(username);
            };
            adminUserList.appendChild(item);
        });
    }

    function loadAdminConversation(username) {
        activeChatHeader.textContent = `Feedback from: ${username}`;
        adminInputArea.style.display = 'flex';

        const allChats = JSON.parse(localStorage.getItem('dxtrnp_chats') || '{}');
        const userChats = allChats[username] || [];

        adminChatMessages.innerHTML = '';

        userChats.forEach(msg => {
            const bubble = document.createElement('div');
            const isOwner = msg.sender === 'DXTRNP';
            bubble.className = `msg-bubble ${isOwner ? 'admin' : 'user'}`;

            let authorHtml = `<div class="msg-author">${msg.sender}</div>`;
            if (isOwner) {
                authorHtml = `<div class="msg-author"><img src="${OWNER_LOGO_URL}" class="admin-avatar" alt="DXTRNP Logo"> DXTRNP (Owner)</div>`;
            }

            let mediaHtml = '';
            if (msg.media) {
                if (msg.mediaType === 'video') {
                    mediaHtml = `<video src="${msg.media}" controls class="msg-video"></video>`;
                } else {
                    mediaHtml = `<a href="${msg.media}" target="_blank"><img src="${msg.media}" class="msg-img" title="Click to view full photo"></a>`;
                }
            }

            bubble.innerHTML = `${authorHtml}${msg.text ? `<div>${escapeHtml(msg.text)}</div>` : ''}${mediaHtml}`;
            adminChatMessages.appendChild(bubble);
        });

        adminChatMessages.scrollTop = adminChatMessages.scrollHeight;
    }

    if (adminSendBtn) adminSendBtn.addEventListener('click', () => sendAdminMessage());
    if (adminChatMessageInput) {
        adminChatMessageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendAdminMessage();
        });
    }

    if (adminChatMediaInput) {
        adminChatMediaInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const mediaType = file.type.startsWith('video') ? 'video' : 'image';
                const reader = new FileReader();
                reader.onload = function(evt) {
                    sendAdminMessage(evt.target.result, mediaType);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function sendAdminMessage(mediaSrc = null, mediaType = null) {
        if (!activeAdminSelectedUser) return;
        const text = adminChatMessageInput.value.trim();
        if (!text && !mediaSrc) return;

        const allChats = JSON.parse(localStorage.getItem('dxtrnp_chats') || '{}');
        if (!allChats[activeAdminSelectedUser]) allChats[activeAdminSelectedUser] = [];

        allChats[activeAdminSelectedUser].push({
            sender: 'DXTRNP',
            text: text,
            media: mediaSrc,
            mediaType: mediaType,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        localStorage.setItem('dxtrnp_chats', JSON.stringify(allChats));
        adminChatMessageInput.value = '';
        adminChatMediaInput.value = '';
        loadAdminConversation(activeAdminSelectedUser);
    }

    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, (m) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        }[m]));
    }
});
