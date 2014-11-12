Prodio Generic Stores
=====================

This is the generic stores interface for prodio.  It basically provides a clean
abstraction between supported data storage engines and Prodio.  Any
prodio/*-store is supported and tested with this interface.

Installation
------------

```
npm install prodio-stores <storeName>
```

If you don't supply a storeName then only memory store will be installed.  This
may be ok, depending on your use case.

Testing
-------

Tests are written in Mocha and are basically the same for ALL stores and the
store interface.  Basically proving that stores work the same no matter what.

Some stores, like Redis and Mongo, have additional functionality, don't use it.
It will not be tested and it will not be guaranteed to work.

```
npm test
```

API
===

```
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
Store.init(configuration)
```

Usage
=====

```
var Stores = require('prodio-stores');
Stores.init({...config here...});
var myStore = Stores('test-store');
```
