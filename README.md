Leaflet Routing Machine / PointToPoint
=====================================

A Router for Leaflet Routing Machine that doesn't do any routing.

Some brief instructions follow below, but the [Leaflet Routing Machine tutorial on alternative routers](http://www.liedman.net/leaflet-routing-machine/tutorials/alternative-routers/) is recommended.

## Installing


To use with for example Browserify:

```sh
npm install --save lrm-pointtopoint
```

There's not pre-built files yet, but I will get to it.

## Using

There's a single class exported by this module, `L.Routing.PointToPoint`. It implements the [`IRouter`](http://www.liedman.net/leaflet-routing-machine/api/#irouter) interface. Use it to replace Leaflet Routing Machine's default OSRM router implementation:

```javascript
var L = require('leaflet');
require('leaflet-routing-machine');
require('lrm-pointtopoint'); // This will tack on the class to the L.Routing namespace

L.Routing.control({
    router: new L.Routing.PointToPoint(),
}).addTo(map);
```
