-- Create user for replication
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'replicator_password';
SELECT pg_create_physical_replication_slot('replication_slot');

-- Create the 'messages' table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,  -- Automatically generated unique identifier
    message TEXT NOT NULL,   -- The message content
    sender VARCHAR(100) NOT NULL,  -- The sender of the message
    timestamp BIGINT NOT NULL,  -- The timestamp when the message was sent, using BIGINT to store the epoch time
    ip VARCHAR(45) NOT NULL  -- The IP address of the sender, supports both IPv4 and IPv6
);

-- Insert seed data into the 'messages' table
INSERT INTO messages (message, sender, timestamp, ip) VALUES
('Hello, world!', 'Alice', 1628090400000, '192.168.1.1'),
('This is a test message.', 'Bob', 1628090460000, '10.0.0.2'),
('Another example message.', 'Charlie', 1628090520000, '192.168.1.2'),
('Yet another message.', 'Dave', 1628090580000, '10.0.0.3');


CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,      -- Auto-incremented primary key
    name VARCHAR(255) NOT NULL, -- Product name, non-nullable
    manufacturer VARCHAR(255)   -- Manufacturer name, non-nullable
);

CREATE TABLE product_prices (
    id SERIAL PRIMARY KEY,          -- Auto-incremented primary key for the ProductPrice table
    productId INT NOT NULL,         -- Foreign key reference to the Product table
    price DECIMAL(10, 2) NOT NULL,  -- Price with two decimal places, non-nullable
    country VARCHAR(2) NOT NULL,    -- Country code (e.g., 'US'), non-nullable
    startDate TIMESTAMP NOT NULL,   -- Start date for the price, non-nullable
    FOREIGN KEY (productId) REFERENCES products(id) -- Foreign key constraint
);

INSERT INTO products (id, name, manufacturer) VALUES
(1, 'iPhone 11', 'Apple'),
(2, 'Samsung S21', 'Samsung'),
(3, 'OnePlus 7', 'OnePlus'),
(4, 'Google Pixel 6', 'Google'),
(5, 'Xiaomi Mi 11', 'Xiaomi'),
(6, 'iPhone 12', 'Apple'),
(7, 'Samsung S21 Ultra', 'Samsung'),
(8, 'OnePlus 8', 'OnePlus'),
(9, 'Google Pixel 6 Pro', 'Google'),
(10, 'Xiaomi Redmi Note 10', 'Xiaomi'),
(11, 'iPhone X', 'Apple'),
(12, 'Samsung S11', 'Samsung'),
(13, 'OnePlus 4', 'OnePlus'),
(14, 'Google Pixel 5', 'Google'),
(15, 'Xiaomi Redmi Note 6', 'Xiaomi');

SELECT setval(pg_get_serial_sequence('products', 'id'), max(id)) FROM products;

INSERT INTO product_prices (productId, price, country, startDate) VALUES
(1, 999, 'US', NOW() - INTERVAL '1 YEAR'),
(1, 950, 'US', NOW() - INTERVAL '6 MONTHS'),
(1, 899, 'US', NOW()),
(2, 899, 'US', NOW() - INTERVAL '1 YEAR'),
(2, 850, 'US', NOW() - INTERVAL '6 MONTHS'),
(2, 800, 'US', NOW()),
(3, 699, 'US', NOW() - INTERVAL '1 YEAR'),
(3, 650, 'US', NOW() - INTERVAL '6 MONTHS'),
(3, 600, 'US', NOW()),
(4, 799, 'US', NOW() - INTERVAL '1 YEAR'),
(4, 750, 'US', NOW() - INTERVAL '6 MONTHS'),
(4, 700, 'US', NOW()),
(5, 499, 'US', NOW() - INTERVAL '1 YEAR'),
(5, 450, 'US', NOW() - INTERVAL '6 MONTHS'),
(5, 400, 'US', NOW()),
(6, 1099, 'US', NOW()),
(7, 1199, 'US', NOW()),
(8, 899, 'US', NOW()),
(9, 999, 'US', NOW()),
(10, 799, 'US', NOW()),
(11, 1199, 'US', NOW()),
(12, 1299, 'US', NOW()),
(13, 999, 'US', NOW()),
(14, 1099, 'US', NOW()),
(15, 599, 'US', NOW()),

