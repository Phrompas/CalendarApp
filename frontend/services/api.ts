const API_URL = 'http://10.0.2.2:3000';

export async function register(email: string, password: string) {
  const res = await fetch(`http://10.0.2.2:3000/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`http://10.0.2.2:3000/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
