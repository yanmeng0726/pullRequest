import * as express from 'express';
import { Octokit } from '@octokit/rest';
import { PullResponse } from '../interfaces/types';

export const register = (app: express.Application) => {
  app.get('/pr', async (req: any, res) => {
    try {

      const date = req.query.month;
      const re: RegExp = new RegExp('([12]\d{3}-(0[1-9]|1[0-2])$)');
      if (!re.test(date)) {
        return res.status(400).send({ error: 'Invalid month' });
      }

      let [year, month] = date.split('-');
      const startDate: string = year + '-' + month + '-01';

      let nextMonth: string;
      if (month === '12') {
        year = (Number(year) + 1).toString();
        nextMonth = '1';
      } else {
        nextMonth = (Number(month) + 1).toString();
      }
      let lastDay: Date = new Date(year + '-' + nextMonth);
      lastDay.setDate(lastDay.getDate() - 1);

      const endDate: string = lastDay.toISOString().split('T', 1)[0];

      // console.dir(startDate + ' ' + endDate);

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
