#!ruby
require_relative 'OnetWebService'

def get_user_input(prompt)
  result = ''
  while result.length.zero?
    print prompt + ': '
    result = gets
    result.chomp!
  end
  result
end

def check_for_error(service_result)
  if service_result.has_key?('error')
    abort service_result['error']
  end
end

username = get_user_input('O*NET Web Services username')
password = get_user_input('O*NET Web Services password')
onet_ws = OnetWebService.new(username, password)

vinfo = onet_ws.call('about')
check_for_error(vinfo)
puts "Connected to O*NET Web Services version #{vinfo['api_version']}"
puts

kwquery = get_user_input('Keyword search query')
kwresults = onet_ws.call('online/search',
                         { 'keyword' => kwquery,
                           'end' => 5 })
check_for_error(kwresults)
if !kwresults.has_key?('occupation') || kwresults['occupation'].length.zero?
  puts 'No relevant occupations were found.'
  puts
else
  puts "Most relevant occupations for \"#{kwquery}\":"
  kwresults['occupation'].each { |occ| puts "  #{occ['code']} - #{occ['title']}" }
  puts
end
