import * as express from 'express';
import { Octokit } from 'octokit';

export const register = (app: express.Application) => {
  app.get('/', async (req: any, res) => {
    try {
      const token = process.env.TOKEN;
      const octokit = new Octokit({
        auth: `${token}`
      });
      const test = await octokit.request(
        'GET /repos/downshift-js/downshift/pulls',
        {
          owner: 'downshift-js',
          repo: 'downshift',
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      );
      console.dir(test);

      res.send('hitt');
    } catch (error) {
      throw Error;
    }
  });

  // about page
  app.get('/about', (req: any, res) => {
    res.render('about');
  });
};
