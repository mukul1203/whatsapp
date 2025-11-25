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



