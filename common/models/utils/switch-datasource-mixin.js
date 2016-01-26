var loopback = require('loopback');

module.exports = function(model, debug, dynamic_ds_mixin)
{
	model.beforeRemote('**', function(remoteCtx, unused, next)
	{
        if (remoteCtx)
        {
            var ds_name = remoteCtx.req.headers.datasource;
            
            if (ds_name)
            {
                var include = null;
                
                // TODO: handle complex/hierarchical include
                if (remoteCtx.args && remoteCtx.args.filter && remoteCtx.args.filter.include)
                    include = remoteCtx.args.filter.include;
                
                // TODO generic
                model.switchDataSource(ds_name, include);
            }
        }       

		next();
	});

    // NOTE: this method attaches all required models to a requested datasource
	model.switchDataSource = function(ds_name, include)
    { 
        if (!ds_name)
        {
            if (debug)
                console.log(model.modelName, "getDS: no datasource");
        
            throw new Error("DataSource: no datasource name defined for request");
        }
                
        var ds = model.app.dataSources[ds_name];
        
        // if the data-source is invalid
        if (!ds)
        {
            // see if we can inject a dynamically created data-source
            if (dynamic_ds_mixin)
                ds = dynamic_ds_mixin(model, ds_name);
            
            // otherwise just return an error
            if (!ds)
                throw new Error("DataSource: " + ds_name + " not available");
        }

        // NOTE: this is to work arround a bug in the MS SQL connector which does not pass the request context when querying model relations
        // NOTE: this is only working right now for the most simple 'include' case, when a single relation property is included in the query
        if (typeof include === 'string')
        {
            // find relation that should be included
            var relation = model.relations[include];
            
            // it is a valid relation of the model
            if (relation && relation.modelTo && relation.modelTo.modelName)
            {
                var target_mdl_name = relation.modelTo.modelName;
                var target_mdl = model.app.models[target_mdl_name];
                
                // also attach the relation target model to the correct data-source
                if (target_mdl.dataSource.settings.name !== ds.settings.name)
                    target_mdl.attachTo(ds);
            }
        }
        
        if (model.dataSource.settings.name === ds.settings.name)
        {
            if (debug)
                console.log(model.modelName, "getDS: correct datasource is active -> " + ds_name);
        
            return this.dataSource;
        }
    
        model.attachTo(ds);

        if (debug)
            console.log(model.modelName, "getDS: switched datasource -> " + ds_name);
        
        return ds;
    }
}
