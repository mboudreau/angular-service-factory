describe('Util Provider', function () {
	var base;
	beforeEach(function(){
		module('codinghitchhiker.UtilProvider');
		base = 'http://localhost';
	});

	it('Check that buildUrl works', inject(function (UtilProvider, $http, $httpBackend) {
		var params = {id: '34242', tags: ['tag1', 'tag2'], title: 'weee blah'};
		$httpBackend.when('GET', function (url) {
			var query = url.split('?')[1];
			expect(query.indexOf('id=34242') !== -1).toBeTruthy();
			expect(query.indexOf('tags=tag1') !== -1).toBeTruthy();
			expect(query.indexOf('tags=tag2') !== -1).toBeTruthy();
			expect(query.indexOf('title=weee+blah') !== -1).toBeTruthy();
			return true;
		}).respond(true);
		$http.get(UtilProvider.buildUrl(base, params));
		$httpBackend.flush();
	}));

	it('Check that parseQueryString works', inject(function (UtilProvider, $http, $httpBackend) {
		var params = {id: '34242', tags: ['tag1', 'tag2'], title: 'weee blah'};
		$httpBackend.when('GET', function (url) {
			expect(UtilProvider.parseQuery(url.split('?')[1])).toEqual(params);
			return true;
		}).respond(true);
		$http.get(base+'?id=34242&tags=tag1&tags=tag2&title=weee%20blah');
		$httpBackend.flush();
	}));
});