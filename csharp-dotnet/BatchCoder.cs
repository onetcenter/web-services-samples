using System;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

class BatchCoder
{
    static string GetUserInput(string prompt)
    {
        string val = "";
        while (val == "")
        {
            Console.Write(prompt + ": ");
            val = Console.ReadLine();
        }
        if (val == null)
        {
            Environment.Exit(1);
        }
        return val;
    }

    static void CheckForError(JObject service_result)
    {
        if (service_result.ContainsKey("error"))
        {
            Console.WriteLine(service_result.GetValue("error").ToString());
            Environment.Exit(1);
        }
    }

    static async Task Main(string[] args)
    {
        // read JSON input
        JObject input = JObject.Load(new JsonTextReader(Console.In));
        
        // initialize Web Services and results objects
        JObject config = input.Value<JObject>("config");
        OnetWebService onet_ws = new OnetWebService(config["username"].ToString(), config["password"].ToString());
        int max_results = 1;
        if (config.ContainsKey("max_results"))
        {
            max_results = Math.Max(1, config["max_results"].ToObject<int>());
        }
        JObject output = new JObject();
        output["output"] = new JArray();
        
        // call keyword search for each input query
        foreach (JToken qtoken in input["queries"])
        {
            string q = qtoken.ToString();
            JArray res = new JArray();
            OnetWebService.QueryParams query = new OnetWebService.QueryParams()
            {
                { "keyword", q },
                { "end", max_results.ToString() },
            };
            JObject kwresults = await onet_ws.Call("online/search", query);
            if (kwresults.ContainsKey("occupation") && kwresults["occupation"].HasValues)
            {
                foreach (JObject occ in kwresults["occupation"])
                {
                    JObject ores = new JObject();
                    ores["code"] = new JValue(occ["code"].ToString());
                    ores["title"] = new JValue(occ["title"].ToString());
                    res.Add(ores);
                }
            }
            JObject qres = new JObject();
            qres["query"] = new JValue(q);
            qres["results"] = res;
            output.Value<JArray>("output").Add(qres);
        }
        
        Console.WriteLine(output.ToString());
    }
}
