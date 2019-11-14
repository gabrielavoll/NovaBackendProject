# NovaBackendProject
super simple server, this server has three API calls:
* /phase1  => accepts a GET request, requires params: country_code, account_id, routing_number, file_ext, tags
* /phase2	 => accepts a POST request, requires both a cookie token and body file (.js or .json or .txt) that contains: country_code, account_id, routing_number, first_name, last_name, credit_limit, credit_score
* /data/:id  => accepts GET request, displays data from successful /phase1 & /phase2 completion

# How to Run
1. Pull down repo from Github
2. in the terminal `run: npm install`
	to download all the dependencies
3. copy emailed creds.json into root directory
4. makes sure postgres is installed locally and that it is running
5. in the terminal run: `node db/init.js`
	to spin up local postgres database and tables for this app
6. we are now ready to run the app! in the terminal run:
	```
	node server.js
	```
7. go to url `localhost:6660` in a web browers
	you'll see a home page explainging the api calls on this mini backend server

### Question Portion

#### a. How do I typically manage dependencies for a project?

 Well for one they need to periodically be check-in on to make sure nothing has been deprecated, which is easy enought with npm, but to just take action if there is deprecation. Also only adding dependencies if they are absolutely necessary, and removing dependencies when code changes.

#### b. Provide a top 3 of yor favorite resources (blogs, books, people, etc...) that you use to improve as an engineer. Please explain why you like that particlar resource.

NYU ITP, its a Graduate program at NYU that focuses on integrated media art, utilzing code and technology to make art/games/etc, I'm a super big fan of interactive media and exploring the limits to what code can do, and so I go to almost every open studio event they hold.
I check in on Medium regularly to learn about new frameworks and general technology
Another resource I use is called Advent of Code, which is an online Advent calendar of small programming puzzles for the month of December. Its a way for me to practice my problem solving skills and I've used to challenge myself to become comfortable with python.

#### c. How would you test a piece of code that requires access to a remote database through a network connection?

I would create an SSH tunnel to access the remote database, change my local config hostname and port to utilize the ssh tunnel. Once my local app/server was connected to the remote database through the ssh tunnel I'd test the new piece of code.


