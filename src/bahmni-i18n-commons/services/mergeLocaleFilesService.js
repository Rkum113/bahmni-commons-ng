'use strict';

angular.module('bahmni.common.i18n')
    .service('mergeLocaleFilesService', ['$http', '$q', 'mergeService', 'openMRSHelperService', 'appService',
        function ($http, $q, mergeService, openMRSHelperService, appService) {
        return function (options) {
            var loadFile = function (url) {
                return $http.get(url, {withCredentials: true});
            };

            var mergeLocaleFile = function (options) {
                var fileURL = options.app + "/locale_" + options.key + ".json";

                var loadBahmniTranslations = function () {
                    return loadFile(Bahmni.Common.Constants.baseLocaleURL + fileURL).then(function (result) {
                        return result;
                    }, function () {
                        return;
                    });
                };
                var loadCustomTranslations = function () {
                    return loadFile(Bahmni.Common.Constants.customLocaleURL + fileURL).then(function (result) {
                        return result;
                    }, function () {
                        return;
                    });
                };

                var mergeTranslations = function (result) {
                    var baseFileData = result[0] ? result[0].data : undefined;
                    var customFileData = result[1] ? result[1].data : undefined;
                    if (options.shouldMerge || options.shouldMerge === undefined) {
                        return mergeService.merge(baseFileData, customFileData);
                    }
                    return [baseFileData, customFileData];
                };

                let loadTranslations = function () {
                    return $q.all([loadBahmniTranslations(), loadCustomTranslations()]);
                };

                return openMRSHelperService.overrideConfigUrlForOpenMRS()
                    .then(appService.overrideConstants)
                    .then(loadTranslations)
                    .then(mergeTranslations);
            };
            return mergeLocaleFile(options);
        };
    }]);
