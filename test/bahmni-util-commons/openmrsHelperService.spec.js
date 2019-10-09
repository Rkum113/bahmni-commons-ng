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

    let promiseFor = function (responseData) {
        return {
            then: function (responseCallback) {
                responseCallback(responseData);
            }
        };
    };

    describe("isRunningOnOpenMRS", function () {
        it("should give true when system setting exist and set to true", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            let responseData = {
                data: {
                    "results": [
                        {
                            "property": "bahmni.appointments.runningOnOpenMRS",
                            "value": "TRUE "
                        }
                    ]
                }
            };
            $http.get.and.returnValue(promiseFor(responseData));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.isRunningOnOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting?q=bahmni.appointments.runningOnOpenmrs&v=custom:(property,value)');
            expect(deferrable.resolve).toHaveBeenCalledWith(true);
        }]));

        it("should give false when system setting exist and not set", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            let responseData = {
                data: {
                    "results": [
                        {
                            "property": "bahmni.appointments.runningOnOpenMRS",
                            "value": null
                        }
                    ]
                }
            };
            $http.get.and.returnValue(promiseFor(responseData));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.isRunningOnOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting?q=bahmni.appointments.runningOnOpenmrs&v=custom:(property,value)');
            expect(deferrable.resolve).toHaveBeenCalledWith(false);
        }]));

        it("should give false when system setting exist and set to false", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            let responseData = {data:{
                    "results": [
                        {
                            "property": "bahmni.appointments.runningOnOpenMRS",
                            "value": "false "
                        }
                    ]
                }};
            $http.get.and.returnValue(promiseFor(responseData));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.isRunningOnOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting?q=bahmni.appointments.runningOnOpenmrs&v=custom:(property,value)');
            expect(deferrable.resolve).toHaveBeenCalledWith(false);
        }]));

        it("should give false when system setting exist and set to a random value", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            let responseData = {data:{
                    "results": [
                        {
                            "property": "bahmni.appointments.runningOnOpenMRS",
                            "value": "Random "
                        }
                    ]
                }};
            $http.get.and.returnValue(promiseFor(responseData));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.isRunningOnOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting?q=bahmni.appointments.runningOnOpenmrs&v=custom:(property,value)');
            expect(deferrable.resolve).toHaveBeenCalledWith(false);
        }]));

        it("should give false when system setting does not exist", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            let responseData = {data:{"results": []}};
            $http.get.and.returnValue(promiseFor(responseData));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.isRunningOnOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting?q=bahmni.appointments.runningOnOpenmrs&v=custom:(property,value)');
            expect(deferrable.resolve).toHaveBeenCalledWith(false);
        }]));
    });

    describe("fetchConfigUrlForOpenMRS", function () {
        it("should change bahmni base url when system setting is populated", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            expect(Bahmni.Common.Constants.baseUrl).toEqual("/bahmni_config/openmrs/apps");
            let data = {data:{
                    "results": [
                        {
                            "property": "bahmni.config.baseUrlForUIConfigs",
                            "value": "/openmrs/config"
                        }
                    ]
                }};

            $http.get.and.returnValue(promiseFor(data));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.overrideConfigUrlForOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting?q=bahmni.config.baseUrlForUIConfigs&v=custom:(property,value)');
            expect(Bahmni.Common.Constants.baseUrl).toEqual("/openmrs/config");
            expect(deferrable.resolve).toHaveBeenCalled();
        }]));

        it("should not change bahmni base url when system setting is not populated", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            expect(Bahmni.Common.Constants.baseUrl).toEqual("/bahmni_config/openmrs/apps");
            let data = {data:{
                    "results": [{
                        "property": "bahmni.config.baseUrlForUIConfigs",
                        "value": null
                    }
                    ]
                }};
            $http.get.and.returnValue(promiseFor(data));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.overrideConfigUrlForOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting?q=bahmni.config.baseUrlForUIConfigs&v=custom:(property,value)');
            expect(Bahmni.Common.Constants.baseUrl).toEqual("/bahmni_config/openmrs/apps");
            expect(deferrable.resolve).toHaveBeenCalled();
        }]));

        it("should not change bahmni base url when system setting doesn't exist", inject(['$q', '$http', 'openMRSHelperService', function ($q, $http, openMRSHelperService) {
            expect(Bahmni.Common.Constants.baseUrl).toEqual("/bahmni_config/openmrs/apps");
            let data = {data:{"results": []}};
            $http.get.and.returnValue(promiseFor(data));

            let deferrable = jasmine.createSpyObj('deferrable', ['resolve']);
            $q.defer.and.returnValue(deferrable);

            openMRSHelperService.overrideConfigUrlForOpenMRS();

            expect($http.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/systemsetting?q=bahmni.config.baseUrlForUIConfigs&v=custom:(property,value)');
            expect(Bahmni.Common.Constants.baseUrl).toEqual("/bahmni_config/openmrs/apps");
            expect(deferrable.resolve).toHaveBeenCalled();
        }]));
    });

});