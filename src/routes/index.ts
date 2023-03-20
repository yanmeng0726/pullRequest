import * as express from 'express';
import { Octokit } from '@octokit/rest';
import { PullResponse} from '../interfaces/types';
import {
  getFirstAndLastDayOfMonth,
  calculateNextMonth,
  filterPrsByStatus,
  initializeResultArr
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

      const startDate = getFirstAndLastDayOfMonth(date).firstDay;
      const endDate = getFirstAndLastDayOfMonth(date).lastDay;

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

      const resultObj: any = {};
      const startMonth = req.query.startMonth;
      const endMonth = req.query.endMonth;
      const token: string = req.headers.authorization;

      if (!validateDate(startMonth) || !validateDate(endMonth)) {
        return res.status(400).send({ error: 'Invalid month' });
      }

      const octokit: Octokit = new Octokit({
        auth: `${token}`
      });

      const startMonthStartDate = getFirstAndLastDayOfMonth(startMonth).firstDay;
      const endMonthEndDate = getFirstAndLastDayOfMonth(endMonth).lastDay;

      initializeResultArr(startMonth, endMonthEndDate, resultObj);

      const allOpenPrs = await octokit.rest.search.issuesAndPullRequests({
        q: `type:pr+repo:${process.env.OWNER}/${process.env.REPO}+created:${startMonthStartDate}..${endMonthEndDate}`
      });

      const allClosePrs = await octokit.rest.search.issuesAndPullRequests({
        q: `type:pr+repo:${process.env.OWNER}/${process.env.REPO}+closed:${startMonthStartDate}..${endMonthEndDate}`
      });

      filterPrsByStatus(allOpenPrs, true, resultObj);
      filterPrsByStatus(allClosePrs, false, resultObj);

      res.status(200).send(resultObj);
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
