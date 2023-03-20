import * as express from 'express';
import { Octokit } from '@octokit/rest';
import { PullResponse, PullResponseArrayObj } from '../interfaces/types';
import {
  calculateLastDayOfMonth,
  calculateNextMonth
} from '../services/monthService';
import validateDate from '../utils/validateDate';

export const register = (app: express.Application) => {
  /**
   * GET /pullRequestCount
   * @query month = YYYY-MM
   * @summary Get the number of open PRs and close PRs for a certain month
   * @return {object} 200 - success response - application/json
   */
  app.get('/pullRequestCount', async (req: any, res) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ error: 'No token sent!' });
      }
      const date = req.query.month;

      if (!validateDate(date)) {
        return res.status(400).send({ error: 'Invalid month' });
      }

      const [startDate, endDate] = calculateLastDayOfMonth(date);

      const token: string = req.headers.authorization;

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


  
  /**
   * GET /pullRequestCounts
   * @query startMonth = YYYY-MM endMonth = YYYY-MM
   * @summary Get the number of open PRs and close PRs for every month within a date range
   * @return {object} 200 - success response - application/json
   */
  app.get('/pullRequestCounts', async (req: any, res) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ error: 'No token sent!' });
      }

      const prArr: PullResponseArrayObj[] = [];
      const startMonth = req.query.startMonth;
      const endMonth = req.query.endMonth;
      const token: string = req.headers.authorization;

      if (!validateDate(startMonth) || !validateDate(endMonth)) {
        return res.status(400).send({ error: 'Invalid month' });
      }

      const octokit: Octokit = new Octokit({
        auth: `${token}`
      });

      let currentMonth: string = startMonth;

      while (new Date(currentMonth) <= new Date(endMonth)) {
        let [year, month] = currentMonth.split('-');
        const [startDate, endDate] = calculateLastDayOfMonth(currentMonth);
        const openPrs = await octokit.rest.search.issuesAndPullRequests({
          q: `type:pr+repo:${process.env.OWNER}/${process.env.REPO}+created:${startDate}..${endDate}`
        });
        const closePrs = await octokit.rest.search.issuesAndPullRequests({
          q: `type:pr+repo:${process.env.OWNER}/${process.env.REPO}+closed:${startDate}..${endDate}`
        });

        const pullRequest: PullResponseArrayObj = {
          month: currentMonth,
          open: openPrs.data.total_count,
          close: closePrs.data.total_count
        };
        prArr.push(pullRequest);
        const nextDate = calculateNextMonth(month, year);
        const nextYear = nextDate.year;
        const nextMonth = nextDate.month;
        currentMonth = nextYear + '-' + nextMonth;
      }

      res.status(200).send(prArr);
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