(1, 1099, 'DE', NOW() - INTERVAL '1 YEAR'),
(1, 1050, 'DE', NOW() - INTERVAL '6 MONTHS'),
(1, 999, 'DE', NOW()),
(2, 999, 'DE', NOW() - INTERVAL '1 YEAR'),
(2, 950, 'DE', NOW() - INTERVAL '6 MONTHS'),
(2, 899, 'DE', NOW()),
(3, 799, 'DE', NOW() - INTERVAL '1 YEAR'),
(3, 750, 'DE', NOW() - INTERVAL '6 MONTHS'),
(3, 700, 'DE', NOW()),
(4, 899, 'DE', NOW() - INTERVAL '1 YEAR'),
(4, 850, 'DE', NOW() - INTERVAL '6 MONTHS'),
(4, 800, 'DE', NOW()),
(5, 599, 'DE', NOW() - INTERVAL '1 YEAR'),
(5, 550, 'DE', NOW() - INTERVAL '6 MONTHS'),
(5, 500, 'DE', NOW()),
(6, 1099, 'DE', NOW()),
(7, 1199, 'DE', NOW()),
(8, 899, 'DE', NOW()),
(9, 999, 'DE', NOW()),
(10, 799, 'DE', NOW()),
(11, 1199, 'DE', NOW()),
(12, 1299, 'DE', NOW()),
(13, 999, 'DE', NOW()),
(14, 1099, 'DE', NOW()),
(15, 599, 'DE', NOW()),

(1, 1099, 'UK', NOW() - INTERVAL '1 YEAR'),
(1, 1050, 'UK', NOW() - INTERVAL '6 MONTHS'),
(1, 999, 'UK', NOW()),
(2, 999, 'UK', NOW() - INTERVAL '1 YEAR'),
(2, 950, 'UK', NOW() - INTERVAL '6 MONTHS'),
(2, 899, 'UK', NOW()),
(3, 799, 'UK', NOW() - INTERVAL '1 YEAR'),
(3, 750, 'UK', NOW() - INTERVAL '6 MONTHS'),
(3, 700, 'UK', NOW()),
(4, 899, 'UK', NOW() - INTERVAL '1 YEAR'),
(4, 850, 'UK', NOW() - INTERVAL '6 MONTHS'),
(4, 800, 'UK', NOW()),
(5, 599, 'UK', NOW() - INTERVAL '1 YEAR'),
(5, 550, 'UK', NOW() - INTERVAL '6 MONTHS'),
(5, 500, 'UK', NOW()),
(6, 1099, 'UK', NOW()),
(7, 1199, 'UK', NOW()),
(8, 899, 'UK', NOW()),
(9, 999, 'UK', NOW()),
(10, 799, 'UK', NOW()),
(11, 1199, 'UK', NOW()),
(12, 1299, 'UK', NOW()),
(13, 999, 'UK', NOW()),
(14, 1099, 'UK', NOW()),
(15, 599, 'UK', NOW());

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,           -- Auto-incremented primary key
    name VARCHAR(255) NOT NULL,      -- Customer name
    email VARCHAR(255) NOT NULL      -- Customer email
);

CREATE TABLE IF NOT EXISTS order_products (
    id SERIAL PRIMARY KEY,           -- Auto-incremented primary key
    name VARCHAR(255) NOT NULL,      -- Product name
    price DECIMAL(10, 2) NOT NULL,   -- Product price with two decimal places
    quantity INT NOT NULL            -- Product quantity
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,           -- Auto-incremented primary key
    total DECIMAL(10, 2) NOT NULL,   -- Total price of the order
    address TEXT NOT NULL,           -- Delivery address
    customerId INT NOT NULL,         -- Foreign key to the customers table
    orderDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date the order was placed
    FOREIGN KEY (customerId) REFERENCES customers(id)       -- Foreign key constraint
);

CREATE TABLE IF NOT EXISTS order_order_products (
    orderId INT NOT NULL,            -- Foreign key to the orders table
    productId INT NOT NULL,          -- Foreign key to the products table
    quantity INT NOT NULL,           -- Quantity of the product in the order
    PRIMARY KEY (orderId, productId),-- Composite primary key
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE, -- Foreign key constraint
    FOREIGN KEY (productId) REFERENCES order_products(id) ON DELETE CASCADE -- Foreign key constraint
);

