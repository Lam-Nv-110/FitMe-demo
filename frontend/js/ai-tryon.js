// AI Try-On functionality
let selectedUserImage = null;
let selectedProductImage = null;
let backendStatus = 'checking';

// Initialize AI Try-On
function initAITryOn() {
    // Test backend connection first
    testBackendConnection();
    
    // User image upload
    const userImageInput = document.getElementById('userImage');
    const userImagePreview = document.getElementById('userImagePreview');
    const previewImage = document.getElementById('previewImage');
    const uploadBox = document.getElementById('uploadBox');

    userImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file ảnh!');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Kích thước ảnh không được vượt quá 5MB!');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                userImagePreview.style.display = 'block';
                uploadBox.style.display = 'none';
                selectedUserImage = file;
                checkTryOnReady();
            };
            reader.readAsDataURL(file);
        }
    });

    // Outfit selection
    initOutfitSelection();
}

// Initialize outfit selection
function initOutfitSelection() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const outfitGrid = document.getElementById('outfitGrid');

    // Render outfits
    renderOutfits(outfitGrid);

    // Category filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterOutfits(category, outfitGrid);
        });
    });

    // Outfit selection
    outfitGrid.addEventListener('click', function(e) {
        const outfitItem = e.target.closest('.outfit-item');
        if (outfitItem) {
            const outfitItems = document.querySelectorAll('.outfit-item');
            outfitItems.forEach(item => item.classList.remove('selected'));
            outfitItem.classList.add('selected');
            
            selectedProductImage = outfitItem.getAttribute('data-image');
            checkTryOnReady();
        }
    });

    // Try-on button
    const tryOnBtn = document.getElementById('tryOnBtn');
    tryOnBtn.addEventListener('click', performTryOn);
}

// Render outfits to the grid
function renderOutfits(container) {
    const outfits = [
        {
            id: 1,
            name: 'Áo Blazer Navy',
            price: '799,000₫',
            image: 'images/outfits/ao-blazer-navy.jpg',
            category: 'tops'
        },
        {
            id: 2,
            name: 'Áo sơ mi trắng',
            price: '299,000₫',
            image: 'images/outfits/ao-so-mi-trang.jpg',
            category: 'tops'
        },
        {
            id: 3,
            name: 'Quần tây xám',
            price: '459,000₫',
            image: 'images/outfits/quan-tay-xam.jpg',
            category: 'bottoms'
        },
        {
            id: 4,
            name: 'Đầm body đen',
            price: '659,000₫',
            image: 'images/outfits/dress-body-den.jpg',
            category: 'dresses'
        },
        {
            id: 5,
            name: 'Quần shorts kaki',
            price: '359,000₫',
            image: 'images/outfits/quan-shorts-kaki.jpg',
            category: 'bottoms'
        },
        {
            id: 6,
            name: 'Vòng cổ bạc',
            price: '199,000₫',
            image: 'images/outfits/vong-co-bac.jpg',
            category: 'accessories'
        }
    ];

    container.innerHTML = '';
    
    outfits.forEach(outfit => {
        const outfitItem = document.createElement('div');
        outfitItem.className = 'outfit-item';
        outfitItem.setAttribute('data-image', outfit.image);
        outfitItem.setAttribute('data-category', outfit.category);
        
        outfitItem.innerHTML = `
            <div class="outfit-image">
                <img src="${outfit.image}" alt="${outfit.name}" loading="lazy" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCA1MEM4MCA1Ny43MzE5IDczLjczMTkgNjQgNjYgNjRDNTguMjY4MSA2NCA1MiA1Ny43MzE5IDUyIDUwQzUyIDQyLjI2ODEgNTguMjY4MSAzNiA2NiAzNkM3My43MzE5IDM2IDgwIDQyLjI2ODEgODAgNTBaIiBmaWxsPSIjQ0RDRENEIi8+CjxwYXRoIGQ9Ik0xMzIgODRIMjhDMjUuNzkwOSA4NCAyNCA4Mi4yMDkxIDI0IDgwVjI4QzI0IDI1Ljc5MDkgMjUuNzkwOSAyNCAyOCAyNEgxNzJDMzAuMjA5MSAyNCAxMzIgMjUuNzkwOSAxMzIgMjhWODBaIiBmaWxsPSIjQ0RDRENEIi8+Cjwvc3ZnPgo='">
            </div>
            <div class="outfit-info">
                <h4>${outfit.name}</h4>
                <p class="outfit-price">${outfit.price}</p>
            </div>
        `;
        
        container.appendChild(outfitItem);
    });
}

