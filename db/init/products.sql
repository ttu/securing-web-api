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
