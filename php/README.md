# PHP Code Samples for O\*NET Web Services

`batch_coder.php` is a non-interactive command-line program which codes a JSON file of job titles to O*NET-SOC occupations.

`keyword_search.php` is an interactive command-line program which demonstrates the occupation keyword search.

`OnetWebService.php` is a utility class you may use in your own applications.

## Running the example

Clone the sample code repository:

    git clone https://github.com/onetcenter/web-services-samples

Change to the PHP directory:

    cd web-services-samples/php

### Interactive keyword search example

Run the keyword search example:

    php keyword_search.php

Follow the prompts to enter your O*NET Web Services credentials, and your search terms.

### Batch coding example

Make a copy of the file `batch_coder_sample_input.json`, and add your O*NET Web Services credentials. For more information on the file format, see the [batch coder documentation](batch_coder_README.md).

Run the batch coder example with your edited copy of the sample input:

    php batch_coder.php < batch_coder_input_copy.json > batch_coder_output.json
    
The file `batch_coder_output.json` will contain the results.

## License

This sample code is licensed under the terms of the MIT license (see the `LICENSE` file for details).

**Note:** O\*NET Web Services account holders must follow the [Terms of Service](https://services.onetcenter.org/terms) and [Data License](https://services.onetcenter.org/help/license_data) when calling the Services.

## Contact

For problems or suggestions related specifically to this sample code, please use [Issues](https://github.com/onetcenter/web-services-samples/issues/). For all other questions about O\*NET Web Services, including problems with your account, contact [O\*NET Customer Service](mailto:onet@onetcenter.org).
