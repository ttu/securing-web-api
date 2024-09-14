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


-- Create x number of products, each with a total of 9 prices.

INSERT INTO products (id, name, manufacturer)
SELECT 
    gs AS id, 
    'Product ' || gs AS name, 
    'Manufacturer ' || ((gs % 5) + 1) AS manufacturer
FROM generate_series(1, 10000) AS gs;

-- Create 3 prices per product, one for each of the US, DE, and UK
INSERT INTO product_prices (productId, price, country, startDate)
SELECT 
    gs.id,
    CASE 
        WHEN gs.country = 'US' THEN 999 - (gs.id % 3) * 50
        WHEN gs.country = 'DE' THEN 1099 - (gs.id % 3) * 50
        WHEN gs.country = 'UK' THEN 1099 - (gs.id % 3) * 50
    END AS price,
    gs.country,
    NOW() - INTERVAL '1 YEAR' + (gs.time_offset * INTERVAL '6 MONTHS')
FROM (
    SELECT 
        p.id,
        gs2 AS time_offset,
        country
    FROM 
        (SELECT id FROM products LIMIT 100000000) AS p,
        generate_series(0, 2) AS gs2,
        (VALUES ('US'), ('DE'), ('UK')) AS countries(country)
) gs;