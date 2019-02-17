
# YourWishes App Framework
An opinionated group of modules designed to get production ready apps faster.

## What is the App Framework?

My app framework is built on the concept of “If it does most of what I need, then it’s good enough”, essentially allowing me to strip some of the advanced functionality of some other packages in favour of a seamlessly connected framework of smaller modules that are built to work together.

Each module operates differently but in a format that is generally consistent with this module (the base)

## What was the inspiration?

While working on many of my own projects I was often finding very similar patterns, such as creating a simple server module, connecting to a database, integrating some other API system, perhaps a React compiler, etc.

I started this framework with the intention of just porting the most commonly used modules across to it, such as an Express wrapper, a React Compiler and a PGSQL Database connection.

Each module was built with the concept of a single “App”, and sub “modules”. Apps with a specific module have an interface for that module and modules can cross reference each other. Since this is designed to be used by most of my future web projects the solution is built on Typescript with unit tests being very important for me.

Consider the following tree:

 - “My App” - The app that you have created
	 - Server Module
		 - Provides a hosting of files
		 - Offers API interfaces if required
		 - Configuration handled by standard App configuration
	 - React Module
		 - Compiles React to JS on build
		 - Offers state and store management
		 - Includes common nicities, e.g. Loadable Components and Image Optimizations
	 - Database Module
		 - Handles connecting to database
		 - Reads from standard configuration
		 - Offers a single connection point for different modules
	 - eCommerce Module
		 - Handles all API calls to third party platform
		 - Returns data in standard format
		 - Creates any necessary oauth2 routes on the server

Keep in mind this is just an example, but shows the general flow of how a simple app could be built and be up and running in less time than building each module independently.

## What modules are available

At the time of writing the following modules are available, I plan on adding to this list as more become available. The base module (for the most part) is unlikely to change for some time.

Each set of modules is divided by their complexity and dependency on other modules.

### Module-Less (Non-Module modules)

Non-Module modules offer interfaces that are implemented by other modules.  
 - App Base (This Module)
	 - Provides basic app interface for apps to extend
	 - Simple Logger API, offers timestamp based logging and can be interfaced by other apps to catch log events
	 - Configuration API for reading from a single Configration file (JSON) for all modules
	 - Simple Cache Store interface for caching of items
	 - Interface for all modules, they will require (at minimum) this as a dependency
	 - While untested and not recommended This could be used as a front-end module as well as a backend, while it has only been specifically designed for backend it could be easily modified to support both.
 - App-API
	 - Set of interfaces for common API’s, useful for creating common API handlers
	 - Example uses at the moment include both HTTP API e.g. GET/POST or SOCK API e.g. paths
	 - Potential uses include an interface for commands for bots etc.
	 - Frontend / Backend compatible
 - App-Store
	 - Early development module
	 - Provides common interface for store management
	 - Offers thunks and soon to offer Async actions
	 - Frontend / Backend compatible
	 - High level state change listener API


### Basic Modules
 - App Server
	 - Simple HTTP/HTTPS Server module
	 - Offers direct access to the underlying express wrapper
	 - Can handle HTTP or HTTPs with configuration and SSL Key loading
	 - Implementations for HTTP APIs (POST, GET, PATCH, etc)
 - App Database
	 - Connection and management of an SQL database connection (At the moment only PGSQL is supported, while I have no need for other DB Engines I may add when I do)
	 - Simple async interface
 - App Socket
	 - Socket Server implementation
	 - Designed to be used with App Server to create a complete server connection environment
	 - App level connection accepting / denying
	 - Offers a simple client wrapper with common socket functions, e.g. close() send()
	 - Socket API Interface for writing listener implementations
 - App Store Module
	 - Server side (module based) App Store implementation
	 - Provides interface for other app modules

### Complex Modules
 - App React
	 - Highlevel extension of App Server
	 - Provides a base compiler for React builds
	 - Compiler offers many commonly used features including;
	 - TSX/TS React to JS
	 - Babel and Polyfills
	 - SCSS/CSS Style Loader
	 - SVG/MP4/WEBM File Loader
	 - JPG, GIF and PNG responsive image generation
	 - Asset Minification on Production
	 - Adds static route handler for react directory
 - App Youtube
	 - Early development
	 - Simple YouTube API Interface module, offers very few functions beyond the wrapper
 - App Discord
	 - Similar to app youtube, early development and offers little in the way of high-level app interfaces
 - App Shopify
	 - Early development interface for Shopify Apps
	 - Offers connection via Private or Public API Keys
	 - Per-Store Management
	 - Pre-Defines common routes in server module
	 - Offers (BETA) Token and Task delegation to ensure app is performing, while not reaching API call limit
 - App Simple React
	 - Funnily enough one of the most complicated modules
	 - Wraps around App React to provide even more common functionality and a front-end interface for apps, similar to how app-base functions for a backend interface
	 - Includes custom routes, router, redux for state management on front end
	 - Standard HTML template builder, no extensibility is on offer at this stage
	 - For when you need a react app now

### Implementations

Currently I only have two complete implementations utilizing the app framework. The first being my rewrite of DomBot, and the main inspiration for me to write the app framework.  

The other is an indevelopment Stream Graphics framework designed titled Nyce, designed to function similarly to other graphics frameworks such as nodecg, but without all the baggage, as well as offering React for the graphics themselves.

## How do I get started

I do not have a tutorial written yet (and don’t see me writing one anytime soon), I do plan on at some stage but until I have some strong real world tests on the framework, I am unable to say that the framework is going to fill the niche I have created for it.

In the mean time, if you wish to get started I suggest taking a look at DomBot, he is the only production ready app running the framework, and should offer some insight to how I expect the framework to function. Alternatively you can begin taking a look at the preproduction Nyce framework for a complex setup insight.

## Roadmap

The following pillars are in no particular order, each is something I would like to tackle but may not be able to for some time:
 - Store Sync
	 - Essentially by leveraging Sockets and Perhaps REST APIs, I would like to be able to keep a server-side and client-side redux store in sync.
	 - I have done some early tests with this on Nyce but have yet to find a solid solution
	 - This problem is the core inspiration for app-store, and the soon to be developed app-store-sync module
 - App-database overhaul
	 - I would like to be able to overhaul app-database to support a few database engines
	 - Perhaps a query-less design for ease of development
	 - A new app-database-cache module, or implement it directly with app-database
	 - GraphQL in here maybe
 - Documentation
	 - Yes, I need some of that.
 - Real world apps
	 - I need some of those too
 - Improved tests
	 - While tests have been a focus for me, I feel I lack the diligence to write tests for every function, and often modules that are quite simple or offer few functions, I tend to write very basic tests for.
 - App Server Runtime compiler
	 - As name suggests, I have this implemented on my personal site, a webpack compiler at runtime
 - Migrate existing projects to App Framework
	 - domsPlace is the notable example
 - Load bearing
	 - Not sure how, but sure why not
