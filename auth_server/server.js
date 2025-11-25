import express from 'express';
import bcrypt from 'bcryptjs';
import { Client as pgclient } from "pg";

const app = express();
app.use(express.json());

/*
User shape:

CREATE TABLE auth_users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

User profile shape:

CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth_users(user_id) ON DELETE CASCADE,
  name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  status_text TEXT,
  preferences JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);
*/

const insertUser = async (user) => {
    const result = await pgClient.query(
        "INSERT INTO auth_users (email, password_hash, last_login) VALUES ($1, $2, NOW()) RETURNING user_id",
        [user.email, user.password_hash]
    );

    const user_id = result.rows[0].user_id;
    console.log(user_id);

    const result2 = await pgClient.query(
        "INSERT INTO profiles (user_id, name, display_name, avatar_url, status_text, preferences) VALUES ($1, $2, $3, 'no_url', 'no_status', '{}'::jsonb) RETURNING user_id",
        [user_id, user.name, user.name]
    );
    console.log(result2.rows);
    return result2.rows[0].user_id;
}

const findUser = async (email) => {
    const result = await pgClient.query(
        "SELECT user_id, email, password_hash FROM auth_users WHERE email = $1",
        [email]
    );
    console.log(result.rows);
    return result.rows[0];
}

/* Signup: create user if email not used */
app.post('/signup', async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'email, name and password are required' });
  }

  const lowerEmail = String(email).toLowerCase();
  const existingUser = await findUser(lowerEmail);
  if (existingUser) {
    return res.status(409).json({ error: 'email already registered' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const user = { user_id:"", name, email: lowerEmail, password_hash: passwordHash, last_login: Date.now()};
  const user_id = await insertUser(user);
  // Return minimal user info (no password)
  res.status(201).json({user_id});
});

/* Login: validate credentials */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const lowerEmail = String(email).toLowerCase();
  const user = await findUser(lowerEmail);

  if (!user) {
    return res.status(404).json({ error: 'user not found' });
  }

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  // Minimal response: user id and basic info. In real apps return a session/JWT.
  res.json({ id: user.user_id, email: user.email, name: user.name });
});

/* Simple health check */
app.get('/', (req, res) => res.send('auth server running'));


/* Start */
// Start the postgres client connection first
const pgClient = new pgclient({
  connectionString: "postgres://admin:p\@ssw0rd@host.docker.internal:5433/users",
});

await pgClient.connect();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth server listening on http://localhost:${PORT}`));
