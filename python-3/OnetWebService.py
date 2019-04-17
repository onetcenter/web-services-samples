import urllib.request, urllib.parse, urllib.error
import urllib.request, urllib.error, urllib.parse
import base64
import json

class OnetWebService:
    
    def __init__(self, username, password):
        self._headers = {
            'User-Agent': 'python-OnetWebService/1.00 (bot)',
            'Authorization': 'Basic ' + base64.standard_b64encode((username + ':' + password).encode()).decode(),
            'Accept': 'application/json' }
        self.set_version()
    
    def set_version(self, version = None):
        if version is None:
            self._url_root = 'https://services.onetcenter.org/ws/'
        else:
            self._url_root = 'https://services.onetcenter.org/v' + version + '/ws/'
    
    def call(self, path, *query):
        url = self._url_root + path
        if len(query) > 0:
            url += '?' + urllib.parse.urlencode(query, True)
        req = urllib.request.Request(url, None, self._headers)
        handle = None
        try:
            handle = urllib.request.urlopen(req)
        except urllib.error.HTTPError as e:
            if e.code == 422:
                return json.load(e)
            else:
                return { 'error': 'Call to ' + url + ' failed with error code ' + str(e.code) }
        except urllib.error.URLError as e:
            return { 'error': 'Call to ' + url + ' failed with reason: ' + str(e.reason) }
        code = handle.getcode()
        if (code != 200) and (code != 422):
            return { 'error': 'Call to ' + url + ' failed with error code ' + str(code),
                     'urllib2_info': handle }
        return json.load(handle)
