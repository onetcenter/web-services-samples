# Perl 5 Code Samples for O\*NET Web Services

`keyword_search.pl` is a command-line program which demonstrates the occupation keyword search.

`Local/OnetWebService.pm` is a Perl module you may use in your own applications.

## Running the example

Clone the sample code repository:

    git clone https://github.com/onetcenter/web-services-samples

Install dependencies as needed:

    perl -MCPAN -e shell
    cpan> install LWP::UserAgent LWP::Protocol::https JSON

Change to the Perl directory:

    cd web-services-samples/perl-5

Run the keyword search example:

    perl keyword_search.pl

Follow the prompts to enter your O\*NET Web Services credentials, and your search terms.


## License

This sample code is licensed under the terms of the MIT license (see the `LICENSE` file for details).

**Note:** O\*NET Web Services account holders must follow the [Terms of Service](https://services.onetcenter.org/terms) and [Data License](https://services.onetcenter.org/help/license_data) when calling the Services.

## Contact

For problems or suggestions related specifically to this sample code, please use [Issues](https://github.com/onetcenter/web-services-samples/issues/). For all other questions about O\*NET Web Services, including problems with your account, contact [O\*NET Customer Service](mailto:onet@onetcenter.org).
