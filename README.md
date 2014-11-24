Angular Service Factory
=======================

# A Simple service factory to help with REST APIs

While developing single page applications there's a need to use API services but nothing really helps you our structure your service code.  I've tried [$resource](https://code.angularjs.org/1.3.0-rc.5/docs/api/ngResource/service/$resource) and [RestAngular](https://github.com/mgonto/restangular) but find it to be too much effort to do something simple and I don't like polluting my models with service code.  This was born as an in-between using [$http](https://code.angularjs.org/1.3.0-rc.5/docs/api/ng/service/$http) directly and RestAngular while giving the developer complete freedom over his/her architecture (both front-end and backend).

# Usage Example

You need to load and instantiate the ServiceFactory to be able to use it:

	angular.module('SomeService', ['codinghitchhiker.ServiceFactory']).provider('SomeService', function() {
       
    		this.$get = function ($http, $q, ServiceFactory, localStorageService) {
    			core = new ServiceFactory("http://domain.com/api");
    			return {
    				get: function(params){
    				    return core.get(params).then(function(result){
    				        // Do something else to data
    				    });
    				}
    			};
    		};
    		
# API

## ServiceFactory(url)

Creates a new instance of ServiceFactory with the specified base url.  Must use the 'new' keyword to create the instance. If no url is specified, the call will go to the current url the browser is on (relative).

## add(url)

Creates a new ServiceFactory instance, appends the url to the end of it then returns it said instance. Url can be a number or string. 

Ex. new ServiceFactory('http://localhost').add('entity/123'); will point to url 'http://localhost/entity/123'

## get(params), delete(params, data), post(params, data), put(params, data), head(params, data), jsonp(params, data), patch(params, data)

All do the same things.  Consult the [$http](https://code.angularjs.org/1.3.0-rc.5/docs/api/ng/service/$http) documentation.  These all do exactly the same thing and returns a [Promise](https://code.angularjs.org/1.3.0-rc.5/docs/api/ng/service/$q).

# Development

## First Time

To get started, you will need to install [Nodejs](http://nodejs.org/).  Then open up Git Bash (you do have git installed, right?) and execute the following command:

	npm install -g grunt-cli bower karma phantomjs karma-phantomjs-launcher
	
This will install [Grunt](http://gruntjs.com/), [Bower](http://bower.io/) and [PhantomJS](http://phantomjs.org/) automatically and make it available globally.  Next, change the directory to the git repo (in Git Bash still) and do the following commands:

	npm install
	bower install
	
This will install project specific dependencies.  Every time a dependency is changed, remember to do both.  If you don't, an error will occur during the build process.

## Building

Once you're ready to develop, you can use some simple Grunt commands to help you on your way.  For to most part however, this is the command you will use the most:

	grunt watch
	
This is a simple command that watches your source and test files for changes, then compiles them automatically. The command will have to be restarted if new files are added however.

The other two commands that are used are 

	grunt build
	grunt release
	
The build command is the same as you'll see in `watch`, but without the continuous watching of files.  The release command is special however, since it runs the build, but then minifies, concats and compresses everything to be ready for production.  **Before committing, you should make sure that the release build works**.
