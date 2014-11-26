describe('Service Factory', function () {
	var base;
	beforeEach(function () {
		module('codinghitchhiker.ServiceFactory');
		base = 'http://localhost'; // Set initial base url
	});

	it('Create new instance', inject(function (ServiceFactory) {
		var instance = new ServiceFactory();
		expect(instance).toBeTruthy();
		expect(instance.baseUrl).toBe('');
	}));

	it('Expect to throw error when not using new', inject(function (ServiceFactory) {
		expect(function () {
			ServiceFactory('wee')
		}).toThrow();
	}));

	it('add base url', inject(function (ServiceFactory) {
		expect(new ServiceFactory(base).baseUrl).toBe(base);
		base += '/';
		expect(new ServiceFactory(base).baseUrl).toBe(base);
	}));

	it('create service without a base', inject(function (ServiceFactory) {
		expect(new ServiceFactory().baseUrl).toBe('');
	}));

	it('create service with number as a base', inject(function (ServiceFactory) {
		expect(new ServiceFactory(10).baseUrl).toBe('10');
	}));

	it('append string url to base', inject(function (ServiceFactory) {
		expect(new ServiceFactory(base).add('weee').baseUrl).toBe(base + '/weee');
		expect(new ServiceFactory(base).add('/weee').baseUrl).toBe(base + '/weee');
		base += '/';
		expect(new ServiceFactory(base).add('weee').baseUrl).toBe(base + 'weee');
		expect(new ServiceFactory(base).add('/weee').baseUrl).toBe(base + 'weee');
	}));

	it('append number url to base', inject(function (ServiceFactory) {
		expect(new ServiceFactory(base).add(1000).baseUrl).toBe(base + '/1000');
		expect(new ServiceFactory(base).add(0.1).baseUrl).toBe(base + '/0.1');
	}));

	it('http functions should return promise', inject(function (ServiceFactory, $q) {
		var deferred = $q.defer();
		expect(new ServiceFactory(base).get()).toEqual(jasmine.objectContaining(deferred.promise));
		expect(new ServiceFactory(base).put()).toEqual(jasmine.objectContaining(deferred.promise));
		expect(new ServiceFactory(base).delete()).toEqual(jasmine.objectContaining(deferred.promise));
		expect(new ServiceFactory(base).post()).toEqual(jasmine.objectContaining(deferred.promise));
		expect(new ServiceFactory(base).head()).toEqual(jasmine.objectContaining(deferred.promise));
		expect(new ServiceFactory(base).jsonp()).toEqual(jasmine.objectContaining(deferred.promise));
		expect(new ServiceFactory(base).patch()).toEqual(jasmine.objectContaining(deferred.promise));
	}));

	it('query strings should be added properly', inject(function (ServiceFactory, $httpBackend) {
		var query = {id: '34242', type: 'tag', title: 'weee'};
		$httpBackend.when('GET', function (url) {
			var array = url.split('?')[1].split('&');
			var queries = {};
			for (var i = 0, len = array.length; i < len; i++) {
				var val = array[i].split('=');
				queries[val[0]] = val[1];
			}
			expect(query).toEqual(queries);
			return true;
		}).respond(true);
		new ServiceFactory(base).get(query);
		$httpBackend.flush();
	}));

	it('data should be serialized properly', inject(function (ServiceFactory, $httpBackend) {
		var data = {id: 34242, type: 'tag', title: 'weee'};
		$httpBackend.when('POST', /.*/, function (result) {
			expect(angular.fromJson(result)).toEqual(data);
			return true;
		}).respond(true);
		new ServiceFactory(base).post(null, data);
		$httpBackend.flush();
	}));

	it('data should ignore variables starting with $$ and $', inject(function (ServiceFactory, $httpBackend) {
		var data = {id: 34242, $$type: 'tag', $title: 'weee'};
		$httpBackend.when('POST', /.*/, function (result) {
			expect(angular.fromJson(result)).toEqual({id: 34242});
			return true;
		}).respond(true);
		new ServiceFactory(base).post(null, data);
		$httpBackend.flush();
	}));
});