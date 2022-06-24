const { Router } = require('express');
const jwt = require('jsonwebtoken');
const GitHubUser = require('../models/GitHubUser');
const {
  exchangeCodeForToken,
  getGitHubProfile,
} = require('../services/github');
const authenticate = require('../middleware/authenticate');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`
    );
  })
  .get('/callback', async (req, res) => {
    // get code
    const { code } = req.query;
    // exchange code for token
    const gitHubToken = await exchangeCodeForToken(code);
    // get info from github about user with token
    const gitHubProfile = await getGitHubProfile(gitHubToken);
    // get existing user if there is one
    let user = await GitHubUser.findByUsername(gitHubProfile.login);
    // if not, create one
    if (!user) {
      user = await GitHubUser.insert({
        username: gitHubProfile.login,
        email: gitHubProfile.email,
        avatar: gitHubProfile.avatar_url,
      });
    }
    // create jwt
    // set cookie and redirect 
    const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });

    // set cookie
    res
      .cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
      .redirect('/api/v1/github/dashboard');
  })
  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  });
