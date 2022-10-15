# auth-crud-post-service

All available routes, request example/format and response example/format can be viewed in added postman doc below.

https://documenter.getpostman.com/view/11705502/2s8479yvx7


To run the project locally, clone the repository and run npm i to install all dependencies, add MONGO_URL, jwt key in .env file, run npm start to run the server and
hit http://localhost:8080/user/register route at first to register a new user and get token (Token is required for post, update, delete requests), 
input is email, username and password to register.

To run test cases, run npm test, Please read all the comments in the test files to add required data before running tests, otherwise tests will fail.