/* eslint-disable camelcase */

const express = require('express');
const { Octokit } = require('@octokit/core');

const PORT = process.env.PORT || 5000;
const ENDPOINT = process.env.ENDPOINT || '/trigger';

const app = express();

app.post(ENDPOINT, async (req, res) => {
  const {
    github_repo,
    github_token,
    github_user,
    event_type,
  } = req.headers;
  if (!github_token) {
    res.status(403).json({
      success: false,
      reason: 'Token is missing (github_token)',
      extra: 'Be aware that the token must have write permissions for the repo',
    });
  }
  if (!github_user) {
    res.status(403).json({
      success: false,
      reason: 'User is missing (github_user)',
    });
  }
  if (!github_repo) {
    res.status(403).json({
      success: false,
      reason: 'Repository is missing (github_repo)',
    });
  }
  try {
    const octokit = new Octokit({ auth: github_token });

    const response = await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
      owner: github_user,
      repo: github_repo,
      event_type: event_type || 'deploy',
    });

    res.json({ success: true, extra: response });
  } catch (e) {
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
