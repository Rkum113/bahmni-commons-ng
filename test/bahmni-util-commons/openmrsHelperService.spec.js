'use strict';

describe("OpenMRSHelperService", function () {
    var openMRSHelperService, $q, $http;

    beforeEach(module('bahmni.common.util'));
    beforeEach(module(function ($provide) {
        $q = jasmine.createSpyObj('$q', ['defer', 'resolve', 'reject']);
        $http = jasmine.createSpyObj('$http', ['get']);

        $provide.value('$http', $http);
        $provide.value('$q', $q);

        Bahmni.Common.Constants.baseUrl = "/bahmni_config/openmrs/apps";
    }));

    let promiseFor = function (responseData, errorData) {
        return {
            then: function (responseCallback, errorCallback) {
                if (responseData) responseCallback(responseData);
                else errorCallback(errorData);
            }
        };
    };

    describe("isRunningOnOpenMRS", function () {
        it("should give true when system setting exist and set to true", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            $http.get.and.returnValue(promiseFor({data: {value: "TRUE "}}));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.isRunningOnOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting/bahmni.appointments.runningOnOpenmrs');
            expect(deferrable.resolve).toHaveBeenCalledWith(true);
        }]));

        it("should give false when system setting exist and not set", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            $http.get.and.returnValue(promiseFor({data: {value: ""}}));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.isRunningOnOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting/bahmni.appointments.runningOnOpenmrs');
            expect(deferrable.resolve).toHaveBeenCalledWith(false);
        }]));

        it("should give false when system setting exist and set to false", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            $http.get.and.returnValue(promiseFor({data: {value: "false "}}));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.isRunningOnOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting/bahmni.appointments.runningOnOpenmrs');
            expect(deferrable.resolve).toHaveBeenCalledWith(false);
        }]));

        it("should give false when system setting exist and set to a random value", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            $http.get.and.returnValue(promiseFor({data: {value: "Random "}}));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.isRunningOnOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting/bahmni.appointments.runningOnOpenmrs');
            expect(deferrable.resolve).toHaveBeenCalledWith(false);
        }]));

        it("should give false when system setting does not exist", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            $http.get.and.returnValue(promiseFor(undefined, {status: 404, message: "Not Exist"}));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.isRunningOnOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting/bahmni.appointments.runningOnOpenmrs');
            expect(deferrable.resolve).toHaveBeenCalledWith(false);
        }]));

        it("should give error when there is unexpected response from server", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            $http.get.and.returnValue(promiseFor(undefined, {status: 500, message: "Something went wrong"}));

            let deferrable = jasmine.createSpyObj('deferrable', ['reject']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.isRunningOnOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting/bahmni.appointments.runningOnOpenmrs');
            expect(deferrable.reject).toHaveBeenCalledWith("Something went wrong");
        }]));
    });

    describe("fetchConfigUrlForOpenMRS", function () {
        it("should change bahmni base url when system setting is populated", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            expect(Bahmni.Common.Constants.baseUrl).toEqual("/bahmni_config/openmrs/apps");
            $http.get.and.returnValue(promiseFor({data: {value: "/openmrs/config"}}));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.overrideConfigUrlForOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting/bahmni.config.baseUrlForUIConfigs');
            expect(Bahmni.Common.Constants.baseUrl).toEqual("/openmrs/config");
            expect(deferrable.resolve).toHaveBeenCalled();
        }]));

        it("should not change bahmni base url when system setting is not populated", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            expect(Bahmni.Common.Constants.baseUrl).toEqual("/bahmni_config/openmrs/apps");
            $http.get.and.returnValue(promiseFor({data: {value: ""}}));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.overrideConfigUrlForOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting/bahmni.config.baseUrlForUIConfigs');
            expect(Bahmni.Common.Constants.baseUrl).toEqual("/bahmni_config/openmrs/apps");
            expect(deferrable.resolve).toHaveBeenCalled();
        }]));
    });

});