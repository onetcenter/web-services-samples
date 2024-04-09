# Batch Coder File Descriptions

## Input file format

The `batch_coder.js` example accepts a specially formatted JSON file containing two main sections:

1. Configuration options for the output to be produced
2. The queries to be processed

These are defined in the `config` and `queries` properties. For example:

```json
{ "config": {
    "username": "my_web_services_username",
    "password": "my_web_services_password",
    "max_results": 3
  },
  "queries": [
    "Structural Engineer",
    "Receptionist",
    "Senior IT Manager"
  ]
}
```

### Configuration options

* **`username`** (Required): The username issued to your project by O\*NET Web Services.
* **`password`** (Required): The password issued to your project by O\*NET Web Services.
* **`max_results`**: The maximum number of occupations to return for each query. Some queries may include fewer results. Default value: 1.

### Queries

The queries to be coded should be provided as an array of strings. Each string is coded separately. The input file does not support multiple job posting fields or other metadata.

## Output file format

The script produces JSON output with the original queries and batch-coded results. For example:

```json
{ "output": [
    { "query": "Structural Engineer",
      "results": [
        { "code": "17-2051.00",
          "title": "Civil Engineers" },
        { "code": "17-2199.10",
          "title": "Wind Energy Engineers" },
        { "code": "17-2121.02",
          "title": "Marine Architects" }
      ]
    }
  ]
}
```

The main JSON object contains a single property, `output`. The value of this property is an array containing one object for every input query. Each of these objects contains:

* **`query`**: The input query submitted to O*NET Web Services, as specified in the input file.
* **`results`**: An array of occupations relevant to the query. Each `results` array contains no more than `max_results` items. Each item is an O*NET-SOC occupation which contains `code` and `title` properties. An empty array is returned if no occupations were returned, or if an error occurred.
