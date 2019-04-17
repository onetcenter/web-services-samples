using System;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

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
        string username = GetUserInput("O*NET Web Services username");
        string password = GetUserInput("O*NET Web Services password");

        OnetWebService onet_ws = new OnetWebService(username, password);
        JObject vinfo = await onet_ws.Call("about");
        CheckForError(vinfo);
        Console.WriteLine("Connected to O*NET Web Services version " + (string)vinfo["api_version"]);
        Console.WriteLine("");

        string kwquery = GetUserInput("Keyword search query");
        OnetWebService.QueryParams query = new OnetWebService.QueryParams()
        {
            { "keyword", kwquery },
            { "end", "5" },
        };
        JObject kwresults = await onet_ws.Call("online/search", query);
        CheckForError(kwresults);
        if (!kwresults.ContainsKey("occupation") || !kwresults["occupation"].HasValues)
        {
            Console.WriteLine("No relevant occupations were found.");
            Console.WriteLine("");
        }
        else
        {
            Console.WriteLine($"Most relevant occupations for \"{kwquery}\":");
            foreach (JObject occ in kwresults["occupation"])
            {
                Console.WriteLine("  " + occ["code"] + " - " + occ["title"]);
            }
            Console.WriteLine("");
        }
    }
}
