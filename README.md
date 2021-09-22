# Node Express Mongo #

This repository consists code base for nodejs, expressjs and mongodb backend setup.

### Folder Structure ###
* `config` - # Environment variables and configuration related stuff
* `controllers` - # It handles request/response for API routes
* `database` - # Database connection, common pagination methods and seeders data(default data)
* `helpers` - # All the third party integration API's core methods are placed inside this folder
* `middleware` - # All the middleware routing functions are placed inside this folder
* `models` - # Database models are placed inside this folder
* `public` - # Images,stylesheets and fonts which can be allowed to use publicly are placed inside this folder
* `routes` - # All the API routes are placed inside this folder
* `services` - # All the business logic is here
* `templates` - # All the HTML templates are placed inside this folder.i.e.Email Template(html) for Forgot password is placed here.
* `test` - # All the test methods are placed in this folder.In this project,we have added mocha-chai test cases for the testing 
* `utils` - # All the common utility methods are placed inside this folder
* `views` - # All ejs files are placed here(Build folder from react/vue or any frontend will be placed here)
* `.env` - # It has all variables which are used in application(User can add data with taking reference of .env.example)
* `app.js` - # App entry point
* `Node_JS_Sample.postman_collection.json` - # It has Postman collection with API details and test cases.

### How to set up? ###
* clone this repo (git clone "git_repo_url")
* create an .env file and add content based on sample .env.example
* run `npm install` to install the dependencies
* run `npm run seed` to get the default admin user 
    *  Email - admin@example.com, Password - password  
* run `npm start` to start the development server
* run `npm test` to run the test.
* While testing with Postman Collection, please select "Node Js Sample" environment.
    
### Demo video link 
* https://www.screencast.com/t/oRvnyblTdL5
