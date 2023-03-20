# Downshift PR

Downshift PR is a Restful API based on node.js and tyepscript for dealing with pr data.
This api can display pull request information for the repo, such like downshift GitHub repository (https://github.com/downshift-js/downshift). 

The API has endpoint which will return, summarized by month:

    1. The total number of pull requests which were opened in that month.
    
    2. The total number of pull requests which were closed in that month.

The API also has endpoint to get PR for a date range
      1. The total number of pull requests which were opened in every month.
      2. The total number of pull requests which were closed in every month.

## Quick Start

  The quickest way to get started to start the server as shown below:

   
  Install dependencies:

```console
$ npm install
```

  Start the server:

```console
$ npm run serve
```

 The default server will run at: http://localhost:8080

## Docker Start

```console
$ make up
```
 The default server will run at: http://localhost:8080 in backend
 
## Usage
  [Please check the endpoints in swagger.yml](swagger.yml)
  
  After start the default server, generate your personal github token and set it in the request header  [How To Generate a personal access token for github ](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).


Please send request to http://localhost:8080/pullRequestCount?month={yyyy-mm} endpoint to check pr info for a single month.

Please send request to http://localhost:8080/pullRequestCounts?startMonth={yyyy-mm}&&endMonth={yyyy-mm} endpoint to check pr infos for a date range.


## Test
generate your personal github token and set it in the request header  [How To Generate a personal access token for github ](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

Add below variable to .env file :
```console
TOKEN=`${Your Access Token}`
```

To run the test suite, first install the dependencies, then run `npm run test`:

```console
$ npm install
$ npm run test
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.





## License

[MIT](https://choosealicense.com/licenses/mit/)