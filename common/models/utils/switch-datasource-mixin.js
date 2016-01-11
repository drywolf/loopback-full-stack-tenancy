var loopback = require('loopback');

module.exports = function(model, debug, dynamic_ds_mixin)
{
    // this is a security measure to ensure that confidential data-sources will not by any means 
    // stay attached to a model and return their data to an unauthorized request for that data-source
	model.beforeRemote('**', function(remotingCtx, unused, next)
	{
		model.attachTo(model.app.dataSources.nullsrc);
		next();
	});
	
    // override this method and return model data from the requested data-source
	model.getDataSource = function()
    {
        var ctx = loopback.getCurrentContext();

        if (!ctx)
        {
            if (debug)
                console.log(model.modelName, "getDS: no context");
            
            return this.dataSource;
        }
        
        var ds_name = ctx.get('datasource');
        var user_id = ctx.get('user');

        if (!ds_name)
        {
            if (debug)
                console.log(model.modelName, "getDS: no datasource");
        
            return null;
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
        model.app.models.Pet.attachTo(ds);
        
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
