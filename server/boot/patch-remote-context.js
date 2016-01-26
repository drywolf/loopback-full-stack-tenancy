// NOTE: sources based on https://github.com/strongloop/loopback/issues/1495
// TODO: improve performance by not passing the entire remoteHttpContext object (see https://github.com/strongloop/loopback/issues/1495#issuecomment-140725123)

module.exports = function(app)
{
    function inject(ctx, next)
    {
        var options = hasOptions(ctx.method.accepts) && (ctx.args.options || {});
        if(options)
        {
            options.remoteCtx = ctx;
            ctx.args.options = options;
        }
        next();
    }

    var inject_cb = function(ctx, instance, next)
    {
        if (typeof instance === 'function')
        {
            next = instance
        }
        inject(ctx, next);
    };

    var shared_models = 
    [
        'Person',
        'Pet'
    ];
    
    for (var m in shared_models)
    {
        var model = shared_models[m];
        
        app.remotes().before(model + '.*', inject);
        app.remotes().before(model + '.prototype.*', inject_cb);
    }

    // unfortunately this requires us to add the options object
    // to the remote method definition
    app.remotes().methods().forEach(function(method)
    {
        if(!hasOptions(method.accepts))
        {
            method.accepts.push(
            {
                arg: 'options',
                type: 'object',
                injectCtx: true
            });
        }
    });

    function hasOptions(accepts)
    {
        for (var i = 0; i < accepts.length; i++)
        {
            var argDesc = accepts[i];
            if (argDesc.arg === 'options' && argDesc.injectCtx)
            {
                return true;
            }
        }
    }    
}
