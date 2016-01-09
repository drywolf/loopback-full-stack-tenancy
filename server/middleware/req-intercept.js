var loopback = require('loopback');

module.exports = function()
{
  return function intercept_request(req, res, next) {
    
	var ctx = loopback.getCurrentContext();
	
	if (req.headers.datasource && ctx)
		ctx.set('datasource', req.headers.datasource);
	
	next();
  }
}
