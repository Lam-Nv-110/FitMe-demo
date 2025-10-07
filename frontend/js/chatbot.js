// Chatbot functionality với suggestions
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
});

function initChatbot() {
    const chatbotIcon = document.getElementById('chatbotIcon');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbot = document.getElementById('closeChatbot');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');

    // Toggle chatbot window
    if (chatbotIcon && chatbotWindow) {
        chatbotIcon.addEventListener('click', function() {
            chatbotWindow.classList.toggle('active');
        });
        
        // Close chatbot
        if (closeChatbot) {
            closeChatbot.addEventListener('click', function() {
                chatbotWindow.classList.remove('active');
            });
        }
        
        // Send message
        if (sendMessageBtn && chatbotInput) {
            sendMessageBtn.addEventListener('click', sendMessage);
            
            chatbotInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }

        // Suggestion buttons
        suggestionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const eventType = this.getAttribute('data-event');
                handleSuggestion(eventType);
            });
        });
    }
}

function handleSuggestion(eventType) {
    const response = getSuggestionResponse(eventType);
    
    // Thêm tin nhắn user
    addMessage(getUserQuestion(eventType), 'user');
    
    // Thêm tin nhắn bot với delay
    setTimeout(() => {
        addMessage(response.advice, 'bot');
        
        // Thêm outfit suggestions
        if (response.outfits && response.outfits.length > 0) {
            addOutfitSuggestions(response.outfits, response.action);
        }
    }, 1000);
}

function getSuggestionResponse(eventType) {
    const responses = {
        'interview': {
            advice: '💼 **Phỏng vấn công sở:**\n• Áo sơ mi trắng/xanh than\n• Quần tây đen/xám\n• Blazer (tùy ngành)\n• Giày da lịch sự\n• Màu trung tính thể hiện sự chuyên nghiệp',
            outfits: ['Áo Blazer Navy', 'Áo sơ mi trắng', 'Quần tây xám'],
            action: 'professional'
        },
        'date': {
            advice: '💖 **Hẹn hò lãng mạn:**\n• Đầm body/dáng A pastel\n• Áo croptop + chân váy xòe\n• Phụ kiện tinh tế (vòng cổ, hoa tai)\n• Giày sandal/giày cao gót thấp\n• Màu hồng, trắng, đỏ thể hiện sự nữ tính',
            outfits: ['Đầm body đen', 'Áo croptop', 'Chân váy xòe'],
            action: 'romantic'
        },
        'party': {
            advice: '🎉 **Tiệc tối sang trọng:**\n• Đầm sequin/dạ hội\n• Jumpsuit satin\n• Áo glitter + quần ống rộng\n• Phụ kiện kim loại nổi bật\n• Giày cao gót, clutch nhỏ\n• Màu đen, đỏ, kim tuyến',
            outfits: ['Đầm sequin', 'Jumpsuit satin', 'Áo glitter'],
            action: 'party'
        },
        'casual': {
            advice: '👖 **Dạo phố thoải mái:**\n• Áo thun/áo phông basic\n• Jeans/quần short\n• Sneakers/giày thể thao\n• Áo khoác denim/hoodie\n• Mũ lưỡi trai, túi đeo chéo\n• Màu sắc tươi sáng, thoải mái',
            outfits: ['Áo thun basic', 'Quần jeans', 'Áo khoác denim'],
            action: 'casual'
        },
        'travel': {
            advice: '✈️ **Du lịch tiện lợi:**\n• Áo thun co giãn\n• Quần jogger/leggings\n• Giày thể thao êm ái\n• Áo khoác nhẹ, khăn choàng\n• Balo, mũ rộng vành\n• Chất liệu thoáng mát, dễ giặt',
            outfits: ['Áo thun co giãn', 'Quần jogger', 'Áo khoác nhẹ'],
            action: 'travel'
        },
        'wedding': {
            advice: '👰 **Đám cưới trang trọng:**\n• Đầm midi/dài pastel\n• Áo blazer + váy bút chì\n• Phụ kiện ngọc trai\n• Giày cao gót, túi cầm tay\n• Màu xanh pastel, hồng nhạt, be\n• Tránh màu trắng/đỏ',
            outfits: ['Đầm midi', 'Áo blazer', 'Váy bút chì'],
            action: 'formal'
        },
        'hot': {
            advice: '☀️ **Thời tiết nóng bức:**\n• Áo thun cotton, linen\n• Quần short, váy maxi\n• Sandal, giày thể thao thoáng\n• Mũ rộng vành, kính mát\n• Màu sáng (trắng, pastel)\n• Chất liệu thoáng khí',
            outfits: ['Áo thun cotton', 'Quần short', 'Váy maxi'],
            action: 'summer'
        },
        'cold': {
            advice: '❄️ **Thời tiết lạnh giá:**\n• Áo len cổ lọ/cao cổ\n• Quần jeans/quần tây dày\n• Áo khoác dạ, parka\n• Boots, giày kín\n• Khăn choàng, găng tay\n• Layer nhiều lớp mỏng',
            outfits: ['Áo len cổ lọ', 'Áo khoác dạ', 'Quần jeans'],
            action: 'winter'
        },
        'rain': {
            advice: '🌧️ **Trời mưa ẩm ướt:**\n• Áo khoác chống thấm\n• Quần nhanh khô\n• Boots/giày không thấm\n• Ô, mũ có vành\n• Màu tối (đen, xám, navy)\n• Chất liệu nhanh khô',
            outfits: ['Áo khoác mưa', 'Quần nhanh khô', 'Boots'],
            action: 'rainy'
        }
    };
    
    return responses[eventType] || {
        advice: 'Xin lỗi, tôi chưa có gợi ý cho dịp này. Hãy thử chọn một dịp khác!',
        outfits: [],
        action: 'general'
    };
}

