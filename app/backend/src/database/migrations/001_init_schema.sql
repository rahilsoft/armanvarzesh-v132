
-- Initial schema for ArmanVarzesh
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(128) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(128) NOT NULL,
  duration INTEGER,
  date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ... Other tables (nutrition, payments, wallet, marketplace, ...)
