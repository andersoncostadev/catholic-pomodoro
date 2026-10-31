CREATE TABLE IF NOT EXISTS week_total (
  id TEXT NOT NULL,
  week_start TEXT NOT NULL,
  name TEXT NOT NULL,
  seconds INTEGER NOT NULL,
  PRIMARY KEY (id, week_start)
);

CREATE INDEX IF NOT EXISTS week_total_week_seconds ON week_total (week_start, seconds);

CREATE TABLE IF NOT EXISTS day_total (
  id TEXT NOT NULL,
  day TEXT NOT NULL,
  seconds INTEGER NOT NULL,
  PRIMARY KEY (id, day)
);

CREATE TABLE IF NOT EXISTS hour_post (
  id TEXT NOT NULL,
  hour_key TEXT NOT NULL,
  posts INTEGER NOT NULL,
  PRIMARY KEY (id, hour_key)
);
