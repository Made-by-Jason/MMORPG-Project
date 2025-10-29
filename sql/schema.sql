-- PostgreSQL schema for ArcadeMMO
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  class TEXT,
  level INTEGER DEFAULT 1,
  x DOUBLE PRECISION DEFAULT 0,
  y DOUBLE PRECISION DEFAULT 0,
  hp INTEGER DEFAULT 100,
  mp INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  rarity TEXT NOT NULL,
  type TEXT NOT NULL,
  power INTEGER DEFAULT 0,
  bind_on_pickup BOOLEAN DEFAULT false
);

CREATE TABLE inventories (
  char_id UUID REFERENCES characters(id),
  item_id INTEGER REFERENCES items(id),
  qty INTEGER DEFAULT 1,
  PRIMARY KEY (char_id, item_id)
);

CREATE TABLE chat_logs (
  id SERIAL PRIMARY KEY,
  channel TEXT,
  sender_id UUID,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_char_position ON characters (x, y);
