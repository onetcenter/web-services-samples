# C# Code Samples for O\*NET Web Services

`BatchCoder/BatchCoder.cs` is a non-interactive console app which codes a JSON file of job titles to O*NET-SOC occupations.

`KeywordSearch/KeywordSearch.cs` is an interactive console app which demonstrates the occupation keyword search.

`OnetWebService.cs` is a utility class you may use in your own applications.

## Running the example

Clone the sample code repository:

    git clone https://github.com/onetcenter/web-services-samples

Change to the C# directory:

    cd web-services-samples/csharp-dotnet

### Interactive keyword search example

Change to the KeywordSearch directory, and build and run the project:

    cd KeywordSearch
    dotnet run

Alternatively, you can open the `KeywordSearch` folder with Visual Studio Code, and build and run the application.

Follow the prompts to enter your O*NET Web Services credentials, and your search terms.

### Batch coding example

Change to the BatchCoder directory:

    cd BatchCoder

Make a copy of the file `BatchCoder_sample_input.json`, and add your O*NET Web Services credentials. For more information on the file format, see the [batch coder documentation](BatchCoder/BatchCoder_README.md).

Run the application at a command prompt, with your edited copy of the sample input:

    dotnet run < BatchCoder_input_copy.json > BatchCoder_output.json

The file `BatchCoder_output.json` will contain the results.

## License

This sample code is licensed under the terms of the MIT license (see the `LICENSE` file for details).

**Note:** O\*NET Web Services account holders must follow the [Terms of Service](https://services.onetcenter.org/terms) and [Data License](https://services.onetcenter.org/help/license_data) when calling the Services.

## Contact

For problems or suggestions related specifically to this sample code, please use [Issues](https://github.com/onetcenter/web-services-samples/issues/). For all other questions about O\*NET Web Services, including problems with your account, contact [O\*NET Customer Service](mailto:onet@onetcenter.org).
