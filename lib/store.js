/*
  Store(name)
    get(id, callback)
    insert(record, callback)
    update(id, record, callback)
    upsert(id, record, callback)
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
    ensure(record, callback)
*/

var noop = function(){};

var Provider = module.exports = function(storeName){
  return Provider._stores[storeName] || (Provider._stores[storeName] = loadStore(Provider.Store, storeName));
};

var loadStore = function(Store, storeName){
  return new Store(storeName);
};

Provider.init = function(cfg){
  var config = cfg||{type: 'memory'};
  var storeType = config.type;
  var _stores = Provider._stores = {};
  var logger = Provider.logger = config.logger||{
    info: noop,
    error: noop
  };
  var Store = Provider.Store = require('./stores/memory');
  try{
    try{
      Store = this.Store = require('./stores/'+storeType);
    }catch(e){
      logger.error(e);
      try{
        this.Store = require(storeType);
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
};

module.exports = Provider;
