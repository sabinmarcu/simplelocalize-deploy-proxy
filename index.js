/* eslint-disable camelcase */
require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 5000;
const ENDPOINT = process.env.ENDPOINT || '/trigger';

const app = express();

app.get('/', (_, res) => {
  res.end(`Successfully deployed. Please use ${ENDPOINT} for github proxying`);
});

const token = process.env.GITHUB_TOKEN || process.env.GITHUBTOKEN;
const repo = process.env.GITHUB_REPO || process.env.GITHUBREPO;
const user = process.env.GITHUB_USER || process.env.GITHUBUSER;
const type = process.env.EVENT_TYPE || process.env.EVENTTYPE || 'deploy';
const source = process.env.SOURCE;
if (!token) {
  console.error('Token is missing (github_token / githubtoken)');
  process.exit(1);
}
if (!user) {
  console.error('User is missing (github_user / githubuser)');
  process.exit(1);
}
if (!repo) {
  console.error('Repository is missing (github_repo / githubrepo)');
  process.exit(1);
}
if (!source) {
  console.error('Endpoint is missing (github_repo / githubrepo)');
  process.exit(1);
}

app.post(ENDPOINT, async (_, res) => {
  console.log('request received');
  try {
    const request = {
      EVENT_TYPE: type,
      GITHUB_REPO: repo,
      GITHUB_USER: user,
      GITHUB_TOKEN: token,
    };

    console.log('Sent github request', `POST ${source}`, request);
    const response = await fetch(
      source,
      {
        method: 'POST',
        headers: request,
      },
    );

    console.log('Success!');

    res.json({ success: true, extra: response });
  } catch (e) {
    console.error('Request failed', e.message, e.stack);
  }
});

// eslint-disable-next-line no-console
app.listen(PORT, () => { console.log(`Running on ${PORT}`); });
