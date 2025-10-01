// Main JavaScript file for FitMe

// Scroll to section function
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initFilters();
    initProducts();
    initTrends();
});

// Navigation functionality
function initNavigation() {
    // Highlight active nav item on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Mobile menu toggle (if needed in future)
    // Add mobile menu functionality here when needed
}

// Filter functionality for shopping section
function initFilters() {
    const categoryFilter = document.getElementById('category');
    const priceFilter = document.getElementById('price');
    const sizeFilter = document.getElementById('size');
    
    if (categoryFilter && priceFilter && sizeFilter) {
        [categoryFilter, priceFilter, sizeFilter].forEach(filter => {
            filter.addEventListener('change', filterProducts);
        });
    }
}

function filterProducts() {
    // This would filter products based on selected filters
    // For demo, we'll just log the values
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const size = document.getElementById('size').value;
    
    console.log('Filtering by:', { category, price, size });
    
    // In a real implementation, you would:
    // 1. Make an API call with filter parameters
    // 2. Update the products grid with filtered results
}

// Products functionality
function initProducts() {
    // Load products (in a real app, this would be from an API)
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsGrid) {
        // Sample products data
        const products = [
            {
                id: 1,
                name: 'Áo thun basic',
                price: '199,000₫',
                image: 'images/products/product1.jpg',
                category: 'tops'
            },
            {
                id: 2,
                name: 'Quần jeans slim',
                price: '499,000₫',
                image: 'images/products/product2.jpg',
                category: 'bottoms'
            },
            {
                id: 3,
                name: 'Đầm maxi hoa',
                price: '699,000₫',
                image: 'images/products/product3.jpg',
                category: 'dresses'
            },
            {
                id: 4,
                name: 'Áo khoác denim',
                price: '799,000₫',
                image: 'images/products/product4.jpg',
                category: 'tops'
            },
            {
                id: 5,
                name: 'Váy công sở',
                price: '599,000₫',
                image: 'images/products/product5.jpg',
                category: 'dresses'
            },
            {
                id: 6,
                name: 'Túi xách da',
                price: '399,000₫',
                image: 'images/products/product6.jpg',
                category: 'accessories'
            }
        ];
        
        // Render products
        renderProducts(products, productsGrid);
        
        // Add to cart functionality
        const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                addToCart(productId);
            });
        });
        
        // Load more functionality
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreProducts);
        }
    }
}

function renderProducts(products, container) {
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
                <div class="product-actions">
                    <button class="btn-add-to-cart" data-product-id="${product.id}">Thêm vào giỏ</button>
                    <button class="btn-view-details">Xem chi tiết</button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

function addToCart(productId) {
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    let count = parseInt(cartCount.textContent);
    count++;
    cartCount.textContent = count;
    
    // Show notification (in a real app, you might use a toast notification)
    alert('Sản phẩm đã được thêm vào giỏ hàng!');
    
    // In a real implementation, you would:
    // 1. Add product to cart in local storage or send to server
    // 2. Update cart UI
}

function loadMoreProducts() {
    // In a real implementation, this would load more products from an API
    alert('Tính năng "Xem thêm" đang được phát triển!');
}

// Trends functionality
function initTrends() {
    // Add click handlers to trend cards
    const trendCards = document.querySelectorAll('.trend-card');
    
    trendCards.forEach(card => {
        card.addEventListener('click', function() {
            const trendTitle = this.querySelector('h3').textContent;
            alert(`Bạn đã chọn xu hướng: ${trendTitle}`);
        });
    });
}