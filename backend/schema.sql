CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT,
  provider VARCHAR(20) NOT NULL DEFAULT 'local',
  google_uid VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'BUYER',
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

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_price NUMERIC(10, 2) NOT NULL,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  ticket_type VARCHAR(100) NOT NULL,
  ticket_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  checked_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tickets (
    id              BIGSERIAL PRIMARY KEY,
    event_id        BIGINT NOT NULL,
    type            VARCHAR(100) NOT NULL,
    price           NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    quantity        INTEGER NOT NULL CHECK (quantity >= 0),
    sale_start_date TIMESTAMPTZ,
    sale_end_date   TIMESTAMPTZ,

    -- Relasi ke tabel events
    CONSTRAINT fk_tickets_event
        FOREIGN KEY (event_id)
        REFERENCES events (id)
        ON DELETE CASCADE,

    -- Opsional tapi seharusnya kamu punya ini dari awal
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger untuk jaga updated_at tetap konsisten (opsional tapi sehat)
CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_on_tickets
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION set_timestamp();