// Filter outfits by category
function filterOutfits(category, container) {
    const outfitItems = container.querySelectorAll('.outfit-item');
    
    outfitItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Check if try-on is ready
function checkTryOnReady() {
    const tryOnBtn = document.getElementById('tryOnBtn');
    
    if (selectedUserImage && selectedProductImage) {
        tryOnBtn.disabled = false;
        tryOnBtn.textContent = 'Thử đồ ngay';
        tryOnBtn.classList.remove('btn-disabled');
    } else {
        tryOnBtn.disabled = true;
        tryOnBtn.textContent = 'Chọn ảnh và trang phục';
        tryOnBtn.classList.add('btn-disabled');
    }
}

// Test backend connection
async function testBackendConnection() {
    try {
        const response = await fetch('http://localhost:5000/ping', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(5000) // 5s timeout
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend connected:', data);
            backendStatus = 'connected';
            updateBackendStatusUI();
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        backendStatus = 'disconnected';
        updateBackendStatusUI();
    }
}

// Update backend status UI
function updateBackendStatusUI() {
    const statusElement = document.createElement('div');
    statusElement.className = `backend-status ${backendStatus === 'connected' ? 'backend-connected' : 'backend-disconnected'}`;
    statusElement.innerHTML = `
        <i class="fas ${backendStatus === 'connected' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
        ${backendStatus === 'connected' ? 'Backend Connected' : 'Backend Disconnected'}
    `;
    
    // Remove existing status if any
    const existingStatus = document.querySelector('.backend-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    document.body.appendChild(statusElement);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        statusElement.remove();
    }, 5000);
}

// Perform try-on with backend API
// Perform try-on with backend API
async function performTryOn() {
    const tryOnBtn = document.getElementById('tryOnBtn');
    const resultImage = document.getElementById('resultImage');
    
    if (!selectedUserImage || !selectedProductImage) {
        showNotification('Vui lòng chọn cả ảnh của bạn và trang phục!', 'error');
        return;
    }

    try {
        // Show loading state
        tryOnBtn.disabled = true;
        tryOnBtn.textContent = 'Đang xử lý...';
        tryOnBtn.classList.add('loading');
        
        resultImage.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>🔄 Đang tạo ảnh thử đồ...</p>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill" style="width: 10%"></div>
                </div>
                <p class="loading-text" id="loadingText">Đang kết nối đến server...</p>
            </div>
        `;

        // Create FormData
        const formData = new FormData();
        formData.append('userImage', selectedUserImage);

// Nếu selectedProductImage là string (link ảnh), tải lại nó thành blob
if (typeof selectedProductImage === "string") {
    const productBlob = await fetch(selectedProductImage).then(r => r.blob());
    const productFile = new File([productBlob], "product.jpg", { type: productBlob.type });
    formData.append("productImage", productFile);
} else {
    // Nếu đã là file (trường hợp upload khác)
    formData.append("productImage", selectedProductImage);
}


        // Update progress
        updateProgress(30, 'Đang upload ảnh lên server...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        updateProgress(50, 'Đang xử lý với AI...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Call backend API
        const response = await fetch('http://localhost:5000/tryon', {
            method: 'POST',
            body: formData
        });

        updateProgress(80, 'Đang nhận kết quả...');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        updateProgress(100, 'Hoàn thành!');
        
        // Display result
        setTimeout(() => {
            resultImage.innerHTML = `
                <div class="result-success">
                    <img src="${data.generated_image_url}" alt="Kết quả thử đồ" 
                         style="max-width: 100%; border-radius: 10px; margin-bottom: 1rem;">
                    <div class="result-actions">
                        <button class="btn-download" onclick="downloadResult('${data.generated_image_url}')">
                            <i class="fas fa-download"></i> Tải ảnh
                        </button>
                    </div>
                    <p class="success-message">${data.message || 'Thử đồ thành công!'}</p>
                </div>
            `;
        }, 500);

        showNotification('Thử đồ thành công!', 'success');

    } catch (error) {
        console.error('Try-on error:', error);
        
        let errorMessage = 'Có lỗi xảy ra khi thử đồ';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = '❌ Không thể kết nối đến server. Đảm bảo backend đang chạy tại http://localhost:5000';
        } else if (error.message.includes('500')) {
            errorMessage = '❌ Lỗi server. Vui lòng thử lại sau.';
        } else {
            errorMessage = `❌ ${error.message}`;
        }
        
        resultImage.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;"></i>
                <p class="error-message">${errorMessage}</p>
                <button class="btn-retry" onclick="performTryOn()" style="background: var(--primary-color); color: white; padding: 0.5rem 1rem; border-radius: 20px; border: none; cursor: pointer;">
                    <i class="fas fa-redo"></i> Thử lại
                </button>
            </div>
        `;
        
        showNotification(errorMessage, 'error');
    } finally {
        // Reset button state
        tryOnBtn.disabled = false;
        tryOnBtn.textContent = 'Thử đồ lại';
        tryOnBtn.classList.remove('loading');
    }
}

// Helper function to update progress
function updateProgress(percent, text) {
    const progressFill = document.getElementById('progressFill');
    const loadingText = document.getElementById('loadingText');
    if (progressFill) progressFill.style.width = percent + '%';
    if (loadingText) loadingText.textContent = text;
}
// Download result image
function downloadResult(imageUrl) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'fitme-tryon-result.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Share result (basic implementation)
function shareResult(imageUrl) {
    if (navigator.share) {
        navigator.share({
            title: 'Kết quả thử đồ từ FitMe',
            text: 'Xem kết quả thử đồ của tôi trên FitMe!',
            url: imageUrl
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(imageUrl).then(() => {
            showNotification('Đã sao chép link ảnh vào clipboard!', 'success');
        }).catch(() => {
            // Final fallback: open in new tab
            window.open(imageUrl, '_blank');
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for new elements
const additionalStyles = `
    .backend-status {
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .backend-connected {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .backend-disconnected {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .loading-state {
        text-align: center;
        padding: 2rem;
    }
    
    .spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .progress-bar {
        width: 100%;
        height: 6px;
        background: var(--light-gray);
        border-radius: 3px;
        margin: 1rem 0;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        border-radius: 3px;
        transition: width 0.3s ease;
    }
    
    .loading-text {
        font-size: 0.9rem;
        color: var(--gray-color);
        margin: 0.5rem 0 0 0;
    }
    
    .result-success {
        text-align: center;
    }
    
    .result-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        margin: 1rem 0;
    }
    
    .btn-download, .btn-share, .btn-retry {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .btn-download {
        background: var(--secondary-color);
        color: white;
    }
    
    .btn-share {
        background: var(--accent-color);
        color: var(--dark-color);
    }
    
    .btn-retry {
        background: var(--primary-color);
        color: white;
    }
    
    .error-state {
        text-align: center;
        padding: 2rem;
    }
    
    .error-state i {
        font-size: 3rem;
        color: #dc3545;
        margin-bottom: 1rem;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
    }
    
    .notification-success {
        background: #28a745;
    }
    
    .notification-error {
        background: #dc3545;
    }
    
    .notification-info {
        background: #17a2b8;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: 0.5rem;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .btn-disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAITryOn();
});