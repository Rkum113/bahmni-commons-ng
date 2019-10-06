'use strict';

describe("OpenMRSAuthService", function () {
    var sessionService, openMRSAuthService, $bahmniCookieStore, $q, rootScope;

    beforeEach(module('authentication'));
    beforeEach(module(function ($provide) {
        $bahmniCookieStore = jasmine.createSpyObj('$bahmniCookieStore', ['get', 'put', 'remove']);
        $q = jasmine.createSpyObj('$q', ['all']);
        sessionService = jasmine.createSpyObj('sessionService', ['get', 'fetchLoginLocation']);

        $provide.value('$bahmniCookieStore', $bahmniCookieStore);
        $provide.value('sessionService', sessionService);
        $provide.value('$q', $q);
    }));

    // beforeEach(inject(function($injector) {
    //     rootScope = $injector.get('$rootScope');
    //     spyOn(rootScope, '$broadcast');
    // }));


    describe("populateLoginDetails", function () {
        it("should set username and login location in cookies", inject(['sessionService', '$rootScope', 'openMRSAuthService', function (sessionService, $rootScope, openMRSAuthService) {
            function promiseFor(responseData) {
                return {
                    then: function (callback) {
                        callback(responseData);
                    }
                };
            }

            var fakeSessionPromise = promiseFor({data: {authenticated: true, user: {username: 'abc'}}});
            var fakeLoginLocationPromise = promiseFor({data: {authenticated: true, sessionLocation: {display: 'abc', uuid: '123'}}});
            sessionService.get.and.returnValue(fakeSessionPromise);
            sessionService.fetchLoginLocation.and.returnValue(fakeLoginLocationPromise);

            openMRSAuthService.populateLoginDetails();

            expect(sessionService.get).toHaveBeenCalledWith('?v=custom:(uuid,username)');
            expect(sessionService.fetchLoginLocation).toHaveBeenCalled();

            expect($bahmniCookieStore.put).toHaveBeenCalledWith('bahmni.user', 'abc', {path: '/', expires: 7});
            expect($bahmniCookieStore.put).toHaveBeenCalledWith('bahmni.user.location', {name:'abc', uuid:'123'}, {path: '/', expires: 7});
        }]));

        it("should set error when not authenticated", inject(['sessionService', '$rootScope', 'openMRSAuthService', function (sessionService, $rootScope, openMRSAuthService) {
            function promiseFor(responseData) {
                return {
                    then: function (callback) {
                        callback(responseData);
                    }
                };
            }

            spyOn($rootScope, '$broadcast');
            var fakeSessionPromise = promiseFor({data: {authenticated: false}});
            var fakeLoginLocationPromise = promiseFor({data: {authenticated: true, sessionLocation: {display: 'abc', uuid: '123'}}});
            sessionService.get.and.returnValue(fakeSessionPromise);
            sessionService.fetchLoginLocation.and.returnValue(fakeLoginLocationPromise);

            openMRSAuthService.populateLoginDetails();

            expect($rootScope.$broadcast).toHaveBeenCalledWith('event:auth-loginRequired');
        }]));

        it("should set error when location is not set", inject(['sessionService', '$rootScope', 'openMRSAuthService', function (sessionService, $rootScope, openMRSAuthService) {
            function promiseFor(responseData) {
                return {
                    then: function (callback) {
                        callback(responseData);
                    }
                };
            }

            spyOn($rootScope, '$broadcast');
            var fakeSessionPromise = promiseFor({data: {authenticated: true, user: {username: 'abc'}}});
            var fakeLoginLocationPromise = promiseFor({data: {authenticated: true, sessionLocation: null}});
            sessionService.get.and.returnValue(fakeSessionPromise);
            sessionService.fetchLoginLocation.and.returnValue(fakeLoginLocationPromise);

            openMRSAuthService.populateLoginDetails();

            expect($rootScope.$broadcast).toHaveBeenCalledWith('event:auth-loginRequired');
        }]));
    });
});