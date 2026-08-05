# OmniKart 🛒

A full-stack ecommerce web application built with the MERN stack. OmniKart allows users to browse products, manage their cart, place orders, and track deliveries. Admins can manage products, orders, and view store statistics.

## 🔗 Live Demo

- **Live:** [https://omnikart-nine.vercel.app](https://omnikart-nine.vercel.app)
- **Github:** [https://github.com/kumarhitesh1/OmniKart.git](https://github.com/kumarhitesh1/OmniKart.git)

## ⚙️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| React Router DOM | Client-side Routing |
| Tailwind CSS | Styling |
| Axios | API Calls |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| JS Cookie | JWT Token Storage |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Cloudinary | Image Storage |
| Brevo | Email Service (OTP + Order Confirmation) |
| Multer | File Uploads |
| Groq AI | AI Chat Assistant |

## ✨ Features

### User Features
- 🔐 OTP-based email login (no password required)
- 🛍️ Browse products with search, filter by category, sort by price, pagination
- 📦 Product detail page with image zoom and thumbnail gallery
- 🛒 Cart management — add, remove, update quantity
- 📍 Checkout with address management
- 💳 Cash on Delivery (COD) payment
- 📋 Order history and order detail page
- 📧 Order confirmation email
- 🤖 AI chat assistant — product recommendations, order tracking, store FAQ

### Admin Features
- 📦 Product management — add, edit, update stock
- 🛍️ Order management — view all orders, update status
- 📊 Store statistics — order status breakdown, payment methods, products sold chart

### Technical Features
- 🔄 Optimistic UI updates
- ⚡ Debounced search
- 🗂️ Product caching with useRef
- 📱 Fully responsive — mobile, tablet, desktop
- 🔒 Protected routes
- 🌐 Context API for global state management
- 🔁 Scroll to top on route change

## 📁 Project Structure

```
OmniKart/
├── frontend/                   # React frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── logo.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminOrders.jsx
│   │   │   │   ├── AdminProducts.jsx
│   │   │   │   └── AdminStats.jsx
│   │   │   ├── ChatAssistant.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── context/
│   │   │   ├── CartContext.jsx
│   │   │   ├── ProductContext.jsx
│   │   │   └── UserContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── OrderPage.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── Products.jsx
│   │   │   └── Verify.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vercel.json
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                     # Node.js backend
    ├── controller/
    │   ├── address.js
    │   ├── cart.js
    │   ├── chat.js
    │   ├── order.js
    │   ├── product.js
    │   └── user.js
    ├── middlewares/
    │   ├── isAuth.js
    │   └── multer.js
    ├── models/
    │   ├── address.js
    │   ├── cart.js
    │   ├── order.js
    │   ├── otp.js
    │   ├── product.js
    │   └── user.js
    ├── routes/
    │   ├── address.js
    │   ├── cart.js
    │   ├── chat.js
    │   ├── order.js
    │   ├── product.js
    │   └── user.js
    ├── utils/
    │   ├── bufferGenerator.js
    │   ├── connection.js
    │   ├── sendOrderConfirmation.js
    │   ├── sendOtp.js
    │   └── tryCatch.js
    ├── index.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Brevo account
- Groq account

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/kumarhitesh1/OmniKart.git

# Go to server folder
cd OmniKart/server

# Install dependencies
npm install

# Create .env file
touch .env
```

Add these to your `server/.env`:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SEC=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

```bash
# Start the server
npm start
```

### Frontend Setup

```bash
# Go to frontend folder
cd OmniKart/frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add this to your `frontend/.env`:

```env
VITE_SERVER_URL=http://localhost:5000
```

```bash
# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/user/login` | Send OTP to email |
| POST | `/api/user/verify` | Verify OTP and login |
| GET | `/api/user/me` | Get logged in user |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/product/all` | Get all products (with filters) |
| GET | `/api/product/:id` | Get single product |
| POST | `/api/product/new` | Create product (admin) |
| PUT | `/api/product/:id` | Update product (admin) |
| POST | `/api/product/:id` | Update product images (admin) |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart/all` | Get user cart |
| POST | `/api/cart/add` | Add to cart |
| POST | `/api/cart/update` | Update quantity |
| GET | `/api/cart/remove/:id` | Remove from cart |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/order/new/cod` | Place COD order |
| GET | `/api/order/all` | Get user orders |
| GET | `/api/order/:id` | Get single order |
| GET | `/api/order/admin/all` | Get all orders (admin) |
| POST | `/api/order/:id` | Update order status (admin) |
| GET | `/api/stats` | Get store stats (admin) |

### Address
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/address/new` | Add address |
| GET | `/api/address/all` | Get all addresses |
| GET | `/api/address/:id` | Get single address |
| DELETE | `/api/address/:id` | Delete address |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send message to AI assistant |

## 🤖 AI Chat Assistant

OmniKart includes a floating AI chat assistant powered by **Groq (LLaMA 3.3 70B)**:

- Quick action buttons on start — Browse Products, My Orders, My Cart
- Product recommendations based on budget, category, or preferences using real catalog data
- Order tracking — shows real order status for logged-in users
- Store FAQ — answers questions about login, payment, and how to order
- New conversation button to reset chat
- Conversation resets automatically on logout

## 🚢 Deployment

- **Frontend** deployed on [Vercel](https://vercel.com)
- **Backend** deployed on [Render](https://render.com)
- **Database** hosted on [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Images** stored on [Cloudinary](https://cloudinary.com)
- **Emails** sent via [Brevo](https://brevo.com)
- **AI** powered by [Groq](https://groq.com)

## 👨‍💻 Author

**Hitesh Kumar**
- GitHub: [@kumarhitesh1](https://github.com/kumarhitesh1)

## 📄 License

This project is for portfolio and educational purposes only.
Commercial use is not permitted without explicit permission.
