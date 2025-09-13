"use strict"
const querystring = require('querystring')

class OnetWebService {
  constructor(username, password) {
    this._config = {
      headers: {
        'Authorization': 'Basic ' + btoa(username + ':' + password),
        'User-Agent': 'nodejs-OnetWebService/1.10 (bot)',
        'Accept': 'application/json'
      }
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
      const response = await fetch(config.baseURL + config.url, {
        method: 'GET',
        headers: this._config.headers
      })
      if (response.status == 200 || response.status == 422) {
        try {
          result = await response.json()
        } catch (e) {
          result = { error: 'Call to ' + config.baseURL + config.url + ' failed on JSON parse' }
        }
      } else {
        result = { error: 'Call to ' + config.baseURL + config.url + ' failed with error code ' + response.status }
      }
    } catch (error) {
      if (error.message) {
        result = { error: 'Call to ' + config.baseURL + config.url + ' failed with reason: ' + error.message }
      } else {
        result = { error: 'Call to ' + config.baseURL + config.url + ' failed with unknown reason' }
      }
    }
    return result
  }
}

module.exports = OnetWebService
