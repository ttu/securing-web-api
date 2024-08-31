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
(1, 'iPhone X', 'Apple'),
(2, 'Samsung S11', 'Samsung'),
(3, 'OnePlus 4', 'OnePlus'),
(4, 'Google Pixel 5', 'Google'),
(5, 'Xiaomi Redmi Note 6', 'Xiaomi');

SELECT setval(pg_get_serial_sequence('products', 'id'), max(id)) FROM products;

INSERT INTO product_prices (productId, price, country, startDate) VALUES
(1, 999, 'US', NOW()),
(2, 899, 'US', NOW()),
(3, 699, 'US', NOW()),
(4, 799, 'US', NOW()),
(5, 499, 'US', NOW());