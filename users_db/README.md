1. docker compose up -d
2. Check container logs: 
docker logs -f users_db
3. Connect to the DB using psql
psql -h localhost -U admin -d users
4. Run psql inside container (if you don't have psql locally)
docker exec -it users_db psql -U admin -d users
5. docker compose down
6. Create tables:

CREATE TABLE auth_users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth_users(user_id) ON DELETE CASCADE,
  name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  status_text TEXT,
  preferences JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

7. INSERT INTO auth_users (email, password_hash, last_login)
VALUES ('bob@example.com', 'hashed_password_here', NOW())
RETURNING user_id;

Insert with UTC timestamp:

INSERT INTO auth_users (email, password_hash, last_login)
VALUES (
  'bob@example.com',
  'hashed_password_here',
  NOW() AT TIME ZONE 'UTC'
)
RETURNING user_id;

update last_login on login:

UPDATE auth_users
SET last_login = NOW()
WHERE email = 'bob@example.com'
RETURNING user_id, email, last_login;

8. Get the user_id returned by above and use that to insert profile
INSERT INTO profiles (user_id, name, display_name, avatar_url, status_text, preferences)
VALUES (
  'd1ffdb6b-6fb4-4dca-bdb7-3f9d2a8fd006',
  'Bob',
  'bobby',
  'https://example.com/bob.png',
  'Feeling good!',
  '{"language": "en"}'::jsonb
);