function getUserQuestion(eventType) {
    const questions = {
        'interview': 'Tôi nên mặc gì đi phỏng vấn?',
        'date': 'Đồ hẹn hò nên mặc thế nào?',
        'party': 'Gợi ý đồ đi tiệc tối',
        'casual': 'Phong cách dạo phố casual',
        'travel': 'Đồ du lịch tiện lợi',
        'wedding': 'Mặc gì đi đám cưới?',
        'hot': 'Trời nóng mặc gì cho mát?',
        'cold': 'Trời lạnh nên mặc gì?',
        'rain': 'Đồ đi mưa thế nào?'
    };
    
    return questions[eventType] || 'Tôi cần gợi ý trang phục';
}

function addOutfitSuggestions(outfits, action) {
    const messagesContainer = document.getElementById('chatbotMessages');
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'outfit-suggestions';
    
    suggestionsDiv.innerHTML = `
        <div class="suggestion-header">
            <strong>🎯 Gợi ý trang phục phù hợp:</strong>
        </div>
        <div class="outfit-list">
            ${outfits.map(outfit => `
                <div class="outfit-item-suggestion" data-outfit="${outfit}">
                    <i class="fas fa-tshirt"></i>
                    <span>${outfit}</span>
                </div>
            `).join('')}
        </div>
        <div class="suggestion-actions">
            <button class="action-btn try-on-btn" data-action="${action}">
                <i class="fas fa-magic"></i>
                Thử đồ ngay
            </button>
            <button class="action-btn shop-btn" data-action="${action}">
                <i class="fas fa-shopping-bag"></i>
                Mua sắm
            </button>
        </div>
    `;
    
    messagesContainer.appendChild(suggestionsDiv);
    
    // Thêm event listeners
    const tryOnBtn = suggestionsDiv.querySelector('.try-on-btn');
    const shopBtn = suggestionsDiv.querySelector('.shop-btn');
    
    if (tryOnBtn) {
        tryOnBtn.addEventListener('click', function() {
            scrollToSection('ai-tryon');
            addMessage('Tuyệt! Hãy đến phần thử đồ AI để trải nghiệm ngay! 🎯', 'bot');
        });
    }
    
    if (shopBtn) {
        shopBtn.addEventListener('click', function() {
            scrollToSection('shopping');
            addMessage('Đến cửa hàng ngay! Tôi sẽ gợi ý sản phẩm phù hợp 🛍️', 'bot');
        });
    }
    
    // Cuộn xuống cuối
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Giữ nguyên các hàm cũ
function sendMessage() {
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    if (!chatbotInput || !chatbotMessages) return;
    
    const message = chatbotInput.value.trim();
    
    if (message === '') return;
    
    addMessage(message, 'user');
    chatbotInput.value = '';
    
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        addMessage(botResponse, 'bot');
    }, 1000);
}

function addMessage(text, sender) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    if (!chatbotMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageText = document.createElement('p');
    messageText.textContent = text;
    
    messageDiv.appendChild(messageText);
    chatbotMessages.appendChild(messageDiv);
    
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    // Giữ nguyên logic cũ
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('cảm ơn')) {
        return 'Không có gì! 😊 Nếu bạn cần thêm gợi ý, hãy chọn một dịp ở bên dưới nhé!';
    } else if (lowerMessage.includes('chào')) {
        return 'Xin chào! Rất vui được gặp bạn. Hãy chọn một dịp hoặc nhập câu hỏi của bạn!';
    } else {
        return 'Cảm ơn câu hỏi của bạn! Hãy chọn một dịp cụ thể ở bên dưới để tôi có thể gợi ý trang phục phù hợp nhất nhé! 👗';
    }
}

function scrollToSection(sectionId) {
    document.getElementById('chatbotWindow').classList.remove('active');
    setTimeout(() => {
        document.getElementById(sectionId).scrollIntoView({
            behavior: 'smooth'
        });
    }, 500);
}
// Thêm vào file chatbot.js
function toggleSuggestions(showFull = false) {
    const suggestions = document.querySelector('.chatbot-suggestions');
    const messages = document.querySelector('.chatbot-messages');
    
    if (showFull) {
        suggestions.classList.add('visible');
    } else {
        // Tự động ẩn 1 phần nếu có tin nhắn mới từ bot
        const lastMessage = messages.lastElementChild;
        if (lastMessage && lastMessage.classList.contains('bot-message')) {
            suggestions.classList.remove('visible');
        }
    }
}

// Gọi hàm này khi gửi tin nhắn hoặc nhận phản hồi từ bot