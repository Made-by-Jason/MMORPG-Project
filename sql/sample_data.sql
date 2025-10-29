INSERT INTO users (username, password_hash) VALUES ('testuser', 'password-hash-placeholder');
INSERT INTO characters (user_id, name, class, level, x, y) 
  VALUES ((SELECT id FROM users WHERE username='testuser'), 'Arix', 'Ironbound Guard', 1, 100, 100);

-- sample items
INSERT INTO items (name, rarity, type, power) VALUES
('Rusty Blade', 'common', 'weapon', 3),
('Healing Tonic', 'common', 'consumable', 0),
('Iron Targe', 'rare', 'armor', 6);
