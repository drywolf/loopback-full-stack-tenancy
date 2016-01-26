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
		console.log("create schema " + ds_name);
		
        var shared_models = 
        [
            'Person',
            'Pet'
        ];
        
        for (var m in shared_models)
        {
            var mdl_name = shared_models[m];            
            model.app.models[mdl_name].attachTo(ds);
        }
		
		ds.autoupdate(shared_models, function ()
		{
		  console.log("Provisioned shared models to datasource " + ds_name);
		});
	});
	
	model.app.dataSources[ds_name] = ds;
	
	return ds;
}
