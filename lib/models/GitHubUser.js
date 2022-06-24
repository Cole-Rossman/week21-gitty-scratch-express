const pool = require('../utils/pool');

module.exports = class GitHubUser {
  id;
  username;
  email;
  avatar;
  
  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.avatar = row.avatar;
  }
};