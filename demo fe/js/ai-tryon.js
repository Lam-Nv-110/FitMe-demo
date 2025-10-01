// AI Try-On functionality
document.addEventListener('DOMContentLoaded', function() {
    initAITryOn();
});

function initAITryOn() {
    // Upload image functionality
    const userImageInput = document.getElementById('userImage');
    const uploadBox = document.getElementById('uploadBox');
    const userImagePreview = document.getElementById('userImagePreview');
    const previewImage = document.getElementById('previewImage');
    const tryOnBtn = document.getElementById('tryOnBtn');
    
    if (userImageInput && uploadBox) {
        // Click on upload box to trigger file input
        uploadBox.addEventListener('click', function() {
            userImageInput.click();
        });
        
        // Handle file selection
        userImageInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    userImagePreview.style.display = 'block';
                    uploadBox.style.display = 'none';
                    
                    // Enable try-on button
                    tryOnBtn.disabled = false;
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        // Drag and drop functionality
        uploadBox.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ff6b6b';
            this.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
        });
        
        uploadBox.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#e9ecef';
            this.style.backgroundColor = 'transparent';
        });
        
        uploadBox.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#e9ecef';
            this.style.backgroundColor = 'transparent';
            
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                userImageInput.files = e.dataTransfer.files;
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    userImagePreview.style.display = 'block';
                    uploadBox.style.display = 'none';
                    
                    // Enable try-on button
                    tryOnBtn.disabled = false;
                }
                
                reader.readAsDataURL(e.dataTransfer.files[0]);
            }
        });
    }
    
    // Outfit categories
    const categoryButtons = document.querySelectorAll('.category-btn');
    const outfitGrid = document.getElementById('outfitGrid');
    
    if (categoryButtons.length > 0 && outfitGrid) {
        // Load outfits
        loadOutfits('all');
        
        // Category filter
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Load outfits for selected category
                const category = this.getAttribute('data-category');
                loadOutfits(category);
            });
        });
    }
    
    // Try-on button
    if (tryOnBtn) {
        tryOnBtn.addEventListener('click', performTryOn);
    }
}

function loadOutfits(category) {
    const outfitGrid = document.getElementById('outfitGrid');
    
    if (!outfitGrid) return;
    
    // Sample outfits data
    const allOutfits = [
        { id: 1, name: 'Áo thun trắng', category: 'tops', image: 'images/outfits/tshirt.jpg' },
        { id: 2, name: 'Quần jeans xanh', category: 'bottoms', image: 'images/outfits/jeans.jpg' },
        { id: 3, name: 'Đầm hồng dáng A', category: 'dresses', image: 'images/outfits/dress.jpg' },
        { id: 4, name: 'Áo sơ mi kẻ', category: 'tops', image: 'images/outfits/shirt.jpg' },
        { id: 5, name: 'Quần shorts kaki', category: 'bottoms', image: 'images/outfits/shorts.jpg' },
        { id: 6, name: 'Váy công sở', category: 'dresses', image: 'images/outfits/office-dress.jpg' },
        { id: 7, name: 'Túi da màu nâu', category: 'accessories', image: 'images/outfits/bag.jpg' },
        { id: 8, name: 'Vòng cổ bạc', category: 'accessories', image: 'images/outfits/necklace.jpg' },
        { id: 9, name: 'Áo len cổ lọ', category: 'tops', image: 'images/outfits/sweater.jpg' }
    ];
    
    // Filter outfits by category
    let filteredOutfits = allOutfits;
    if (category !== 'all') {
        filteredOutfits = allOutfits.filter(outfit => outfit.category === category);
    }
    
    // Render outfits
    outfitGrid.innerHTML = '';
    
    filteredOutfits.forEach(outfit => {
        const outfitItem = document.createElement('div');
        outfitItem.className = 'outfit-item';
        outfitItem.setAttribute('data-outfit-id', outfit.id);
        outfitItem.innerHTML = `
            <img src="${outfit.image}" alt="${outfit.name}">
            <div class="outfit-info">
                <p>${outfit.name}</p>
            </div>
        `;
        
        // Add click event to select outfit
        outfitItem.addEventListener('click', function() {
            // Remove selected class from all items
            document.querySelectorAll('.outfit-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Add selected class to clicked item
            this.classList.add('selected');
        });
        
        outfitGrid.appendChild(outfitItem);
    });
}

function performTryOn() {
    const resultImage = document.getElementById('resultImage');
    const selectedOutfit = document.querySelector('.outfit-item.selected');
    
    if (!selectedOutfit) {
        alert('Vui lòng chọn một bộ đồ để thử!');
        return;
    }
    
    // Show loading state
    resultImage.innerHTML = '<p>Đang xử lý với AI... Vui lòng chờ!</p>';
    
    // Simulate AI processing (in a real app, this would be an API call)
    setTimeout(() => {
        const outfitId = selectedOutfit.getAttribute('data-outfit-id');
        const outfitName = selectedOutfit.querySelector('p').textContent;
        
        // In a real implementation, you would get the result from the AI API
        // For demo, we'll just show a message
        resultImage.innerHTML = `
            <div style="text-align: center;">
                <p>Kết quả thử đồ với ${outfitName}</p>
                <p style="font-size: 0.9rem; color: #6c757d; margin-top: 1rem;">
                    (Trong phiên bản thực tế, đây sẽ là hình ảnh bạn đã thử bộ đồ)
                </p>
            </div>
        `;
    }, 2000);
}