const request = require('supertest');
const express = require('express');

// Setting up a dummy express app to test routes independently
const app = express();
app.use(express.json());

// A simple mock for testing supertest is working
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

describe('Basic Application Tests', () => {
  it('should return 200 OK for health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
