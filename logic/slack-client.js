'use strict'

const util = require('util');
const request = util.promisify(require('request'));

const baseURL = 'https://slack.com/api';

class SlackClient {
  constructor(config) {
    this._channelId = config.channelId;
    this._token = config.token;
  }

  async getUsers() {
    const options = {
      uri: `${baseURL}/users.list`,
      qs: {
        "token": this._token
      }
    }
    const response = await request(options);
    const body = JSON.parse(response.body)
    if (!body.ok) {
      throw new Error('users.list request NG');
    } else {
      return body.members;
    }
  }

  async getChannelMembers() {
    const options = {
      uri: `${baseURL}/conversations.members`,
      qs: {
        "token": this._token,
        "channel": this._channelId
      }
    }
    const response = await request(options);
    const body = JSON.parse(response.body)
    if (!body.ok) {
      throw new Error('conversations.members request NG');
    } else {
      return body.members;
    }    
  }

  async getChannelHistory() {
    const options = {
      uri: `${baseURL}/channels.history`,
      qs: {
        "token": this._token,
        "channel": this._channelId
      }
    }
    const response = await request(options);
    const body = JSON.parse(response.body)
    if (!body.ok) {
      throw new Error('channels.history request NG');
    } else {
      return body.messages;
    }    
  }
}

module.exports = SlackClient;