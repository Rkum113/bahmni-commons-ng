describe("AppService", function () {

    var $http, $q, sessionService, $rootScope, mergeService, loadConfigService, messagingService, $translate;
    var response;

    beforeEach(module('bahmni.common.appFramework'));
    beforeEach(module(function ($provide) {

        loadConfigService = jasmine.createSpyObj('loadConfigService', ['loadConfig']);
        $http = jasmine.createSpyObj('$http', ['get']);
        $q = jasmine.createSpyObj('$q', ['defer']);
        sessionService = jasmine.createSpyObj('sessionService', ['get']);
        $rootScope = jasmine.createSpyObj('$rootScope', ['$on']);
        mergeService = jasmine.createSpyObj('mergeService', ['merge']);
        messagingService = jasmine.createSpyObj('messagingService', ['showMessage']);
        $translate = jasmine.createSpyObj('$translate', ['instant']);

        $provide.value('loadConfigService', loadConfigService);
        $provide.value('$http', $http);
        $provide.value('$q', $q);
        $provide.value('sessionService', sessionService);
        $provide.value('$rootScope', $rootScope);
        $provide.value('mergeService', mergeService);
        $provide.value('messagingService', messagingService);
        $provide.value('$translate', $translate);
    }));

    beforeEach(function () {
        response = {
            data: {
                Bahmni: {
                    Common: {
                        Constants: {openmrsUrl: "/NewOpenMRS", currentUser: "bahmni.newuser"}
                    },
                    Registration: {
                        Constants: {homeUrl: "/NewHome"}
                    }
                }

            }
        };
    });

    afterEach(function () {
        Bahmni.Common.Constants.baseUrl = '/bahmni_config/openmrs/apps/';
        Bahmni.Common.Constants.openmrsUrl = '/openmrs';
        Bahmni.Common.Constants.currentUser = 'bahmni.user';
        Bahmni.Registration.Constants.homeUrl = '../home';
    });

    var promiseFor = function (response, error) {
        return {
            then: function (responseCallback, errorCallback) {
                if (response) responseCallback(response);
                else errorCallback(error);
            }
        }
    };

    describe('overrideConstants', function () {
        it('should override constants for all modules defined in config', inject(['appService', function (appService) {
            loadConfigService.loadConfig.and.returnValue(promiseFor(response));

            expect(Bahmni.Common.Constants.openmrsUrl).toEqual('/openmrs');
            expect(Bahmni.Common.Constants.currentUser).toEqual('bahmni.user');
            expect(Bahmni.Registration.Constants.homeUrl).toEqual('../home');

            appService.overrideConstants();

            expect(loadConfigService.loadConfig).toHaveBeenCalledWith('/bahmni_config/openmrs/apps/overridden-constants.json');
            expect(Bahmni.Common.Constants.openmrsUrl).toEqual("/NewOpenMRS");
            expect(Bahmni.Common.Constants.currentUser).toEqual('bahmni.newuser');
            expect(Bahmni.Registration.Constants.homeUrl).toEqual("/NewHome");

        }]));

        it('should not create new constants', inject(['appService', function (appService) {
            response.data.Bahmni.Registration.Constants.newKey = "SomeValue";

            loadConfigService.loadConfig.and.returnValue(promiseFor(response));
            expect(Bahmni.Registration.Constants.newKey).toBeUndefined();

            appService.overrideConstants();

            expect(loadConfigService.loadConfig).toHaveBeenCalledWith('/bahmni_config/openmrs/apps/overridden-constants.json');
            expect(Bahmni.Registration.Constants.newKey).toBeUndefined();

        }]));
        it('should ignore if the config file doesn\'t exist', inject(['appService', function (appService) {
            loadConfigService.loadConfig.and.returnValue(promiseFor(undefined, {status: 404}));

            expect(Bahmni.Common.Constants.openmrsUrl).toEqual('/openmrs');
            expect(Bahmni.Common.Constants.currentUser).toEqual('bahmni.user');
            expect(Bahmni.Registration.Constants.homeUrl).toEqual('../home');

            appService.overrideConstants();

            expect(loadConfigService.loadConfig).toHaveBeenCalledWith('/bahmni_config/openmrs/apps/overridden-constants.json');
            expect(Bahmni.Common.Constants.openmrsUrl).toEqual('/openmrs');
            expect(Bahmni.Common.Constants.currentUser).toEqual('bahmni.user');
            expect(Bahmni.Registration.Constants.homeUrl).toEqual('../home');

        }]));

        it('should not override constant Bahmni.Common.Constant.baseUrl', inject(['appService', function (appService) {
            response.data.Bahmni.Common.Constants.baseUrl = "/newbase";
            loadConfigService.loadConfig.and.returnValue(promiseFor(response));

            expect(Bahmni.Common.Constants.baseUrl).toEqual('/bahmni_config/openmrs/apps/');

            appService.overrideConstants();

            expect(loadConfigService.loadConfig).toHaveBeenCalledWith('/bahmni_config/openmrs/apps/overridden-constants.json');
            expect(Bahmni.Common.Constants.baseUrl).toEqual('/bahmni_config/openmrs/apps/');
        }]));
    });

});