INSERT INTO customers (id, name, email) VALUES
(1, 'John Doe', 'john.doe@us.com'),
(2, 'Hans Müller', 'hans.muller@de.com'),
(3, 'Jane Smith', 'jane.smith@uk.com'),
(4, 'Michael Bauer', 'michael.bauer@de.com'),
(5, 'Emily Brown', 'emily.brown@us.com'),
(6, 'Sarah Connor', 'sarah.connor@uk.com'),
(7, 'David White', 'david.white@us.com'),
(8, 'Clara Schmidt', 'clara.schmidt@de.com'),
(9, 'Robert Johnson', 'robert.johnson@uk.com'),
(10, 'Lisa Schwarz', 'lisa.schwarz@de.com');

SELECT setval(pg_get_serial_sequence('customers', 'id'), max(id)) FROM customers;

INSERT INTO orders (id, total, address, customerId, orderDate) VALUES
(1, 999.00, '123 Main St, Springfield, US', 1, NOW() - INTERVAL '3 DAY'),
(2, 1199.00, '456 Elm St, Springfield, US', 5, NOW() - INTERVAL '1 DAY'),
(3, 800.00, '789 Oak St, Springfield, US', 7, NOW()),
(4, 1099.00, '123 Berliner Str, Berlin, DE', 2, NOW() - INTERVAL '2 DAY'),
(5, 999.00, '456 Frankfurt Str, Frankfurt, DE', 4, NOW() - INTERVAL '1 DAY'),
(6, 1300.00, '789 Munich Str, Munich, DE', 8, NOW()),
(7, 1299.00, '123 London Rd, London, UK', 3, NOW() - INTERVAL '2 DAY'),
(8, 799.00, '456 Manchester Rd, Manchester, UK', 6, NOW() - INTERVAL '1 DAY'),
(9, 599.00, '789 Glasgow Rd, Glasgow, UK', 9, NOW());

SELECT setval(pg_get_serial_sequence('orders', 'id'), max(id)) FROM orders;

INSERT INTO order_products (id, name, price, quantity) VALUES
(1, 'iPhone X', 999.00, 100),
(2, 'Samsung S11', 899.00, 150),
(3, 'OnePlus 4', 699.00, 200),
(4, 'Google Pixel 5', 799.00, 120),
(5, 'Xiaomi Redmi Note 6', 499.00, 300),
(6, 'iPhone 11', 1099.00, 90),
(7, 'Samsung S21', 1199.00, 110),
(8, 'OnePlus 7', 899.00, 130),
(9, 'Google Pixel 6', 999.00, 140),
(10, 'Xiaomi Mi 11', 799.00, 160),
(11, 'iPhone 12', 1199.00, 80),
(12, 'Samsung S21 Ultra', 1299.00, 70),
(13, 'OnePlus 8', 999.00, 100),
(14, 'Google Pixel 6 Pro', 1099.00, 60),
(15, 'Xiaomi Redmi Note 10', 599.00, 250);

SELECT setval(pg_get_serial_sequence('order_products', 'id'), max(id)) FROM order_products;

INSERT INTO order_order_products (orderId, productId, quantity) VALUES
-- US orders
(1, 1, 1), -- iPhone X for John Doe, quantity 1
(2, 7, 2), -- Samsung S21 for Emily Brown, quantity 2
(3, 2, 3), -- Samsung S11 for David White, quantity 3

-- DE orders
(4, 6, 1), -- iPhone 11 for Hans Müller, quantity 1
(5, 9, 2), -- Google Pixel 6 for Michael Bauer, quantity 2
(6, 12, 3), -- Samsung S21 Ultra for Clara Schmidt, quantity 3

-- UK orders
(7, 11, 1), -- iPhone 12 for Jane Smith, quantity 1
(8, 10, 2), -- Xiaomi Mi 11 for Sarah Connor, quantity 2
(9, 15, 3); -- Xiaomi Redmi Note 10 for Robert Johnson, quantity 3
