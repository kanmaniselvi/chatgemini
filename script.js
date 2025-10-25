document.addEventListener('DOMContentLoaded', () => {
    try {
        // --- Element Cache ---
        const elements = {
            chatList: document.getElementById('chatList'),
            chatMessages: document.getElementById('chatMessages'),
            messageInput: document.getElementById('messageInput'),
            searchInput: document.getElementById('searchInput'),
            themeToggle: document.getElementById('theme-toggle'),
            chatName: document.getElementById('chat-name'),
            chatStatus: document.getElementById('chat-status'),
            chatAvatar: document.getElementById('chat-avatar'),
            contactProfileHeader: document.getElementById('contactProfileHeader'),
            micIcon: document.getElementById('micIcon'),
            sendIcon: document.getElementById('sendIcon'),
            addContactBtn: document.getElementById('addContactBtn'),
            renameContactBtn: document.getElementById('renameContactBtn'),
            detailsModal: document.getElementById('detailsModal'),
            myProfileAvatar: document.getElementById('myProfileAvatar'),
            closeProfileBtn: document.getElementById('closeProfileBtn'),
            editProfileBtn: document.getElementById('editProfileBtn'),
            saveProfileBtn: document.getElementById('saveProfileBtn'),
            profileName: document.getElementById('profileName'),
            profileAbout: document.getElementById('profileAbout'),
            profileNameInput: document.getElementById('profileNameInput'),
            profileAboutInput: document.getElementById('profileAboutInput'),
            profileView: document.querySelector('.profile-details-view'),
            profileEdit: document.querySelector('.profile-details-edit'),
            emojiBtn: document.getElementById('emojiBtn'),
            gifBtn: document.getElementById('gifBtn'),
            emojiPicker: document.getElementById('emojiPicker'),
            attachFile: document.getElementById('attachFile'),
            fileInput: document.getElementById('fileInput'),
        };

        // --- App State ---
        const META_AI_ID = 999;
        let currentChatId = null;
        let editingContactId = null;
        let userProfile = { name: 'My Name', about: 'Coding and creating things.' };
        const emojis = ['😀', '😂', '😍', '🤔', '😎', '😭', '😡', '👍', '👎', '❤️', '🎉', '🔥', '💯', '🙌', '🤷'];
        let mockChats = [
            { id: META_AI_ID, name: 'Meta AI', avatar: 'https://i.pravatar.cc/40?u=meta-ai', online: true, lastMessage: 'Ask me anything!', time: '' },
            { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/40?u=alice', online: true, lastMessage: 'See you tomorrow!', time: '10:40 AM' },
        ];
        let mockMessages = {
            1: [{ sender: 'Alice', text: 'Hey there!', time: '10:35 AM' }],
            [META_AI_ID]: [{ sender: 'Meta AI', text: 'Hello! I am a simulated AI. How can I help you today?', time: '' }]
        };

        // --- Core Functions ---
        function renderChatList(filter = '') {
            elements.chatList.innerHTML = '';
            const filteredChats = mockChats.filter(chat => chat.name.toLowerCase().includes(filter.toLowerCase()));
            filteredChats.forEach(chat => {
                const chatItem = document.createElement('div');
                chatItem.className = 'chat-item';
                chatItem.dataset.chatId = chat.id;
                const deleteIcon = chat.id === META_AI_ID ? '' : `<i class="fas fa-trash-alt delete-icon" data-id="${chat.id}"></i>`;
                chatItem.innerHTML = `
                    <div class="avatar"><img src="${chat.avatar}" alt="${chat.name}'s Avatar"></div>
                    <div class="chat-details"><h3>${chat.name}</h3><p>${chat.lastMessage}</p></div>
                    <div class="chat-meta"><p class="time">${chat.time}</p>${deleteIcon}</div>
                `;
                chatItem.addEventListener('click', (e) => {
                    if (e.target.classList.contains('delete-icon')) return;
                    selectChat(chat);
                });
                elements.chatList.appendChild(chatItem);
            });
        }

        function selectChat(chat) {
            currentChatId = chat.id;
            elements.chatName.textContent = chat.name;
            elements.chatStatus.textContent = chat.online ? 'online' : 'offline';
            elements.chatAvatar.src = chat.avatar;
            elements.messageInput.disabled = false;
            elements.renameContactBtn.style.display = chat.id === META_AI_ID ? 'none' : 'inline-block';
            document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
            const currentChatItem = document.querySelector(`.chat-item[data-chat-id='${chat.id}']`);
            if(currentChatItem) currentChatItem.classList.add('active');
            renderMessages(chat.id);
        }

        function renderMessages(chatId) {
            elements.chatMessages.innerHTML = '';
            const messages = mockMessages[chatId] || [];
            messages.forEach(msg => appendMessage(msg.sender, msg.text, msg.time));
            elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
        }

        function appendMessage(sender, text, time) {
            const messageBubble = document.createElement('div');
            messageBubble.className = `message-bubble ${sender === 'self' ? 'sent' : 'received'}`;
            const messageContent = text.startsWith('<') ? text : `<p>${text}</p>`;
            messageBubble.innerHTML = `<div class="message-content">${messageContent}<span class="message-timestamp">${time}</span></div>`;
            elements.chatMessages.appendChild(messageBubble);
            elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
        }
        
        function getAiResponse(message) {
            const lowerCaseMsg = message.toLowerCase();
            if (lowerCaseMsg.includes('hello') || lowerCaseMsg.includes('hi')) return 'Hello! How can I assist you today?';
            if (lowerCaseMsg.includes('how are you')) return "As an AI, I don't have feelings, but I'm operating at peak efficiency!";
            if (lowerCaseMsg.includes('weather')) return "I can't check real-time weather, but I hope it's nice where you are!";
            if (lowerCaseMsg.includes('help')) return 'I am a simulated AI. You can ask me about the weather, how I am, or just say hello.';
            return "I'm a simple demo AI. I can only respond to a few keywords like 'hello', 'weather', or 'help'. Try one of those!";
        }

        function sendMessage() {
            const text = elements.messageInput.value.trim();
            if (text === '' || !currentChatId) return;
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            appendMessage('self', text, time);
            if (!mockMessages[currentChatId]) mockMessages[currentChatId] = [];
            mockMessages[currentChatId].push({ sender: 'self', text, time });

            if (currentChatId === META_AI_ID) {
                setTimeout(() => {
                    const aiResponse = getAiResponse(text);
                    appendMessage('Meta AI', aiResponse, time);
                    mockMessages[currentChatId].push({ sender: 'Meta AI', text: aiResponse, time });
                }, 1500);
            }
            elements.messageInput.value = '';
            toggleSendIcon(false);
        }

        function toggleSendIcon(show) {
            elements.sendIcon.style.display = show ? 'block' : 'none';
            elements.micIcon.style.display = show ? 'none' : 'block';
        }

        function addContact() {
            const name = prompt('Enter contact name:');
            if (name && name.trim() !== '') {
                const newContact = { id: Date.now(), name: name.trim(), avatar: `https://i.pravatar.cc/40?u=${name.trim()}`, online: false, lastMessage: 'No messages yet', time: '' };
                mockChats.push(newContact);
                renderChatList();
            }
        }

        function deleteContact(id) {
            if (id === META_AI_ID) return;
            mockChats = mockChats.filter(chat => chat.id !== id);
            if (currentChatId === id) {
                currentChatId = null;
                elements.chatName.textContent = 'Select a Chat';
                elements.chatStatus.textContent = '';
                elements.chatAvatar.src = 'https://i.pravatar.cc/40';
                elements.chatMessages.innerHTML = '<p class="no-chat-selected">Select a chat to start messaging</p>';
                elements.messageInput.disabled = true;
            }
            renderChatList();
        }

        function openDetailsModal(entityId) {
            editingContactId = entityId;
            let entity, isUser = (entityId === 'self');
            if (isUser) {
                entity = { ...userProfile, avatar: 'https://i.pravatar.cc/100?u=self' };
            } else {
                entity = mockChats.find(c => c.id === entityId);
            }

            if (!entity) return;

            document.querySelector('#detailsModal .profile-info img').src = entity.avatar.replace('40', '100');
            elements.profileName.textContent = entity.name;
            elements.profileAbout.textContent = isUser ? `About: ${entity.about}` : '';
            elements.profileAbout.style.display = isUser ? 'block' : 'none';
            elements.profileAboutInput.style.display = isUser ? 'block' : 'none';
            
            toggleProfileEdit(false);
            elements.detailsModal.style.display = 'block';
        }

        function toggleProfileEdit(isEditing) {
            elements.profileView.style.display = isEditing ? 'none' : 'block';
            elements.profileEdit.style.display = isEditing ? 'flex' : 'none';
            elements.editProfileBtn.style.display = isEditing ? 'none' : 'inline-block';
            elements.saveProfileBtn.style.display = isEditing ? 'inline-block' : 'none';
        }

        function saveProfile() {
            const newName = elements.profileNameInput.value.trim();
            if (editingContactId === 'self') {
                if(newName) userProfile.name = newName;
                userProfile.about = elements.profileAboutInput.value.trim();
                elements.profileName.textContent = userProfile.name;
                elements.profileAbout.textContent = `About: ${userProfile.about}`;
            } else {
                const chat = mockChats.find(c => c.id === editingContactId);
                if (chat && newName) {
                    chat.name = newName;
                    elements.chatName.textContent = newName;
                    renderChatList();
                }
            }
            toggleProfileEdit(false);
        }

        function populateEmojiPicker() {
            emojis.forEach(emoji => {
                const span = document.createElement('span');
                span.textContent = emoji;
                span.addEventListener('click', () => {
                    elements.messageInput.value += emoji;
                    elements.emojiPicker.style.display = 'none';
                    elements.messageInput.focus();
                    toggleSendIcon(elements.messageInput.value.trim() !== '');
                });
                elements.emojiPicker.appendChild(span);
            });
        }

        function handleFileUpload(file) {
            if (file && currentChatId) {
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    let fileContent;
                    if (file.type.startsWith('image/')) {
                        fileContent = `<div class="attached-file-container"><img src="${event.target.result}" alt="${file.name}" class="attached-image"></div>`;
                    } else {
                        fileContent = `<div class="attached-file-container"><a href="${event.target.result}" download="${file.name}" class="attached-file"><i class="fas fa-file-alt"></i> ${file.name}</a></div>`;
                    }
                    appendMessage('self', fileContent, time);
                };

                if (file.type.startsWith('image/')) {
                    reader.readAsDataURL(file);
                } else {
                    reader.readAsDataURL(file);
                }

                elements.fileInput.value = ''; // Reset file input
            }
        }

        // --- Setup Event Listeners ---
        function setupListeners() {
            if (elements.sendIcon) elements.sendIcon.addEventListener('click', sendMessage);
            if (elements.messageInput) {
                elements.messageInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
                elements.messageInput.addEventListener('input', () => toggleSendIcon(elements.messageInput.value.trim() !== ''));
            }
            if (elements.addContactBtn) elements.addContactBtn.addEventListener('click', addContact);
            if (elements.chatList) {
                elements.chatList.addEventListener('click', (e) => {
                    if (e.target.classList.contains('delete-icon')) {
                        const id = parseInt(e.target.dataset.id);
                        if (confirm('Are you sure you want to delete this chat?')) deleteContact(id);
                    }
                });
            }
            if (elements.myProfileAvatar) elements.myProfileAvatar.addEventListener('click', () => openDetailsModal('self'));
            if (elements.contactProfileHeader) elements.contactProfileHeader.addEventListener('click', () => { if(currentChatId) openDetailsModal(currentChatId); });
            if (elements.closeProfileBtn) elements.closeProfileBtn.addEventListener('click', () => elements.detailsModal.style.display = 'none');
            if (elements.editProfileBtn) {
                elements.editProfileBtn.addEventListener('click', () => {
                    const isUser = editingContactId === 'self';
                    const entity = isUser ? userProfile : mockChats.find(c => c.id === editingContactId);
                    elements.profileNameInput.value = entity.name;
                    if (isUser) elements.profileAboutInput.value = entity.about;
                    toggleProfileEdit(true);
                });
            }
            if (elements.saveProfileBtn) elements.saveProfileBtn.addEventListener('click', saveProfile);
            if (elements.emojiBtn) {
                elements.emojiBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    elements.emojiPicker.style.display = elements.emojiPicker.style.display === 'block' ? 'none' : 'block';
                });
            }
            if (elements.gifBtn) {
                elements.gifBtn.addEventListener('click', () => {
                    const url = prompt('Paste a GIF URL:');
                    if (url) {
                        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const gifHtml = `<img src="${url}" alt="GIF" style="max-width: 200px; border-radius: 5px;">`;
                        appendMessage('self', gifHtml, time);
                    }
                });
            }
            if (elements.attachFile) {
                elements.attachFile.addEventListener('click', () => elements.fileInput.click());
            }

            if (elements.fileInput) {
                elements.fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    handleFileUpload(file);
                });
            }
            if (elements.themeToggle) {
                elements.themeToggle.addEventListener('change', () => {
                    document.documentElement.setAttribute('data-theme', elements.themeToggle.checked ? 'dark' : 'light');
                });
            }
            window.addEventListener('click', (e) => {
                if (elements.emojiPicker && e.target !== elements.emojiBtn && !elements.emojiPicker.contains(e.target)) elements.emojiPicker.style.display = 'none';
                if (elements.detailsModal && e.target == elements.detailsModal) elements.detailsModal.style.display = 'none';
            });
        }

        // --- Initial Load ---
        elements.profileName.textContent = userProfile.name;
        elements.profileAbout.textContent = `About: ${userProfile.about}`;
        populateEmojiPicker();
        renderChatList();
        setupListeners();
        elements.messageInput.disabled = true;
        document.documentElement.setAttribute('data-theme', 'dark');
        if (elements.themeToggle) elements.themeToggle.checked = true;

    } catch (error) {
        console.error('A critical error occurred:', error);
        alert('A critical error occurred. Some functionality may be broken. Please reload the page.');
    }
});