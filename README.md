# Nature Roots Milk - Vendor & Customer Management System

A comprehensive full-stack application for managing milk vendors, customers, and subscriptions with analytics and reporting features.

## 📋 Project Overview

This system manages:
- **Vendors** - Dairy farms and milk suppliers with location data
- **Customers** - Individual consumers with subscription management
- **Subscriptions** - Monthly milk delivery subscriptions with quantity tracking
- **Analytics** - Vendor performance, customer deactivation tracking, revenue reporting

## 🏗️ Project Structure

```
.
├── backend/
│   ├── server.js              # Express server entry point
│   ├── package.json           # Node.js dependencies
│   ├── .env.example           # Environment variables template
│   ├── db/
│   │   └── connection.js      # PostgreSQL connection config
│   └── routes/
│       ├── vendors.js         # Vendor CRUD operations
│       ├── customers.js       # Customer registration & management
│       ├── subscriptions.js   # Subscription management
│       └── reports.js         # Analytics and reporting
├── database/
│   └── schema.sql             # PostgreSQL database schema
├── frontend/
│   ├── mobile/
│   │   └── flutter_app/       # Flutter mobile app
│   └── admin/
│       └── package.json       # React admin dashboard
└── README.md
```

## 🚀 Getting Started

### Backend Setup

1. **Install Node.js dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Setup PostgreSQL Database**
   ```bash
   # Create database
   createdb nature_roots_milk
   
   # Load schema
   psql nature_roots_milk < ../database/schema.sql
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

## 📡 API Endpoints

### Vendors
- `GET /api/vendors` - List all vendors with customer counts
- `GET /api/vendors/:id` - Get vendor details with customers
- `GET /api/vendors/location/:city` - Filter vendors by city
- `POST /api/vendors` - Create new vendor
- `PUT /api/vendors/:id` - Update vendor

### Customers (Registration & Management)
- `POST /api/customers/register` - **Register new customer** with basic details
- `GET /api/customers` - List active customers
- `GET /api/customers/:id` - Get customer profile with subscriptions
- `GET /api/customers/vendor/:vendor_id` - Get vendor's customers
- `PUT /api/customers/:id` - Update customer information
- `PUT /api/customers/:id/deactivate` - Deactivate customer
- `PUT /api/customers/:id/reactivate` - Reactivate customer

### Subscriptions
- `POST /api/subscriptions` - Create monthly subscription
- `GET /api/subscriptions` - List active subscriptions
- `GET /api/subscriptions/:id` - Get subscription details
- `GET /api/subscriptions/customer/:customer_id` - Get customer subscriptions
- `PUT /api/subscriptions/:id` - Update subscription
- `PUT /api/subscriptions/:id/cancel` - Cancel subscription

### Reports & Analytics
- `GET /api/reports/deactivated/last-month` - **Customers deactivated in last 30 days**
- `GET /api/reports/subscriptions/monthly-range?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - **Subscriptions within date range with quantities**
- `GET /api/reports/vendor/summary/:vendor_id` - Vendor performance metrics
- `GET /api/reports/analytics/all-vendors` - Compare all vendor performance
- `GET /api/reports/customer/:customer_id/details` - Customer full profile

## 💾 Database Schema

### Vendors Table
```sql
- id (PRIMARY KEY)
- name, email (UNIQUE), phone
- address, city, state, postal_code
- latitude, longitude (GPS coordinates)
- created_at, updated_at
```

### Customers Table
```sql
- id (PRIMARY KEY)
- vendor_id (FOREIGN KEY)
- name, email (UNIQUE), phone
- address, city
- latitude, longitude (Location coordinates)
- status (active/inactive/deactivated)
- deactivated_at (Timestamp)
- created_at, updated_at
```

### Subscriptions Table
```sql
- id (PRIMARY KEY)
- customer_id (FOREIGN KEY)
- subscription_type, quantity
- monthly_cost
- start_date, end_date
- status (active/paused/cancelled)
- created_at, updated_at
```

## 🎯 Key Features

✅ **Customer Registration** - Collect basic details (name, email, phone, address, location)  
✅ **Vendor Directory** - Display vendors with addresses, locations, and customer count  
✅ **Monthly Subscriptions** - Track subscription types, quantities, and costs  
✅ **Deactivation Tracking** - Monitor customers deactivated in last 30 days  
✅ **Monthly Reports** - Filter subscriptions by date range with quantity totals  
✅ **Vendor Analytics** - Revenue, active customers, subscription metrics  
✅ **Performance Metrics** - Compare vendors by revenue and customer count  

## 📱 Frontend Integration

### Flutter Mobile App
- Customer registration form
- Browse vendor list with maps
- Manage subscriptions
- View order history

### React Admin Dashboard
- Vendor management interface
- Customer administration
- Subscription tracking
- Analytics dashboards with charts
- Deactivation reports
- Revenue reporting

## 🔍 Example Usage

### Register a Customer
```bash
curl -X POST http://localhost:5000/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "vendor_id": 1,
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "9876543210",
    "address": "123 Main Street",
    "city": "Bangalore",
    "latitude": 12.9716,
    "longitude": 77.5946
  }'
```

### Get Customers Deactivated Last Month
```bash
curl http://localhost:5000/api/reports/deactivated/last-month
```

### Get Subscriptions in Date Range
```bash
curl "http://localhost:5000/api/reports/subscriptions/monthly-range?start_date=2024-01-01&end_date=2024-12-31"
```

## 📊 Database Indexes

Optimized indexes for performance:
- Vendors by city and email
- Customers by vendor, email, status, and deactivation date
- Subscriptions by customer, status, and date range

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Frontend**: React.js (Admin Dashboard), Flutter (Mobile App)
- **API**: RESTful API with JSON responses
- **Authentication**: Ready for JWT implementation

## 📝 Environment Variables

Create `.env` file with:
```
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nature_roots_milk
NODE_ENV=development
```

## 📄 License

MIT

## 👥 Contributing

Contributions welcome! Please submit pull requests or create issues.

---

**Version**: 1.0.0  
**Last Updated**: 2024
