'use strict';

describe("OpenMRSAuthService", function () {
    var sessionService, openMRSAuthService, $bahmniCookieStore, $q, $translate;

    beforeEach(module('authentication'));
    beforeEach(module(function ($provide) {
        $bahmniCookieStore = jasmine.createSpyObj('$bahmniCookieStore', ['get', 'put', 'remove']);
        $translate = jasmine.createSpyObj('$translate', ['use']);
        $q = jasmine.createSpyObj('$q', ['all']);
        sessionService = jasmine.createSpyObj('sessionService', ['get', 'fetchLoginLocation']);

        $provide.value('$bahmniCookieStore', $bahmniCookieStore);
        $provide.value('$translate', $translate);
        $provide.value('sessionService', sessionService);
        $provide.value('$q', $q);
    }));

    describe("populateLoginDetails", function () {
        it("should set username, locale and login location in cookies", inject(['sessionService', '$rootScope', 'openMRSAuthService', function (sessionService, $rootScope, openMRSAuthService) {
            function promiseFor(responseData) {
                return {
                    then: function (callback) {
                        callback(responseData);
                    }
                };
            }

            var fakeSessionPromise = promiseFor({data: {authenticated: true, locale:'en_GB', user: {username: 'abc'}}});
            var fakeLoginLocationPromise = promiseFor({data: {authenticated: true, sessionLocation: {display: 'abc', uuid: '123'}}});
            sessionService.get.and.returnValue(fakeSessionPromise);
            sessionService.fetchLoginLocation.and.returnValue(fakeLoginLocationPromise);

            openMRSAuthService.populateLoginDetails();

            expect(sessionService.get).toHaveBeenCalledWith('?v=custom:(uuid,username)');
            expect(sessionService.fetchLoginLocation).toHaveBeenCalled();

            expect($bahmniCookieStore.put).toHaveBeenCalledWith('bahmni.user', 'abc', {path: '/', expires: 7});
            expect($bahmniCookieStore.put).toHaveBeenCalledWith('bahmni.user.location', {name:'abc', uuid:'123'}, {path: '/', expires: 7});
            expect($translate.use).toHaveBeenCalledWith('en_GB');
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