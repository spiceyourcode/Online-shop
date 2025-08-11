# Online Shop - Full Stack E-Commerce Application

A modern full-stack e-commerce application built with Django REST Framework backend and React frontend.

## 🚀 Project Overview

This project is a complete e-commerce solution featuring:
- **Backend**: Django REST API with product management, user authentication, and order processing
- **Frontend**: React-based shopping interface with modern UI/UX
- **Database**: SQLite (development) with Django ORM
- **Authentication**: JWT-based authentication system

## 📁 Project Structure

```
online-shop/
├── backend/                 # Django REST API
│   ├── eshop/              # Django project settings
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   └── db.sqlite3         # SQLite database
├── frontend/               # React application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
└── README.md             # This file
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 4.x
- **API**: Django REST Framework
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Authentication**: Django REST Framework Simple JWT
- **CORS**: django-cors-headers

### Frontend
- **Framework**: React 18.x
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **Routing**: React Router

## 🚦 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (admin):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server:**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will be available at: `http://localhost:5173`

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Refresh JWT token

### Products
- `GET /api/products/` - List all products
- `GET /api/products/:id/` - Get product details
- `POST /api/products/` - Create product (admin)
- `PUT /api/products/:id/` - Update product (admin)
- `DELETE /api/products/:id/` - Delete product (admin)

### Orders
- `GET /api/orders/` - List user orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/:id/` - Get order details

### Cart
- `GET /api/cart/` - Get cart items
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/` - Update cart item
- `DELETE /api/cart/remove/` - Remove item from cart

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Production)
1. Set environment variables:
   ```bash
   export DEBUG=False
   export SECRET_KEY=your-secret-key
   export DATABASE_URL=postgresql://...
   ```

2. Run production setup:
   ```bash
   python manage.py collectstatic
   python manage.py migrate
   ```

### Frontend Deployment
```bash
cd frontend
npm run build
```
The built files will be in `frontend/dist/` ready for deployment.

## 📝 Environment Variables

### Backend (.env file)
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (.env file)
```
VITE_API_URL=http://localhost:8000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@onlineshop.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Payment integration (Stripe/PayPal)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Search and filtering
- [ ] Mobile app (React Native)

---

**Built with ❤️ by the Online Shop Team**
