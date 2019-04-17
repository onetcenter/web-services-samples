using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;

public class OnetWebService
{
    public class QueryParams : IEnumerable<KeyValuePair<string, string>>
    {
        private List<KeyValuePair<string, string>> internalParams = new List<KeyValuePair<string, string>>();
        public IEnumerator<KeyValuePair<string, string>> GetEnumerator() => internalParams.GetEnumerator();
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => internalParams.GetEnumerator();

        public void Add(string key, string value) => internalParams.Add(new KeyValuePair<string, string>(key, value));
    }

    private string baseURL;
    private HttpClient client;

    private static string EncodeAuth(string username, string password)
    {
        return Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes(username + ":" + password));
    }

    public OnetWebService(string username, string password)
    {
        HttpClientHandler handler = new HttpClientHandler()
        {
            AllowAutoRedirect = false,
        };
        client = new HttpClient(handler);
        client.Timeout = new TimeSpan(0, 0, 10);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        client.DefaultRequestHeaders.UserAgent.ParseAdd("dotnet-OnetWebService/1.00 (bot)");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", EncodeAuth(username, password));

        SetVersion();
    }

    public void SetVersion(string version = "")
    {
        if (version == "")
        {
            baseURL = "https://services.onetcenter.org/ws/";
        }
        else
        {
            baseURL = "https://services.onetcenter.org/ws/v" + version + "/ws/";
        }
    }

    public async Task<JObject> Call(string path, QueryParams query = null)
    {
        List<string> encoded_params = new List<string>();
        if (query != null)
        {
            foreach (KeyValuePair<string, string> pair in query)
            {
                encoded_params.Add(System.Net.WebUtility.UrlEncode(pair.Key) + "=" + System.Net.WebUtility.UrlEncode(pair.Value));
            }
        }
        string url = baseURL + path;
        if (encoded_params.Count > 0)
        {
            url += "?" + String.Join("&", encoded_params.ToArray());
        }

        JObject result = new JObject();
        result["error"] = new JValue("Call to " + url + " failed with unknown reason");
        try
        {
            HttpResponseMessage response = await client.GetAsync(url);
            if (response.StatusCode == (System.Net.HttpStatusCode)200 || response.StatusCode == (System.Net.HttpStatusCode)422)
            {
                result = JObject.Parse(await response.Content.ReadAsStringAsync());
            }
            else
            {
                result["error"] = new JValue("Call to " + url + " failed with error code " + ((int)response.StatusCode).ToString());
            }
        }
        catch (HttpRequestException e)
        {
            result["error"] = new JValue("Call to " + url + " failed with reason: " + e.Message);
        }

        return result;
    }
}
