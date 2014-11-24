angular.module('codinghitchhiker.ServiceFactory', [])

	.constant('ServiceConstant', {
		UNSPECIFIED: -1,
		OFFLINE: 0
	})

	.factory('ServiceFactory', function ($http, $q, $log, ServiceConstant) {

		var ServiceFactory = function (url) {
			if (!(this instanceof ServiceFactory)) {
				throw "Service factory must be instantiated using 'new'";
			}
			if (angular.isDefined(url)) {
				url += ''; // Change whatever it is to a string
			}
			this.baseUrl = url || '';
		};

		ServiceFactory.prototype.add = function (url) {
			if (!(angular.isString(url) || angular.isNumber(url))) {
				throw "URL added must be a string or number";
			}
			url += ''; // convert to string in case it's a number
			return new ServiceFactory([this.baseUrl.slice(-1) == '/' ? this.baseUrl.slice(0, -1) : this.baseUrl].concat(url.slice(0, 1) == '/' ? url.slice(1) : url).join('/'));
		};

		// catchall function for all http calls.  Reduces maintenance.
		var call = function (method) {
			return function (params, data, config) {
				// Remove all 'private' variables starting with '$'
				return $http[method](this.baseUrl, toJson(data), angular.extend(config || {}, {params: params})).then(handleSuccess, handleError);
			};
		};

		// Create calls
		angular.forEach(['get', 'delete', 'post', 'put', 'head', 'jsonp', 'patch'], function(value){
			ServiceFactory.prototype[value] = call(value);
		});

		var toJsonReplacer = function (key, value) {
			var val = value;

			if (typeof key === 'string' && key.charAt(0) === '$') {
				val = undefined;
			} else if (value && value.window === value) {
				val = '$WINDOW';
			} else if (value && document === value) {
				val = '$DOCUMENT';
			} else if (value && value.$evalAsync && value.$watch) {
				val = '$SCOPE';
			}

			return val;
		}

		var toJson = function (obj, pretty) {
			if (typeof obj === 'undefined') {
				return undefined;
			}
			return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
		}

		var handleError = function (response) {
			// Default error message if not handled properly
			var error = {
				id: ServiceConstant.UNSPECIFIED,
				message: "Something went wrong, we're looking into it",
				status: response.status
			};

			// Check for offline status
			if (response.status === 0) {
				error.id = ServiceConstant.OFFLINE;
				error.message = 'Internet connection not available. Retry later.';
			}

			// Check if status is a client error
			if (response.data && response.status >= 400 && response.status < 500) {
				error.message = response.data.message;
				var id;
				for (var key in ServiceConstant) {
					if (ServiceConstant[key] === response.data.id) {
						id = ServiceConstant[key];
						break;
					}
				}
				if (!id) {
					id = response.data.id;
					$log.warning('Error id "' + id + '" is missing from ServiceConstant');
				}
				error.id = id;
			}

			// TODO: add rootscope dispatch?
			// TODO: add logging of said error if possible

			return $q.reject(error);
		};

		var handleSuccess = function (response) {
			return response.data; // Just return the data from the http response, the rest is useless for now
		};

		return ServiceFactory;
	});