import express from 'express';
import pool from '../db';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/', verifyToken, async (req: AuthRequest, res) => {
  const { date } = req.query;

  try {
    let rows;
    if (date) {
      const dayStart = `${date} 00:00:00`;
      const dayEnd = `${date} 23:59:59`;

      [rows] = await pool.query(
        'SELECT * FROM events WHERE userId = ? AND startTime BETWEEN ? AND ?',
        [req.userId, dayStart, dayEnd]
      );
    } else {
      [rows] = await pool.query(
        'SELECT * FROM events WHERE userId = ?',
        [req.userId]
      );
    }

    res.json(rows);
  } catch (err) {
    console.error('Fetch events failed:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.post('/', verifyToken, async (req: AuthRequest, res) => {
  const { title, description, startTime, endTime } = req.body;

  if (!title || !startTime || !endTime) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    await pool.query(
      'INSERT INTO events (title, description, startTime, endTime, userId) VALUES (?, ?, ?, ?, ?)',
      [title, description, startTime, endTime, req.userId]
    );
    res.status(201).json({ message: 'Event added' });
  } catch (err) {
    console.error('Create event failed:', err);
    res.status(500).json({ error: 'Failed to add event' });
  }
});

router.put('/:id', verifyToken, async (req: AuthRequest, res): Promise<void> => {
  const { id } = req.params;
  const { title, description, startTime, endTime } = req.body;

  if (!title || !startTime || !endTime) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const [result] = await pool.query(
      'UPDATE events SET title = ?, description = ?, startTime = ?, endTime = ? WHERE id = ? AND userId = ?',
      [title, description, startTime, endTime, id, req.userId]
    );

    const update = result as any;
    if (update.affectedRows === 0) {
      res.status(404).json({ error: 'Event not found or unauthorized' });
      return;
    }

    res.json({ message: 'Event updated successfully' });
  } catch (err) {
    console.error('Update event failed:', err);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

router.delete('/:id', verifyToken, async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM events WHERE id = ? AND userId = ?',
      [id, req.userId]
    );

    const deleted = result as any;
    if (deleted.affectedRows === 0) {
      res.status(404).json({ error: 'Event not found or unauthorized' });
      return;
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete event failed:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
