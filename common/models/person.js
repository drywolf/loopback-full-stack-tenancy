var ds_mixin = require('./utils/switch-datasource-mixin');
var dyn_ds_mixin = require('./utils/inject-datasource-mixin');

module.exports = function(model)
{
  ds_mixin(model, 0, dyn_ds_mixin);
};
