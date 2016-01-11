# loopback-full-stack-tenancy
example showing how to implement full-stack stateless multi-tenancy with loopback

### Installation & Usage

install server dependencies:

	npm install


install client dependencies:

	cd client
	npm install
	node_modules\.bin\gulp

run server:

	node .

run client:

	open "client/index.html"

### Sample-Usecase

- one automatically created user

	`username: test@test.com`<br>
	`password: test`

- one data-source per family
 - one person in each family
 - one pet related to each person

- three automatically created memory data-sources

- MS-SQL data-sources that will be dynamically added during runtime
 - check `server/sql-server-config.js` for the connection settings


### Multi-Tenancy Sample Features

- separate data-sources hosted via unified REST models
- user-login based access control for data-sources
- fully flexible querying of data-sources
 - no state about the active data-source on the server
 - the target data-source is determined independently for each request
