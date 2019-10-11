'use strict';

describe('mergeLocaleFilesService', function () {

    var mergeLocaleFilesService, mergeService;
    var _$http, appService, openMRSHelperService;
    var baseFile = {"KEY1" : "This is base key"};
    var customFile = {"KEY1" : "This is custom key"};

    beforeEach(function(){
        module('bahmni.common.i18n');
        module('bahmni.common.util');
        module('bahmni.common.appFramework');
        module(function ($provide){
            _$http = jasmine.createSpyObj('$http', ['get']);
            appService = jasmine.createSpyObj('appService', ['overrideConstants']);
            openMRSHelperService = jasmine.createSpyObj('openMRSHelperService', ['overrideConfigUrlForOpenMRS']);
            $provide.value('$http', _$http);
            $provide.value('$q', Q);
            $provide.value('appService', appService);
            $provide.value('openMRSHelperService', openMRSHelperService);
        });

        inject(function (_mergeLocaleFilesService_, _mergeService_) {
            mergeLocaleFilesService = _mergeLocaleFilesService_;
            mergeService = _mergeService_;
        });
    });

    let fakePromise = function () {
        return {
            then: function (responseCallback) {
                return responseCallback();
            }
        };
    };

    it('merge when both base, custom configs are there', function(done){
        openMRSHelperService.overrideConfigUrlForOpenMRS.and.returnValue(fakePromise());
        appService.overrideConstants.and.returnValue(fakePromise());

        _$http.get.and.callFake(function(param) {
            if(param.indexOf('bahmni_config') != -1)
                return specUtil.createFakePromise(customFile);
            else
                return specUtil.createFakePromise(baseFile);
        });


        var promise = mergeLocaleFilesService({app: 'clinical', shouldMerge: true, key: 'en'});

        promise.then(function(response) {
            expect(response.data).toEqual(customFile);
            expect(openMRSHelperService.overrideConfigUrlForOpenMRS).toHaveBeenCalled();
            expect(appService.overrideConstants).toHaveBeenCalled();
            done();
        });
    });

    it('return both base, custom locales when shouldMerge is false', function(done){
        openMRSHelperService.overrideConfigUrlForOpenMRS.and.returnValue(fakePromise());
        appService.overrideConstants.and.returnValue(fakePromise());

        _$http.get.and.callFake(function(param) {
            if(param.indexOf('bahmni_config') != -1)
                return specUtil.createFakePromise(customFile);
            else
                return specUtil.createFakePromise(baseFile);
        });

        var promise = mergeLocaleFilesService({app: 'clinical', shouldMerge: false, key: 'en'});

        promise.then(function(response) {
            expect([response[0].data, response[1].data]).toEqual([ baseFile, customFile ]);
            expect(openMRSHelperService.overrideConfigUrlForOpenMRS).toHaveBeenCalled();
            expect(appService.overrideConstants).toHaveBeenCalled();
            done();
        });
    });
});