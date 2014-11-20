angular.module('codinghitchhiker.UtilProvider', [])

	.provider('UtilProvider', function () {
		this.$get = function () {
			return {
				parseQuery: function (query) {
					if (!angular.isString(query)) {
						return;
					}
					query = decodeURIComponent(query.replace(/.*?\?/, '')); // Remove the question mark in the beginning if there is one
					var params = {};
					if (query.length) {
						var array = query.split('&'); // Split all values apart
						for (var i = 0, len = array.length; i < len; i++) {
							var pair = array[i].split('='); // Split the key/value pair
							var key = pair[0];
							if (key.length) {
								if (params[key]) { // Check if value already exists
									if (!angular.isArray(params[key])) {
										params[key] = [params[key]];
									}
									params[key].push(pair[1]);
								} else { // If not, just save
									params[key] = pair[1];
								}
							}
						}
					}
					return params;
				},
				buildUrl: function (url, params) { // taken from angular.js, not currently made public
					if (!params) {
						return url;
					}
					var parts = [];
					angular.forEach(params, function (value, key) {
						if (value === null || angular.isUndefined(value)) {
							return;
						}
						if (!angular.isArray(value)) {
							value = [value];
						}

						angular.forEach(value, function (v) {
							if (angular.isObject(v)) {
								if (angular.isDate(v)) {
									v = v.toISOString();
								} else {
									v = angular.toJson(v);
								}
							}
							parts.push(encodeUriQuery(key) + '=' +
								encodeUriQuery(v));
						});
					});
					if (parts.length > 0) {
						url += ((url.indexOf('?') == -1) ? '?' : '&') + parts.join('&');
					}
					return url;
				}
			};
		};

		var encodeUriQuery = function (val, pctEncodeSpaces) {
			return encodeURIComponent(val).
				replace(/%40/gi, '@').
				replace(/%3A/gi, ':').
				replace(/%24/g, '$').
				replace(/%2C/gi, ',').
				replace(/%3B/gi, ';').
				replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
		};
	});