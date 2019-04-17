"use strict";

function OnetWebService(username) {
  this._config = {
    auth: {
      username: username
    }
  };
  this.set_version();
}

OnetWebService.prototype.set_version = function(version) {
  if (version === undefined) {
    this._config.baseURL = 'https://services.onetcenter.org/ws/';
  } else {
    this._config.baseURL = 'https://services.onetcenter.org/v' + version + '/ws/';
  }
};

OnetWebService.prototype._encode_query = function(query) {
  return Object.keys(query).map(function(key) {
    var nkey = encodeURIComponent(key);
    var vals = query[key];
    if (!Array.isArray(vals)) {
      vals = [ query[key] ];
    }
    return vals.map(function(value) {
      return nkey + '=' + encodeURIComponent(value);
    }).join('&');
  }).join('&');
}

OnetWebService.prototype.call = function(path, query, callback) {
  var url = this._config.baseURL + path + '?client=' + encodeURIComponent(this._config.auth.username);
  if (query !== null && query !== undefined) {
    url += '&' + this._encode_query(query);
  }
  
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.timeout = 10000;
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.ontimeout = function(e) {
    callback({ error: 'Call to ' + url + ' failed with no response from server' });
  };
  xhr.onerror = function(e) {
    if (xhr.statusText != '') {
      callback({ error: 'Call to ' + url + ' failed with reason: ' + xhr.statusText });
    } else {
      callback({ error: 'Call to ' + url + ' failed with unknown reason' });
    }
  };
  xhr.onload = function(e) {
    if (xhr.readyState == 4) {
      if (xhr.status === 200 || xhr.status === 422) {
        callback(JSON.parse(xhr.responseText));
      } else {
        callback({ error: 'Call to ' + url + ' failed with error code ' + xhr.status });
      }
    }
  };
  xhr.send();
};
