CREATE TABLE IF NOT EXISTS polls (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  end_date DATE NOT NULL,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS poll_options (
  id SERIAL PRIMARY KEY,
  poll_id INTEGER NOT NULL REFERENCES polls(id),
  option_text TEXT NOT NULL,
  votes INTEGER DEFAULT 0
);

CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);

INSERT INTO polls (question, end_date, total_votes) VALUES 
  ('Должен ли камень иметь право голоса на всех уровнях власти?', '2025-12-20', 290),
  ('Приоритет в бюджете: памятники камням или социальные программы?', '2025-12-25', 534);

INSERT INTO poll_options (poll_id, option_text, votes) VALUES
  (1, 'Да, камень мудрее человека', 156),
  (1, 'Только на местном уровне', 89),
  (1, 'Нужно обсудить детали', 45),
  (2, 'Памятники камням', 234),
  (2, 'Социальные программы', 122),
  (2, 'Равное распределение', 178);