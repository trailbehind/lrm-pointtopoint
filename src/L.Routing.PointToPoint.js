(function() {
	'use strict';

	var turf = {};
	turf.linestring = require('turf-linestring');
	turf.lineDistance = require('turf-line-distance');
	turf.distance = require('turf-distance');
	turf.point = require('turf-point');
	turf.bearing = require('turf-bearing');

	var L = require('leaflet');
	L.Routing = L.Routing || {};

	L.Routing.PointToPoint = L.Class.extend({
		options: {
			speed: 1 //Speed in meters per second
		},

		initialize: function(options) {
			L.Util.setOptions(this, options);
		},

		route: function(waypoints, callback, context, options) {
			var wps = [],
				coordinates = [],
				latlngs = [],
				alts = [],
				wp,
				routeLinestring;
			for (var i = 0; i < waypoints.length; i++) {
				wp = waypoints[i];
				wps.push({
					latLng: wp.latLng,
					name: wp.name,
					options: wp.options
				});
				latlngs.push(wp.latLng);
				coordinates.push([wp.latLng.lng, wp.latLng.lat]);
			}

			routeLinestring = turf.linestring(coordinates);
			alts.push({
				name: "" + coordinates.length + " Points",
				coordinates: latlngs,
				instructions: this._calculateInstructions(routeLinestring),
				summary: {
					totalDistance: turf.lineDistance(routeLinestring, "kilometers") * 1000,
					totalTime: turf.lineDistance(routeLinestring, "kilometers") * 1000 * this.options.speed,
				},
				inputWaypoints: wps,
				actualWaypoints: wps,
			});

			callback.call(context, null, alts);
			return this;
		},

		_calculateInstructions: function(feature) {
			var result = [],
				i,
				type,
				distance,
				bearing,
				road,
				lastPoint,
				thisPoint,
				nextPoint;

			for(i = 0; i < feature.geometry.coordinates.length; i++) {
				thisPoint = turf.point(feature.geometry.coordinates[i]);
				if(i + 1 < feature.geometry.coordinates.length ) {
					nextPoint = turf.point(feature.geometry.coordinates[i + 1]);
				} else {
					nextPoint = null;	
				}

				if(i == 0) {
					type = "StartAt";
					road = "0";
				} else if(i == feature.geometry.coordinates.length - 1) {
					type = "DestinationReached";
					road = i.toFixed(0) + " to " + (i + 1).toFixed(0);
				} else {
					type = "WaypointReached";
					road = i.toFixed(0);
				}

				if(nextPoint) {
					distance = turf.distance(thisPoint, nextPoint) * 1000;
					bearing = turf.bearing(thisPoint, nextPoint);
				} else {
					distance = 0;
					bearing = 0;
				}

				result.push({
					type: type,
					distance: distance,
					time: 0,
					road: "",
					direction: this._bearingString(bearing),
					index: i,
					text: ""
				});
				lastPoint = thisPoint;
			}
			return result;
		},

		_bearingString: function(degrees) {
			return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][parseInt(((degrees + 22.5)/45)%8)];
		}
	});

	L.Routing.pointToPoint = function(options) {
		return new L.Routing.PointToPoint(options);
	};

	module.exports = L.Routing.PointToPoint;
})();
