const API_BASE_URL = 'http://localhost:5002/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Server error occurred');
  }
  return response.json();
};

export const api = {
  // Categories
  getCategories: () => fetch(`${API_BASE_URL}/categories`).then(handleResponse),
  getCategory: (id) => fetch(`${API_BASE_URL}/categories/${id}`).then(handleResponse),

  // Products
  getProducts: () => fetch(`${API_BASE_URL}/products`).then(handleResponse),
  getProduct: (id) => fetch(`${API_BASE_URL}/products/${id}`).then(handleResponse),

  // Wines
  getWines: () => fetch(`${API_BASE_URL}/wines`).then(handleResponse),
  getWine: (id) => fetch(`${API_BASE_URL}/wines/${id}`).then(handleResponse),

  // Allergens
  getAllergens: () => fetch(`${API_BASE_URL}/allergens`).then(handleResponse),

  // Product Allergens
  getProductAllergens: () => fetch(`${API_BASE_URL}/product-allergens`).then(handleResponse),

  // Orders
  getOrders: (tableNumber) => {
    const url = tableNumber 
      ? `${API_BASE_URL}/orders?table_number=${encodeURIComponent(tableNumber)}` 
      : `${API_BASE_URL}/orders`;
    return fetch(url).then(handleResponse);
  },
  getOrder: (id) => fetch(`${API_BASE_URL}/orders/${id}`).then(handleResponse),
  createOrder: (data) => fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateOrder: (id, data) => fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Ordered Items
  getOrderedItems: () => fetch(`${API_BASE_URL}/ordered-items`).then(handleResponse),
  getOrderItemsByOrderId: (orderId) => fetch(`${API_BASE_URL}/ordered-items/order/${orderId}`).then(handleResponse),
  createOrderedItem: (data) => fetch(`${API_BASE_URL}/ordered-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Invoices
  getInvoices: () => fetch(`${API_BASE_URL}/invoices`).then(handleResponse),
  createInvoice: (data) => fetch(`${API_BASE_URL}/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Desks
  getDesks: () => fetch(`${API_BASE_URL}/desks`).then(handleResponse),
  deleteDesk: (id) => fetch(`${API_BASE_URL}/desks/${id}`, { method: 'DELETE' }).then(handleResponse)
};

export default api;
