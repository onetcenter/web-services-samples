#!python3
from OnetWebService import OnetWebService
import sys
import json

# read JSON input
input = json.load(sys.stdin)

# initialize Web Services and results objects
onet_ws = OnetWebService(input['config']['username'], input['config']['password'])
max_results = max(1, input['config']['max_results'])
output = { 'output': [] }

# call keyword search for each input query
for q in input['queries']:
    res = []
    kwresults = onet_ws.call('online/search',
                             ('keyword', q),
                             ('end', max_results))
    if ('occupation' in kwresults) and (0 < len(kwresults['occupation'])):
        for occ in kwresults['occupation']:
            res.append({ 'code': occ['code'], 'title': occ['title'] })
    output['output'].append({ 'query': q, 'results': res })

json.dump(output, sys.stdout, indent=2, sort_keys=True)
