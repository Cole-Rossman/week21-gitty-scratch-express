const exchangeCodeForToken = async (code) => {
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const getGitHubProfile = async (token) => {
  console.log(`MOCK INVOKED: getGitHubProfile(${token})`);
  return {
    login: 'fake_github_user',
    avatar_url: 'fake picture',
    email: 'not-real@example.com',
  };
};

module.exports = { exchangeCodeForToken, getGitHubProfile };
