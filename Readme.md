# NovaBackendProject 
super simple server, this server has three API calls:
* /phase1 
* /phase2
* /data/:id

# How to Run
1. Pull down repo from Github
2. in the terminal run: npm install
	to download all the dependencies
3. make sure postgres is running locally
4. in the terminal run: node db/init.js
	to spin up local postgres database and tables for this app
5. we are now ready to run the app! in the terminal run:
	node server.js
6. go to url localhost:6660 in a web browers, you'll see a home page explainging the api calls on this mini backend server

### Question Portion
#### a. How do I typically manage dependencies for a project?
 Well for one they need to periodically be check-in on to make sure nothing has been deprecated, which is easy enought with npm, but to just take action if there is deprecation. Also only adding dependencies if they are absolutely necessary, and removing dependencies when code changes.
#### b. Provide a top 3 of yor favorite resources (blogs, books, people, etc...) that you use to improve as an engineer. Please explain why you like that particlar resource.
Gizmodo, ACM and 
#### b. How would you test a piece of code that requires access to a remote database through a network connection?
lkajdk
