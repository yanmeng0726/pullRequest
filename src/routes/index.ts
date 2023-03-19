import * as express from 'express';
import { Octokit } from '@octokit/rest';
import { PullResponse } from '../interfaces/types';
import calculateLastDayOfMonth from '../services/monthService';
import validateDate from '../utils/validateDate';

export const register = (app: express.Application) => {
  app.get('/pr', async (req: any, res) => {
    try {
      const date = req.query.month;

      if (!validateDate(date)) {
        return res.status(400).send({ error: 'Invalid month' });
      }

      const [startDate, endDate] = calculateLastDayOfMonth(date);

      const token: string = process.env.TOKEN;
      const octokit: Octokit = new Octokit({
        auth: `${token}`
      });

      const openPrs = await octokit.rest.search.issuesAndPullRequests({
        q: `type:pr+repo:${process.env.OWNER}/${process.env.REPO}+created:${startDate}..${endDate}`
      });

      const closePrs = await octokit.rest.search.issuesAndPullRequests({
        q: `type:pr+repo:${process.env.OWNER}/${process.env.REPO}+closed:${startDate}..${endDate}`
      });

      const result: PullResponse = {
        open: openPrs.data.total_count,
        close: closePrs.data.total_count
      };

      res.status(200).send(result);
    } catch (error) {
      switch (Number(error.status)) {
        case 401:
          res.status(401).json({ message: `Unauthorized Error` });
          break;
        default:
          res.status(500).json({ message: 'Internal Error' });
      }
    }
  });
};
