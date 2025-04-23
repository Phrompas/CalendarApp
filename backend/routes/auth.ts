import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

router.post('/register', async (req: Request, res: Response)=> {
  const { email, password } = req.body;

  try {
    const [user]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if ((user as any[]).length > 0) {
        res.status(400).json({ error: 'Email already exists' });
        return;
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req: Request, res: Response)=> {
  const { email, password } = req.body;

  try {
    const [user]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if ((user as any[]).length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const match = await bcrypt.compare(password, user[0].password);
    if (!match) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user[0].id }, SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
