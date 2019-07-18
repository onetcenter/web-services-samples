#!ruby
require_relative 'OnetWebService'
require 'json'

# read JSON input
input = JSON.parse(STDIN.read)

# initialize Web Services and results objects
onet_ws = OnetWebService.new(input['config']['username'], input['config']['password'])
max_results = [ 1, input['config']['max_results'] ].max
output = { 'output' => [] }

# call keyword search for each input query
input['queries'].each { |q|
  res = []
  kwresults = onet_ws.call('online/search',
                           { 'keyword' => q,
                             'end' => max_results })
  if kwresults.has_key?('occupation') && !kwresults['occupation'].length.zero?
    kwresults['occupation'].each { |occ|
      res.push({ 'code' => occ['code'], 'title' => occ['title'] })
    }
    output['output'].push({ 'query' => q, 'results' => res })
  end
}

puts JSON.pretty_generate(output)
