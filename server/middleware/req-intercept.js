var loopback = require('loopback');

module.exports = function()
{
  return function intercept_request(req, res, next) {
    
	var ctx = loopback.getCurrentContext();
		
	if (ctx)
	{
		if (req.headers.datasource)
			ctx.set('datasource', req.headers.datasource);
		
		if (req.accessToken && req.accessToken.userId)
			ctx.set('user', req.accessToken.userId);
            
        if (req.query && req.query.filter && req.query.filter.include)
			ctx.set('include', req.query.filter.include);
	}

    next();
  }
}
