/*
  Store(name)
    get(id, callback)
    insert(record, callback)
    update(id, record, callback)
    delete(id, callback)
    asArray(options, callback)
      options{
        offset: Number
        limit: Number
        filter: Object
        sort: {
          Key: Direction(1 Ascending, -1 Descending)
          ...
        }
      }
*/

var noop = function(){};
var reTrue = /^(true|t|yes|y|1)$/i;
var reFalse = /^(false|f|no|n|0)$/i;

var isTrue = function(value){
  return !!reTrue.exec(''+value);
};

var isFalse = function(value){
  return !!reFalse.exec(''+value);
};

var isNumeric = function (n){
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var Provider = module.exports = function(storeName){
  return Provider._stores[storeName] || (Provider._stores[storeName] = loadStore(Provider.Store, storeName));
};

var loadStore = function(Store, storeName){
  return new Store(storeName);
};

var reformFilter = function(on){
  if(on === void 0){
    return on;
  }
  var res = {};
  var keys = Object.keys(on), l = keys.length, i, key, value;
  for(i=0; i<l; i++){
    key = keys[i];
    value = on[key];
    if(isNumeric(value)){
      res[key] = +value;
    }else if(isTrue(value)){
      res[key] = true;
    }else if(isFalse(value)){
      res[key] = false;
    }else if(value instanceof Array){
      value.forEach(function(index){
        value[index] = reformFilter(value[index]);
      });
      res[key] = value;
    }else if(typeof(value)==='object'){
      if(value !== null && value !== void 0){
        res[key] = reformFilter(value);
      }
    }else{
      res[key] = value;
    }
  }
  return res;
};

Provider.init = function(cfg){
  var config = cfg||{type: 'memory'};
  var storeType = config.type;
  var _stores = Provider._stores = {};
  var logger = Provider.logger = config.logger||{
    info: noop,
    error: noop
  };
  var Store = Provider.Store = require('prodio-memory-store');
  try{
    try{
      Store = this.Store = require(storeType);
    }catch(e){
      logger.error(e);
      try{
        Store = this.Store = require('./stores/'+storeType);
      }catch(e){
        throw e;
      }
    }
  }catch(e){
    logger.info(storeType+' not availble falling back to in-memory store.');
    logger.info(e);
    if(e.stack){
      logger.info(e.stack);
    }
  }
  (Store.init||noop)(config);
  var asArray = Store.prototype.asArray;
  Store.prototype.asArray = function(opts, callback){
    var options = opts || {};
    if(options.filter){
      options.filter = reformFilter(options.filter);
    }
    return asArray.call(this, options, callback);
  };
};

module.exports = Provider;
