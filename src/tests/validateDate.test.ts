import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import * as routes from '../routes';
import validateDate from '../utils/validateDate';

let app: express.Application;
beforeEach(async () => {
  dotenv.config();
  app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  routes.register(app);
});

describe('validate date ', () => {
  it('should return true if date format yyyy-mm', () => {
    const result = validateDate('2020-05');
    expect(result).toBe(true);
  });
  it('should return false if date format yyyy-m', () => {
    const result = validateDate('2020-5');
    expect(result).toBe(false);
  });

  it('should return false if date format yyyy-mm-dd', () => {
    const result = validateDate('2020-5-31');
    expect(result).toBe(false);
  });

  it('should return false if month is not valid', () => {
    const result = validateDate('2020-13');
    expect(result).toBe(false);
  });

  it('should return false if year is not valid', () => {
    const result = validateDate('3220-13');
    expect(result).toBe(false);
  });
});
