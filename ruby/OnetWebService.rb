require 'net/https'
require 'uri'
require 'cgi'
require 'json'

class OnetWebService

  def initialize(username, password)
    @username = username
    @password = password
    @headers = { 'Accept' => 'application/json',
                 'User-Agent' => 'ruby-OnetWebService/1.00 (bot)' }
    self.set_version
  end
  
  def set_version(version = nil)
    @url_root =
      if version.nil?
        'https://services.onetcenter.org/ws/'
      else
        "https://services.onetcenter.org/v#{version}/ws/"
      end
  end
  
  def call(path, query = {})
    url = @url_root + path + '?'
    query.each do |key, value|
      Array(value).each do |v|
        url += CGI::escape(key.to_s) + '=' + CGI::escape(v.to_s) + '&'
      end
    end
    url.chop!
    
    uri = URI.parse(url)
    request = Net::HTTP::Get.new(uri.request_uri)
    @headers.each { |k, v| request[k] = v }
    request.basic_auth(@username, @password)

    response = nil
    begin
      Net::HTTP.start(uri.host, uri.port,
                      :use_ssl => true,
                      :open_timeout => 10,
                      :read_timeout => 10,
                      :ssl_timeout => 10) do |http|
        response = http.request(request)
      end
    rescue StandardError => e
      return { 'error' => "Call to #{url} failed with reason: #{e.inspect}" }
    end
    
    result = nil
    case response
    when Net::HTTPOK, Net::HTTPUnprocessableEntity
      result = JSON.parse(response.body)
    else
      if !response.code.nil?
        result = { 'error' => "Call to #{url} failed with error code #{response.code}" }
      else
        result = { 'error' => "Call to #{url} failed with unknown reason" }
      end
    end
    result
  end

end
