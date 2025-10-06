// FitMe Assistant Chatbot
document.addEventListener('DOMContentLoaded', function() {
    initFitMeAssistant();
});

function initFitMeAssistant() {
    const assistantInput = document.getElementById('assistantInput');
    const sendButton = document.getElementById('sendAssistantMessage');
    const assistantMessages = document.querySelector('.assistant-messages');
    const intentButtons = document.querySelectorAll('.intent-btn');

    // Xử lý gửi tin nhắn
    if (sendButton && assistantInput) {
        sendButton.addEventListener('click', sendAssistantMessage);
        assistantInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendAssistantMessage();
            }
        });
    }

    // Xử lý quick intents
    intentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const intent = this.getAttribute('data-intent');
            handleQuickIntent(intent);
        });
    });
}

function sendAssistantMessage() {
    const input = document.getElementById('assistantInput');
    const messagesContainer = document.querySelector('.assistant-messages');
    
    if (!input || !messagesContainer) return;
    
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Thêm tin nhắn người dùng
    addAssistantMessage(message, 'user');
    
    // Xóa input
    input.value = '';
    
    // Phản hồi của bot
    setTimeout(() => {
        const botResponse = generateAssistantResponse(message);
        addAssistantMessage(botResponse, 'bot');
        
        // Cuộn xuống cuối
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

function handleQuickIntent(intent) {
    const messagesContainer = document.querySelector('.assistant-messages');
    let userMessage = '';
    let botResponse = '';
    
    switch(intent) {
        case 'interview':
            userMessage = 'Tôi nên mặc gì đi phỏng vấn?';
            botResponse = 'Đi phỏng vấn nên chọn áo blazer + quần tây. Màu trung tính (xanh navy, xám) thể hiện sự chuyên nghiệp. Tôi đề xuất: Áo Blazer Navy.';
            break;
        case 'party':
            userMessage = 'Đồ đi tiệc thế nào?';
            botResponse = 'Cho buổi tiệc, hãy thử đầm body kèm giày cao gót hoặc áo sequin với quần ống rộng. Màu đen, đỏ hoặc kim tuyến sẽ rất nổi bật!';
            break;
        case 'casual':
            userMessage = 'Phong cách dạo phố';
            botResponse = 'Phong cách dạo phố thoải mái: Áo thun basic + jeans + sneakers. Có thể thêm áo khoác denim và mũ lưỡi trai cho thêm phần cá tính.';
            break;
        case 'travel':
            userMessage = 'Đồ du lịch thoải mái';
            botResponse = 'Đi du lịch nên mặc đồ co giãn thoải mái: Áo thun, quần jogger, giày thể thao. Đừng quên áo khoác nhẹ và kính mát!';
            break;
    }
    
    // Thêm tin nhắn
    addAssistantMessage(userMessage, 'user');
    
    setTimeout(() => {
        addAssistantMessage(botResponse, 'bot');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

function addAssistantMessage(text, sender) {
    const messagesContainer = document.querySelector('.assistant-messages');
    
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageText = document.createElement('p');
    messageText.textContent = text;
    
    messageDiv.appendChild(messageText);
    messagesContainer.appendChild(messageDiv);
    
    // Thêm gợi ý trang phục nếu là bot message
    if (sender === 'bot' && text.includes('đề xuất')) {
        addOutfitSuggestions();
    }
    
    // Cuộn xuống cuối
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addOutfitSuggestions() {
    const messagesContainer = document.querySelector('.assistant-messages');
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'suggested-outfits';
    
    suggestionsDiv.innerHTML = `
        <div class="outfit-suggestion" data-outfit="blazer">
            <div style="width: 60px; height: 60px; background: #e0e0e0; border-radius: 8px; margin: 0 auto 0.5rem; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-tshirt"></i>
            </div>
            <p>Áo Blazer Navy</p>
        </div>
        <div class="outfit-suggestion" data-outfit="dress">
            <div style="width: 60px; height: 60px; background: #e0e0e0; border-radius: 8px; margin: 0 auto 0.5rem; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-tshirt"></i>
            </div>
            <p>Đầm Đen Công sở</p>
        </div>
        <div class="outfit-suggestion" data-outfit="pants">
            <div style="width: 60px; height: 60px; background: #e0e0e0; border-radius: 8px; margin: 0 auto 0.5rem; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-tshirt"></i>
            </div>
            <p>Quần Tây Xám</p>
        </div>
    `;
    
    messagesContainer.appendChild(suggestionsDiv);
    
    // Xử lý click vào gợi ý
    const suggestionItems = suggestionsDiv.querySelectorAll('.outfit-suggestion');
    suggestionItems.forEach(item => {
        item.addEventListener('click', function() {
            const outfit = this.getAttribute('data-outfit');
            selectSuggestedOutfit(outfit);
        });
    });
    
    // Cuộn xuống cuối
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function selectSuggestedOutfit(outfit) {
    let message = '';
    
    switch(outfit) {
        case 'blazer':
            message = 'Tuyệt lựa chọn! Áo Blazer Navy rất phù hợp cho phỏng vấn. Bạn muốn thử nó với AI không?';
            break;
        case 'dress':
            message = 'Đầm đen công sở là lựa chọn an toàn và thanh lịch!';
            break;
        case 'pants':
            message = 'Quần tây xám kết hợp tốt với nhiều loại áo. Rất linh hoạt!';
            break;
    }
    
    addAssistantMessage(message, 'bot');
    
    // Cuộn đến phần thử đồ AI
    setTimeout(() => {
        document.getElementById('ai-tryon').scrollIntoView({
            behavior: 'smooth'
        });
    }, 1500);
}

function generateAssistantResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('phỏng vấn') || lowerMessage.includes('interview')) {
        return 'Đi phỏng vấn nên chọn trang phục lịch sự: Áo sơ mi + quần tây, hoặc đầm công sở. Màu trung tính thể hiện sự chuyên nghiệp.';
    } else if (lowerMessage.includes('tiệc') || lowerMessage.includes('party')) {
        return 'Cho buổi tiệc, bạn có thể thử đầm dạ hội, jumpsuit hoặc áo sequin. Đừng ngại phối thêm phụ kiện nổi bật!';
    } else if (lowerMessage.includes('dạo phố') || lowerMessage.includes('casual')) {
        return 'Phong cách dạo phố: Áo thun/áo phông + jeans/quần short + sneakers. Thoải mái mà vẫn thời trang!';
    } else if (lowerMessage.includes('du lịch') || lowerMessage.includes('travel')) {
        return 'Đồ du lịch nên ưu tiên thoải mái: Chất liệu co giãn, nhiều lớp để dễ phối đồ. Đừng quên giày thể thao!';
    } else if (lowerMessage.includes('màu') || lowerMessage.includes('color')) {
        return 'Màu sắc phù hợp: Da trắng nên mặc màu tối, da ngăm nên chọn màu sáng. Màu pastel phù hợp với mọi loại da!';
    } else if (lowerMessage.includes('body') || lowerMessage.includes('dáng người')) {
        return 'Dáng người quyết định style: Dáng đồng hồ cát phù hợp với nhiều kiểu, dáng tam giác ngược nên cân bằng với quần ống rộng.';
    } else {
        return 'Tôi có thể giúp bạn chọn trang phục cho dịp đặc biệt, tư vấn màu sắc, hoặc gợi ý theo dáng người. Bạn cần hỗ trợ gì?';
    }
}