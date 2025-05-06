document.addEventListener('DOMContentLoaded', () => {
    const foodItemsContainer = document.getElementById('food-items');
    const selectedItemsList = document.getElementById('selected-items');
    const totalPriceDisplay = document.getElementById('total-price');
    const generateBillBtn = document.getElementById('generate-bill-btn');
    const billSection = document.getElementById('bill-section');
    const billedItemsList = document.getElementById('billed-items');
    const billTotalDisplay = document.getElementById('bill-total');
    const customerNameDisplay = document.getElementById('customer-name');
    const customerMobileDisplay = document.getElementById('customer-mobile');
    const customerAddressDisplay = document.getElementById('customer-address');
    const billNumberDisplay = document.getElementById('bill-number');
    const billDateDisplay = document.getElementById('bill-date');
    const nameInput = document.getElementById('name');
    const mobileInput = document.getElementById('mobile');
    const addressInput = document.getElementById('address');

    let foodData = [
        { id: 1, name: 'Burger', price: 50, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5sT5zC4y0-6mPucxnXLg4ATqCxjVN7bAttQ&s' },
        { id: 2, name: 'Pizza', price: 120, image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Pizza-3007395.jpg' },
        { id: 3, name: 'Pasta', price: 80, image: 'https://www.mysavoryadventures.com/wp-content/uploads/2023/01/tandoori-pasta-1.jpg' },
        { id: 4, name: 'Salad', price: 60, image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcToMfWEFgXh4iv0a1F5Df5_7Jm6q_kgbDyX09jiPXI6f6pdc4m_u18oAj9wcXeRuycx-70I4fuEw-i4aPWjIPcLoof4MvhD4fI4Ne5fvy6ZWmfgpJGhLHLG7vM' },
        { id: 5, name: 'Fries', price: 30, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4mAm0Ij46yNWusnG_SLP4JHQBWkh-oixz7g&s' },
        { id: 6, name: 'Coke', price: 25, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVIKGGR4RN1kyyfWl7iCSfSFqoGa-YGJZbCA&s' },
    ];

    let selectedItems = [];

    function renderFoodItems() {
        foodItemsContainer.innerHTML = foodData.map(item => `
            <div class="bg-white shadow-md rounded-md p-4">
                <img src="${item.image}" alt="${item.name}" class="w-full h-60 object-cover rounded-md mb-2">
                <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
                <p class="text-gray-600">₹${item.price.toFixed(2)}</p>
                <button class="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mt-2 select-btn" 
                        data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                    Add to Order
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.select-btn').forEach(button => {
            button.addEventListener('click', addItem);
        });
    }

    function addItem(event) {
        const itemId = parseInt(event.target.dataset.id);
        const itemName = event.target.dataset.name;
        const itemPrice = parseFloat(event.target.dataset.price);

        const existingItem = selectedItems.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            selectedItems.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
        }

        renderSelectedItems();
        updateTotal();
    }

    function removeItem(itemId) {
        selectedItems = selectedItems.filter(item => item.id !== itemId);
        renderSelectedItems();
        updateTotal();
    }

    function updateQuantity(itemId, newQuantity) {
        const item = selectedItems.find(item => item.id === itemId);
        if (item) {
            item.quantity = Math.max(1, parseInt(newQuantity, 10) || 1);
        }
        renderSelectedItems();
        updateTotal();
    }

    function renderSelectedItems() {
        selectedItemsList.innerHTML = selectedItems.map(item => `
            <li class="flex justify-between items-center py-2 border-b">
                <span>${item.name}</span>
                <div class="flex items-center">
                    <button class="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l-md quantity-btn" data-id="${item.id}" data-action="decrement">-</button>
                    <input type="number" class="w-16 px-2 py-1 text-center border border-gray-300 quantity-input" 
                           value="${item.quantity}" data-id="${item.id}">
                    <button class="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r-md quantity-btn" data-id="${item.id}" data-action="increment">+</button>
                </div>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                <button class="text-red-500 hover:text-red-700 text-sm remove-btn" data-id="${item.id}">Remove</button>
            </li>
        `).join('');

        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = parseInt(event.target.dataset.id);
                const action = event.target.dataset.action;
                const item = selectedItems.find(item => item.id === itemId);

                if (item) {
                    if (action === 'increment') item.quantity++;
                    else if (action === 'decrement') item.quantity = Math.max(1, item.quantity - 1);
                }
                renderSelectedItems();
                updateTotal();
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (event) => {
                const itemId = parseInt(event.target.dataset.id);
                const newQuantity = parseInt(event.target.value, 10);
                updateQuantity(itemId, newQuantity);
            });
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = parseInt(event.target.dataset.id);
                removeItem(itemId);
            });
        });
    }

    function updateTotal() {
        const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceDisplay.textContent = `₹${total.toFixed(2)}`;
    }

    generateBillBtn.addEventListener('click', () => {
        if (selectedItems.length === 0) {
            alert('Please select some items to generate a bill.');
            return;
        }

        const customerName = nameInput.value.trim();
        const customerMobile = mobileInput.value.trim();
        const customerAddress = addressInput.value.trim();

        if (!customerName || !customerMobile || !customerAddress) {
            alert('Please fill in all the delivery details.');
            return;
        }

        const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        fetch('http://localhost/hotel_billing/submit_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: customerName,
                mobile: customerMobile,
                address: customerAddress,
                total: total
                // items: selectedItems
            })
        })
        .then(async response => {
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ HTTP Error:", response.status, errorText);
                alert(`❌ Server error: ${response.status}`);
                return;
            }
            if (!contentType || !contentType.includes("application/json")) {
                const errorText = await response.text();
                console.error("❌ Not JSON:", errorText);
                alert("Data stored succesfuly");
                return;
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;
            console.log("✅ Server Response:", data);
            if (data.success) {
                alert(`Order placed successfully! Order ID: ${data.order_id}`);
                // ... your existing bill rendering code ...
            } else {
                alert(`❌ Failed to place order: ${data.message || 'Unknown error'}`);
            }
        })
        .catch(error => {
            console.error("❌ Fetch Error:", error);
            alert("❌ Network or server error occurred. Check console for details.");
        });
        
    });

    renderFoodItems();
});
