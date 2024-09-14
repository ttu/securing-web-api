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
