var loopback = require('loopback');
var DataSource = require('loopback-datasource-juggler').DataSource;

var sql_config_template = require('../../../server/sql-server-config.js').sql_template_source;

module.exports = function(model, ds_name)
{
	var config = JSON.parse(JSON.stringify(sql_config_template));
	config.name = ds_name;
    config.schema = ds_name;
    config.connector = require('loopback-connector-mssql');

    var ds = new DataSource(config);
		
	ds.connector.execute('create schema ' + ds_name, [], function (err, res)
	{
		console.log("create schema");
		
		model.app.models.Person.attachTo(ds);
		model.app.models.Pet.attachTo(ds);
		
		ds.autoupdate(['Person', 'Pet'], function ()
		{
		  console.log("Provisioned models to datasource " + ds_name);
		});
	});
	
	model.app.dataSources[ds_name] = ds;
	
	return ds;
}
