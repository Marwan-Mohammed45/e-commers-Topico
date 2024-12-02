// استدعاء وظيفة لعرض المنتجات في الكاروسيل
function fetchAndDisplayCarousel(jsonPath, containerId) {
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            const productContainer = document.getElementById(containerId);

            if (data.length === 0) {
                productContainer.innerHTML = "<p>No products available</p>";
                return;
            }

            let carouselContent = '';

            for (let i = 0; i < data.length; i++) {
                if (i % 4 === 0) {
                    if (i !== 0) carouselContent += `</div></div>`;
                    carouselContent += `<div class="carousel-item ${i === 0 ? 'active' : ''}"><div class="row">`;
                }

                carouselContent += `
                    <div class="col-md-3 col-6">
                        <div class="product-card position-relative">
                            ${data[i].discount ? `<span class="discount-badge">${data[i].discount}% OFF</span>` : ''}
                            <a href="product-details.html?id=${data[i].id}" style="text-decoration: none; color: inherit;">
                                <img src="${data[i].img}" alt="${data[i].name}" class="img-fluid">
                                <h5>${data[i].name}</h5>
                                <p>
                                    <strong>$${data[i].price}</strong>
                                    ${data[i].old_price ? `<del class="text-muted">$${data[i].old_price}</del>` : ''}
                                </p>
                            </a>
                        </div>
                    </div>
                `;
            }

            carouselContent += `</div></div>`;
            productContainer.innerHTML = carouselContent;
        })
        .catch(error => console.error("Error fetching products:", error));
}

// استدعاء الدالة للأقسام الثلاثة
fetchAndDisplayCarousel('js/items.json', 'product-container'); // الكاروسيل الأول
fetchAndDisplayCarousel('js/items.json', 'dynamic-products'); // الكاروسيل الثاني
fetchAndDisplayCarousel('js/items.json', 'third-carousel-products'); // الكاروسيل الثالث

// التعامل مع السلة الجانبية
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const cartItemsContainer = document.querySelector('.cart-items');

    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.toggle('active');
    });

    closeSidebar.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // وظيفة لإضافة المنتج إلى السلة
    function addToCart(productName, productPrice) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <span>${productName}</span>
            <span>$${productPrice}</span>
        `;
        cartItemsContainer.appendChild(itemElement);
    }

    // إضافة منتج عند الضغط على زر "Buy"
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute('data-name');
            const productPrice = button.getAttribute('data-price');
            addToCart(productName, productPrice);
        });
    });
});

// دالة البحث
function searchProducts(event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // الحصول على النص المدخل في الـ input
    fetch('js/items.json')  // جلب البيانات من الـ JSON
        .then(response => response.json())
        .then(data => {
            // تصفية المنتجات بناءً على النص المدخل
            const filteredProducts = data.filter(product => product.name.toLowerCase().includes(searchInput));
            displaySearchResults(filteredProducts);
        })
        .catch(error => console.error("Error fetching products:", error));
}

// عرض المنتجات بعد تصفيتها
function displaySearchResults(products) {
    const productContainer = document.getElementById('product-container'); // تحديد الـ container لعرض النتائج
    if (products.length === 0) {
        productContainer.innerHTML = "<p>No products found</p>";
        return;
    }

    let searchResultsHTML = '';
    products.forEach(product => {
        searchResultsHTML += `
            <div class="product-item">
                <img src="${product.img}" alt="${product.name}" />
                <h5>${product.name}</h5>
                <p>Price: $${product.price}</p>
            </div>
        `;
    });
    productContainer.innerHTML = searchResultsHTML;
}

// تعريف متغيرات السلة
let cartItems = []; // مصفوفة لتخزين العناصر
let cartItemsContainer = document.getElementById("cart-items"); // مكان عرض المنتجات في السلة
let subtotalElement = document.getElementById("subtotal"); // الإجمالي الفرعي

// دالة لإضافة المنتجات إلى السلة
function addToCart(product) {
    cartItems.push(product); // إضافة المنتج إلى المصفوفة
    renderCart(); // تحديث عرض السلة
}

// دالة لعرض المنتجات داخل السلة
function renderCart() {
    cartItemsContainer.innerHTML = ""; // تفريغ السلة قبل التحديث
    let subtotal = 0; // إجمالي السعر

    cartItems.forEach((item, index) => {
        // إنشاء كود HTML لكل منتج
        const itemHTML = `
        <div class="cart-item">
            <div>
                <img src="${item.img}" alt="${item.name}" style="width: 50px; height: 50px;">
            </div>
            <div>
                <h5>${item.name}</h5>
                <p>$${item.price}</p>
            </div>
            <div>
                <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
            </div>
        </div>
        <hr>`;
        cartItemsContainer.innerHTML += itemHTML; // إضافة المنتج للسلة

        // تحديث الإجمالي
        subtotal += item.price;
    });

    // تحديث الإجمالي الظاهر
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
}

// دالة لإزالة المنتجات من السلة
function removeFromCart(index) {
    cartItems.splice(index, 1); // إزالة المنتج بناءً على موقعه
    renderCart(); // إعادة عرض السلة بعد الإزالة
}

// دالة لفتح وإغلاق السلة
function toggleCart() {
    const cartSidebar = document.querySelector(".cart-sidebar");
    cartSidebar.style.display = cartSidebar.style.display === "block" ? "none" : "block";
}

// دالة للعودة للتسوق (إغلاق السلة)
function continueShopping() {
    toggleCart(); // إغلاق السلة
}

// اختيار العناصر
const cartIcon = document.getElementById("cartIcon");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");

// عرض الـ aside عند الضغط على الأيقونة
cartIcon.addEventListener("click", () => {
    cartSidebar.classList.add("open");
});

// إخفاء الـ aside عند الضغط على زر الإغلاق
closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
});

// دالة البحث مع توجيه المستخدم إلى صفحة النتائج
function searchProducts(event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // الحصول على النص المدخل في الـ input
    if (searchInput) {
        window.location.href = `search-results.html?query=${encodeURIComponent(searchInput)}`;
    }
}

