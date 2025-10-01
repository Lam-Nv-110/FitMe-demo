// Chatbot functionality
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
    
    if (chatbotIcon && chatbotWindow) {
        // Toggle chatbot window
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
            
            // Send message on Enter key
            chatbotInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }
}

function sendMessage() {
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    if (!chatbotInput || !chatbotMessages) return;
    
    const message = chatbotInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    chatbotInput.value = '';
    
    // Simulate bot thinking
    setTimeout(() => {
        // Generate bot response
        const botResponse = generateBotResponse(message);
        addMessage(botResponse, 'bot');
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
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
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    // Simple response logic - in a real app, this would connect to an AI service
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return 'Xin chào! Tôi là trợ lý ảo của FitMe. Tôi có thể giúp gì cho bạn?';
    } else if (lowerMessage.includes('thử đồ') || lowerMessage.includes('ai')) {
        return 'Bạn có thể sử dụng tính năng "Thử đồ với AI" của chúng tôi. Chỉ cần tải ảnh của bạn lên và chọn bộ đồ bạn muốn thử!';
    } else if (lowerMessage.includes('mua sắm') || lowerMessage.includes('sản phẩm')) {
        return 'Chúng tôi có rất nhiều sản phẩm thời trang đa dạng. Bạn có thể lọc theo danh mục, giá hoặc kích cỡ để tìm sản phẩm phù hợp.';
    } else if (lowerMessage.includes('xu hướng') || lowerMessage.includes('trend')) {
        return 'Chúng tôi cập nhật xu hướng thời trang mới nhất hàng tuần. Hãy ghé thăm mục "Xu hướng" để khám phá!';
    } else if (lowerMessage.includes('giỏ hàng') || lowerMessage.includes('cart')) {
        return 'Bạn có thể xem giỏ hàng của mình bằng cách nhấp vào biểu tượng giỏ hàng ở góc trên bên phải.';
    } else if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thanks')) {
        return 'Không có gì! Nếu bạn có thêm câu hỏi, đừng ngần ngại hỏi tôi nhé!';
    } else {
        return 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về thử đồ AI, mua sắm, xu hướng thời trang hoặc các tính năng khác của FitMe.';
    }
}