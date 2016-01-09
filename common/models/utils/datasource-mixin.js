var loopback = require('loopback');

module.exports = function(model, debug)
{
  model.getDataSource = function()
  {
    var ctx = loopback.getCurrentContext();

    if (!ctx)
    {
	  if (debug)
        console.log("getDS: no context");
	
      return this.dataSource;
    }

    var ds_name = ctx.get('datasource');

    if (!ds_name)
    {
	  if (debug)
        console.log("getDS: no datasource");
	
      throw new Error("should not happen")
	  
      model.attachTo(model.app.dataSources.nullsrc);
      return this.dataSource;
    }

	var ds = model.app.dataSources[ds_name];
	
    // if the data-source is invalid, throw an error
    if (!ds)
      throw new Error("DataSource: " + ds_name + " not available");

	if (model.dataSource.settings.name === ds.settings.name)
	{
	  if (debug)
		console.log("getDS: correct datasource active -> " + ds_name);
	
	  return this.dataSource;
	}

	model.attachTo(ds);

	if (debug)
		console.log("getDS: switched datasource -> " + ds_name);
	
    return ds;
  }
}
