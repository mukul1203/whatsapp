import express from 'express';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());

/* In-memory store */
const usersByEmail = new Map(); // email -> user
let nextUserId = 1;

/*
User shape:
{
  id: number,
  email: string,
  name: string,
  passwordHash: string
}
*/

/* Signup: create user if email not used */
app.post('/signup', (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'email, name and password are required' });
  }

  const lowerEmail = String(email).toLowerCase();

  if (usersByEmail.has(lowerEmail)) {
    return res.status(409).json({ error: 'email already registered' });
  }

  const id = nextUserId++;
  const passwordHash = bcrypt.hashSync(password, 10);

  const user = { id, email: lowerEmail, name: String(name), passwordHash };
  usersByEmail.set(lowerEmail, user);

  // Return minimal user info (no password)
  res.status(201).json({ id, email: lowerEmail, name: user.name });
});

/* Login: validate credentials */
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const lowerEmail = String(email).toLowerCase();
  const user = usersByEmail.get(lowerEmail);

  if (!user) {
    return res.status(404).json({ error: 'user not found' });
  }

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  // Minimal response: user id and basic info. In real apps return a session/JWT.
  res.json({ id: user.id, email: user.email, name: user.name });
});

/* Simple health check */
app.get('/', (req, res) => res.send('auth server running'));

/* Start */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth server listening on http://localhost:${PORT}`));
