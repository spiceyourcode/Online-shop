import api from "./axios";

export const authAPI = {
  login: (email: string, password: string) => api.post("/login/", { email, password }),
  register: (data: { email: string; password: string; name?: string; phone_number?: string }) =>
    api.post("/register/", data),
  refresh: (refreshToken: string) => api.post("/refresh/", { refresh: refreshToken }),
  getProfile: () => api.get("/profile/"),
  updateProfile: (data: { name?: string; phone_number?: string }) => api.patch("/profile/", data),
};

export const productsAPI = {
  list: (params?: Record<string, string | number>) => api.get("/products/", { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}/`),
  create: (formData: FormData) => api.post("/products/", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (slug: string, formData: FormData) => api.patch(`/products/${slug}/`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (slug: string) => api.delete(`/products/${slug}/`),
};

export const categoriesAPI = {
  list: (params?: Record<string, string>) => api.get("/categories/", { params }),
};

export const cartAPI = {
  get: () => api.get("/cart/"),
  addItem: (productId: number, quantity: number = 1) =>
    api.post("/cart/", { product_id: productId, quantity }),
  updateItem: (itemId: number, quantity: number) =>
    api.put(`/cart/${itemId}/`, { quantity }),
  removeItem: (itemId: number) => api.delete(`/cart/${itemId}/`),
};

export const ordersAPI = {
  list: () => api.get("/orders/"),
  myOrders: () => api.get("/orders/my_orders/"),
  get: (id: number) => api.get(`/orders/${id}/`),
  create: (data: {
    address: string; city: string; postal_code: string; country: string;
    items: { product_id: number; quantity: number }[];
  }) => api.post("/orders/", data),
  addShipping: (orderId: number, data: {
    full_name: string; address: string; city: string;
    postal_code: string; country: string; phone: string;
  }) => api.post(`/orders/${orderId}/add_shipping/`, data),
  updateStatus: (orderId: number, status: string) =>
    api.post(`/orders/${orderId}/update_status/`, { status }),
};

export const paymentsAPI = {
  create: (orderId: number) => api.post("/payments/", { order_id: orderId }),
  updateStatus: (paymentId: number, status: string) =>
    api.put(`/payments/${paymentId}/`, { status }),
};

export const reviewsAPI = {
  list: (productId?: number) => api.get("/reviews/", { params: productId ? { product: productId } : {} }),
  create: (data: { product: number; rating: number; comment?: string }) =>
    api.post("/reviews/", data),
  update: (id: number, data: { rating?: number; comment?: string }) =>
    api.patch(`/reviews/${id}/`, data),
  delete: (id: number) => api.delete(`/reviews/${id}/`),
};
