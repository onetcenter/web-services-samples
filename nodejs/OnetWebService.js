"use strict"
const axios = require('axios')
const querystring = require('querystring')

class OnetWebService {
  constructor(username, password) {
    this._config = {
      method: 'get',
      auth: {
        username: username,
        password: password
      },
      headers: {
        'User-Agent': 'nodejs-OnetWebService/1.00 (bot)',
        'Accept': 'application/json'
      },
      timeout: 10000,
      maxRedirects: 0
    }
    this.set_version()
  }
  
  set_version(version) {
    if (version === undefined) {
      this._config.baseURL = 'https://services.onetcenter.org/ws/'
    } else {
      this._config.baseURL = 'https://services.onetcenter.org/v' + version + '/ws/'
    }
  }
  
  async call(path, query) {
    const config = Object.assign({}, this._config)
    if (query === undefined) {
      config.url = path
    } else {
      config.url = path + '?' + querystring.stringify(query)
    }
    
    let result = { error: 'Call to ' + config.baseURL + config.url + ' failed with unknown reason' }
    try {
      const response = await axios(config)
      if (response.status == 200) {
        result = response.data
      } else {
        result = { error: 'Call to ' + config.baseURL + config.url + ' failed with error code ' + response.status }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == 422) {
          result = error.response.data
        } else {
          result = { error: 'Call to ' + config.baseURL + config.url + ' failed with error code ' + error.response.status }
        }
      } else if (error.request) {
        result = { error: 'Call to ' + config.baseURL + config.url + ' failed with no response from server' }
      } else if (error.message) {
        result = { error: 'Call to ' + config.baseURL + config.url + 'failed with reason: ' + error.message }
      }
    }
    return result
  }
}

module.exports = OnetWebService
