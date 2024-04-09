using System;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Nodes;

class BatchCoder
{
    static async Task Main(string[] args)
    {
        // read JSON input
        JsonObject input = JsonNode.Parse(Console.OpenStandardInput()).AsObject();

        // initialize Web Services and results objects
        JsonObject config = input["config"].AsObject();
        OnetWebService onet_ws = new OnetWebService(config["username"].GetValue<string>(), config["password"].GetValue<string>());
        int max_results = 1;
        if (config.ContainsKey("max_results"))
        {
            max_results = Math.Max(1, config["max_results"].GetValue<int>());
        }
        JsonObject output = new JsonObject
        {
            ["output"] = new JsonArray { }
        };

        // call keyword search for each input query
        foreach (string q in input["queries"].AsArray())
        {
            JsonArray res = new JsonArray { };
            OnetWebService.QueryParams query = new OnetWebService.QueryParams()
            {
                { "keyword", q },
                { "end", max_results.ToString() },
            };
            JsonObject kwresults = (await onet_ws.Call("online/search", query)).AsObject();
            if (kwresults.ContainsKey("occupation") && kwresults["occupation"].AsArray().Count > 0)
            {
                foreach (JsonNode occnode in kwresults["occupation"].AsArray())
                {
                    JsonObject occ = occnode.AsObject();
                    JsonObject ores = new JsonObject
                    {
                      ["code"] = occ["code"].GetValue<string>(),
                      ["title"] = occ["title"].GetValue<string>()
                    };
                    res.Add(ores);
                }
            }
            JsonObject qres = new JsonObject
            {
              ["query"] = q,
              ["results"] = res
            };
            output["output"].AsArray().Add(qres);
        }

        Console.WriteLine(output.ToJsonString(new JsonSerializerOptions { WriteIndented = true }));
    }
}
