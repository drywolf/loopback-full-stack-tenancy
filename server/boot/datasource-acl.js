// just a simple JS map to specify access control for which data-sources the user with id:1 can access
var family_acl = 
{
    // user-id
	'1':
	{
        // data-source-ids
		family1: true,
		family2: true, 
		family3: false,
		sql_familyA: true,
		sql_familyB: true,
		sql_familyC: true
	}
};

// NOTE: simulate asynchronous ACL query to check for permissions
// this is the also way that you need when you would use a model to determine the access control, e.g. with MyDataAccessModel.find(...)
function check_acl(uid, ds_name, cb)
{
    var acl = family_acl[uid];
        
	if (!acl)
		cb(new Error("Tenant-ACL: Authorization denied, invalid user-id: " + uid));
	
	else if (!acl[ds_name])
		cb(new Error("Tenant-ACL: Authorization denied, user is not allowed to access this datasource: " + ds_name));
    
    else
        cb(null, true);
}

module.exports = function(app) {
    
  var Role = app.models.Role;
  
  Role.registerResolver('tenant-member', function(role, context, cb) {
    
    function reject(err) {
      if(err) {
        return cb(err);
      }
      cb(null, false);
    }
    
    if (context && 
        context.remotingContext && 
        context.remotingContext.req && 
        context.remotingContext.req.headers && 
        context.remotingContext.req.headers.datasource && 
        context.accessToken && 
        context.accessToken.userId)
    {
        check_acl(context.accessToken.userId, context.remotingContext.req.headers.datasource, cb);
    }
    else
        cb(new Error("Tenant-ACL: Authorization denied, no valid authentication provided"));
  });
};
