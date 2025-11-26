CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT,
  provider VARCHAR(20) NOT NULL DEFAULT 'local',
  google_uid VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'CONSUMER',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  poster_url TEXT,
  promoter_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
