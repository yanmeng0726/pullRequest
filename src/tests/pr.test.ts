import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import * as routes from '../routes';
import request from 'supertest';

let app: express.Application;
beforeEach(async () => {
  dotenv.config();
  app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  routes.register(app);
});

describe('GET /pr', () => {
  it('should return forbidden error if no token is setting', async () => {
    let res = await request(app).get('/pr?month=2022');
    expect(res.statusCode).toBe(403);
  });
  it('should return pull request open and close on that month', async () => {
    let res = await request(app)
      .get('/pr?month=2020-02')
      .set('Authorization', `${process.env.TOKEN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.open).toBe(16);
    expect(res.body.close).toBe(17);

    res = await request(app)
      .get('/pr?month=2023-01')
      .set('Authorization', `${process.env.TOKEN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.close).toBe(7);
    expect(res.body.open).toBe(7);

    res = await request(app)
      .get('/pr?month=2022-12')
      .set('Authorization', `${process.env.TOKEN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.close).toBe(9);
    expect(res.body.open).toBe(2);

    res = await request(app)
      .get('/pr?month=2023-02')
      .set('Authorization', `${process.env.TOKEN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.close).toBe(2);
    expect(res.body.open).toBe(5);

    res = await request(app)
      .get('/pr?month=2000-02')
      .set('Authorization', `${process.env.TOKEN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.close).toBe(0);
    expect(res.body.open).toBe(0);
  });

  it('should return bad request error if month format is not correct', async () => {
    let res = await request(app)
      .get('/pr?month=2022')
      .set('Authorization', `${process.env.TOKEN}`);
    expect(res.statusCode).toBe(400);
    res = await request(app)
      .get('/pr')
      .set('Authorization', `${process.env.TOKEN}`);
    expect(res.statusCode).toBe(400);
    res = await request(app)
      .get('/pr?month=2022=1')
      .set('Authorization', `${process.env.TOKEN}`);
    expect(res.statusCode).toBe(400);
  });

  it('should return internal error', async () => {
    const repo = process.env.REPO;
    process.env.REPO = 'invalid repo';
    const res = await request(app)
      .get('/pr?month=2022-01')
      .set('Authorization', `${process.env.TOKEN}`);
    expect(res.statusCode).toBe(500);
    process.env.REPO = repo;
  });

  it('should return unauthorized error', async () => {
    const token = process.env.TOKEN;
    process.env.TOKEN = 'invalid token';
    const res = await request(app)
      .get('/pr?month=2022-01')
      .set('Authorization', `${process.env.TOKEN}`);
    expect(res.statusCode).toBe(401);
    process.env.TOKEN = token;
  });
});
