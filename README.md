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


### Notes

If you want to compile the html client bundle yourself you also need to patch the loopback-connector-remote in the client node_modules, with the following code.
(There is also a [pull-request in loopback-connector-remote](https://github.com/strongloop/loopback-connector-remote/pull/32) to add this change, but it has still to be accepted)

This goes at the end of the file: `loopback-full-stack-tenancy\client\node_modules\loopback-connector-remote\lib\relations.js`

    function defineRelationProperty(modelClass, def) {
        Object.defineProperty(modelClass.prototype, def.name, {
            get: function() {
            var that = this;
            var scope = function() {
                var cached = that.__cachedRelations[def.name];
                
                if (arguments.length == 0)
                    return cached;
                
                return that['__get__' + def.name].apply(that, arguments);
            };
            scope.count = function() {
                return that['__count__' + def.name].apply(that, arguments);
            };
            scope.create = function() {
                return that['__create__' + def.name].apply(that, arguments);
            };
            scope.deleteById = scope.destroyById = function() {
                return that['__destroyById__' + def.name].apply(that, arguments);
            };
            scope.exists = function() {
                return that['__exists__' + def.name].apply(that, arguments);
            };
            scope.findById = function() {
                return that['__findById__' + def.name].apply(that, arguments);
            };
            return scope;
            }
        });
    }
