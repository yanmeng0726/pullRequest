import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import * as routes from '../routes';
import { calculateLastDayOfMonth } from '../services/monthService';

let app: express.Application;
beforeEach(async () => {
  dotenv.config();
  app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  routes.register(app);
});

describe('caclculate first date and last date of a month', () => {
  it('should return start date (1st) and end date (31st) if given month has 31 days', () => {
    const [startDate, endDate] = calculateLastDayOfMonth('2020-12');
    expect(startDate).toBe('2020-12-01');
    expect(endDate).toBe('2020-12-31');
  });

  it('should return start date (1st) and end date (30th) if given month has 30 days', () => {
    const [startDate, endDate] = calculateLastDayOfMonth('2021-09');
    expect(startDate).toBe('2021-09-01');
    expect(endDate).toBe('2021-09-30');
  });

  it('should return start date (1st) and end date (28th) if given month has 28 days', () => {
    const [startDate, endDate] = calculateLastDayOfMonth('2023-02');
    expect(startDate).toBe('2023-02-01');
    expect(endDate).toBe('2023-02-28');
  });

  it('should return start date (1st) and end date (29th) if given month has 29 days', () => {
    const [startDate, endDate] = calculateLastDayOfMonth('2020-02');
    expect(startDate).toBe('2020-02-01');
    expect(endDate).toBe('2020-02-29');
  });
});
