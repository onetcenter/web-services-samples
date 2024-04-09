using System;
using System.Threading.Tasks;
using System.Text.Json.Nodes;

class KeywordSearch
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

    static void CheckForError(JsonNode service_result)
    {
        try
        {
            JsonObject obj = service_result.AsObject();
            if (obj.ContainsKey("error"))
            {
                Console.WriteLine(obj["error"]);
                Environment.Exit(1);
            }
        }
        catch (InvalidOperationException)
        {
            // not an object, so is not an error response
        }
    }

    static async Task Main(string[] args)
    {
        string username = GetUserInput("O*NET Web Services username");
        string password = GetUserInput("O*NET Web Services password");

        OnetWebService onet_ws = new OnetWebService(username, password);
        JsonNode vinfo = await onet_ws.Call("about");
        CheckForError(vinfo);
        Console.WriteLine("Connected to O*NET Web Services version " + vinfo.AsObject()["api_version"].ToString());
        Console.WriteLine("");

        string kwquery = GetUserInput("Keyword search query");
        OnetWebService.QueryParams query = new OnetWebService.QueryParams()
        {
            { "keyword", kwquery },
            { "end", "5" },
        };
        JsonNode results = await onet_ws.Call("online/search", query);
        CheckForError(results);
        JsonObject kwresults = results.AsObject();
        if (!kwresults.ContainsKey("occupation") || kwresults["occupation"].AsArray().Count == 0)
        {
            Console.WriteLine("No relevant occupations were found.");
            Console.WriteLine("");
        }
        else
        {
            Console.WriteLine($"Most relevant occupations for \"{kwquery}\":");
            foreach (JsonNode occnode in kwresults["occupation"].AsArray())
            {
                JsonObject occ = occnode.AsObject();
                Console.WriteLine("  " + occ["code"].GetValue<string>() + " - " + occ["title"].GetValue<string>());
            }
            Console.WriteLine("");
        }
    }
}
