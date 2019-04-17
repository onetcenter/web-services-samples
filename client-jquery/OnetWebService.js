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

OnetWebService.prototype.call = function(path, query, callback) {
  var params = Object.assign({}, query);
  params.client = this._config.auth.username;
  var url = this._config.baseURL + path + '?' + $.param(params, true);
  $.ajax({
    method: 'GET',
    async: true,
    url: url,
    dataType: 'json',
    timeout: 10000,
    error: function(jqxhr, statustext, err) {
      if (jqxhr.status === 422) {
        callback(JSON.parse(jqxhr.responseText));
      } else if (jqxhr.status) {
        callback({ error: 'Call to ' + url + ' failed with error code ' + jqxhr.status });
      } else if (statustext === 'timeout') {
        callback({ error: 'Call to ' + url + ' failed with no response from server' });
      } else if (err) {
        callback({ error: 'Call to ' + url + ' failed with reason: ' + err });
      } else {
        callback({ error: 'Call to ' + url + ' failed with unknown reason' });
      }
    },
    success: function(data, statustext, jqxhr) {
      callback(data);
    }
  });
};
