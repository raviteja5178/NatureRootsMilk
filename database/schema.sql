-- Create Vendors Table
CREATE TABLE vendors (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Customers Table
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deactivated')),
  deactivated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  subscription_type VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  monthly_cost DECIMAL(10, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_vendors_city ON vendors(city);
CREATE INDEX idx_vendors_email ON vendors(email);

CREATE INDEX idx_customers_vendor_id ON customers(vendor_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_deactivated_at ON customers(deactivated_at);
CREATE INDEX idx_customers_city ON customers(city);

CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_start_date ON subscriptions(start_date);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);

-- Insert Sample Data

-- Sample Vendors
INSERT INTO vendors (id, name, email, phone, address, city, state, postal_code, latitude, longitude)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Fresh Dairy Farms', 'fresh@dairy.com', '9876543210', '123 Dairy Lane', 'Bangalore', 'Karnataka', '560001', 12.9716, 77.5946),
  ('550e8400-e29b-41d4-a716-446655440002', 'Pure Milk Valley', 'pure@milk.com', '9876543211', '456 Valley Road', 'Pune', 'Maharashtra', '411001', 18.5204, 73.8567),
  ('550e8400-e29b-41d4-a716-446655440003', 'Golden Pastures', 'golden@pastures.com', '9876543212', '789 Pasture Way', 'Delhi', 'Delhi', '110001', 28.6139, 77.2090);

-- Sample Customers
INSERT INTO customers (id, vendor_id, name, email, phone, address, city, latitude, longitude, status, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'Rajesh Kumar', 'rajesh@example.com', '8765432109', '123 Main Street', 'Bangalore', 12.9352, 77.6245, 'active', NOW()),
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 'Priya Sharma', 'priya@example.com', '8765432108', '456 Oak Avenue', 'Bangalore', 12.9250, 77.6300, 'active', NOW()),
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440002', 'Amit Patel', 'amit@example.com', '8765432107', '789 Pine Street', 'Pune', 18.5305, 73.8500, 'deactivated', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
  ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440003', 'Sneha Gupta', 'sneha@example.com', '8765432106', '321 Elm Road', 'Delhi', 28.6200, 77.2100, 'active', NOW());

-- Sample Subscriptions
INSERT INTO subscriptions (id, customer_id, subscription_type, quantity, monthly_cost, start_date, end_date, status)
VALUES
  ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', 'Standard Milk', 2, 500.00, '2024-01-01', NULL, 'active'),
  ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440101', 'Premium Yogurt', 1, 300.00, '2024-02-01', NULL, 'active'),
  ('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440102', 'Standard Milk', 3, 500.00, '2024-01-15', NULL, 'active'),
  ('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440104', 'Deluxe Package', 2, 800.00, '2024-03-01', NULL, 'active');
