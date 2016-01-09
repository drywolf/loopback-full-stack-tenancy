var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname);

var remoteDs = app.dataSources.remoteDS;
var remotes = remoteDs.connector.remotes;

remotes.before('**', function(ctx, next)
{
    ctx.req.headers = 
	{
		datasource: window.datasource || 'nullsrc'
	};

    next();
});
