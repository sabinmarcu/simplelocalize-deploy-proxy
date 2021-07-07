/* eslint-disable camelcase */

const express = require('express');
const { Octokit } = require('@octokit/core');

const PORT = process.env.PORT || 5000;
const ENDPOINT = process.env.ENDPOINT || '/trigger';

const app = express();

app.get('/', (req, res) => {
  res.end(`Successfully deployed. Please use ${ENDPOINT} for github proxying`);
});

app.post(ENDPOINT, async (req, res) => {
  console.log('request received');
  const {
    github_token,
    githubtoken,
    github_repo,
    githubrepo,
    github_user,
    githubuser,
    event_type,
    eventtype,
  } = req.headers;
  const token = github_token || githubtoken;
  const repo = github_repo || githubrepo;
  const user = github_user || githubuser;
  const type = event_type || eventtype || 'deploy';
  if (!token) {
    console.log('Token is missing');
    res.status(403).json({
      success: false,
      reason: 'Token is missing (github_token / githubtoken)',
      extra: 'Be aware that the token must have write permissions for the repo',
    });
  }
  if (!user) {
    console.log('User is missing');
    res.status(403).json({
      success: false,
      reason: 'User is missing (github_user / githubuser)',
    });
  }
  if (!repo) {
    console.log('Repository is missing');
    res.status(403).json({
      success: false,
      reason: 'Repository is missing (github_repo / githubrepo)',
    });
  }
  try {
    const octokit = new Octokit({ auth: token });

    const response = await octokit.request('POST /repos/{user}/{repo}/dispatches', {
      user,
      repo,
      event_type: type,
    });

    console.log('Sent github request', 'POST /repos/{user}/{repo}/dispatches', {
      user,
      repo,
      event_type: type,
    });

    res.json({ success: true, extra: response });
  } catch (e) {
    console.log('GH Error: ', e.message, e.stack);
    res.status(500).json({
      success: false,
      reason: 'API Error',
      extra: e.message,
      stack: e.stack,
    });
  }
});

// eslint-disable-next-line no-console
app.listen(PORT, () => { console.log(`Running on ${PORT}`); });
