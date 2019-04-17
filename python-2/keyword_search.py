#!python2
from OnetWebService import OnetWebService
import sys

def get_user_input(prompt):
    result = ''
    while (len(result) == 0):
        result = raw_input(prompt + ': ').strip()
    return result

def check_for_error(service_result):
    if 'error' in service_result:
        sys.exit(service_result['error'])

username = get_user_input('O*NET Web Services username')
password = get_user_input('O*NET Web Services password')
onet_ws = OnetWebService(username, password)

vinfo = onet_ws.call('about')
check_for_error(vinfo)
print "Connected to O*NET Web Services version " + str(vinfo['api_version'])
print ""

kwquery = get_user_input('Keyword search query')
kwresults = onet_ws.call('online/search',
                         ('keyword', kwquery),
                         ('end', 5))
check_for_error(kwresults)
if (not 'occupation' in kwresults) or (0 == len(kwresults['occupation'])):
    print "No relevant occupations were found."
    print ""
else:
    print "Most relevant occupations for \"" + kwquery + "\":"
    for occ in kwresults['occupation']:
        print "  " + occ['code'] + " - " + occ['title']
    print ""
