# DAT076-project
Project in course DAT076 - Web applications @ Chalmers

Before you begin

Make sure you have grunt-cli installed, as it will be used to run the webserver. If you don't, simply run

```bash
$ npm install -g grunt-cli
```

Then cd into the /backend directory and run

```bash
$ npm install
```
When all dependencies have been installed run the backend:

```bash
$ npm start
```

Make sure to have mongoDB running as well. Then fire up a new terminal and cd into the /frontend directory and run 

```bash
$ npm install
$ bower install
```
Then fire up a local web server by running: 

```bash
$ grunt serve
```
A webserver is now running at 
```
localhost:9000/
```
Open it in a browser of your choice (We recommend Google Chrome for this application, as it has been used throughout development)  

To run the tests, in the /backend directory, run the backend using the test database:  

```bash
$ npm start test
```
  And then run the tests in another shell:
  
```bash
$ npm test
```
