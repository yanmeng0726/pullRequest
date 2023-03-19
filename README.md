# Downshift PR

Downshift PR is a Restful API based on node.js and tyepscript for dealing with pr data.
This api can display pull request information for the downshift GitHub repository (https://github.com/downshift-js/downshift). The API should expose a single endpoint which will return, summarized by month:
    1. The total number of pull requests which were opened in that month.
    2. The total number of pull requests which were closed in that month.

## Quick Start

  The quickest way to get started to start the server as shown below:

   Add Personal Access Token to environment file.
   [How To Generate a personal access token for github ](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
```console
    replace TOKEN in .env file with your personal github token 
```

  Install dependencies:

```console
$ npm install
```

  Start the server:

```console
$ npm run serve
```

 Ther default server will run at: http://localhost:8080

## Usage
  [Please check the endpoint in swagger.yml](swagger.yml)
  
  Hit http://localhost:8080/pr?month={yyyy-mm} endpoint to check results.


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.



### Running Tests

To run the test suite, first install the dependencies, then run `npm run test`:

```console
$ npm install
$ npm run test
```

## License

[MIT](https://choosealicense.com/licenses/mit/)