'use strict';

angular.module('bahmni.common.util')
    .service('openMRSHelperService', ['$http', '$q', function ($http, $q) {
        let isRunningOnOpenMRS = function () {
            let defer = $q.defer();
            let systemSettingUrl = Bahmni.Common.Constants.openMRSSystemSettingUrl;
            let runningOnOpenMRSPromise = $http.get(systemSettingUrl + 'bahmni.appointments.runningOnOpenmrs');
            let onError = (err) => {
                if (err.status === 404) {
                    /*In case of Bahmni, Global property might not exist*/
                    defer.resolve(false);
                } else {
                    defer.reject(err.message);
                }
            };
            let onData = (response) => {
                if (response.data && response.data.value) {
                    let value = response.data.value.trim();
                    defer.resolve(value.toLowerCase() === "true")
                } else {
                    defer.resolve(false);
                }
            };
            runningOnOpenMRSPromise.then(onData, onError);
            return defer.promise;
        };

        let overrideConfigUrlForOpenMRS = function () {
            let defer = $q.defer();
            let systemSettingUrl = Bahmni.Common.Constants.openMRSSystemSettingUrl;
            let configUrlPromise = $http.get(systemSettingUrl + 'bahmni.config.baseUrlForUIConfigs');
            configUrlPromise.then((response) => {
                if (response.data && response.data.value) {
                    Bahmni.Common.Constants.baseUrl = response.data.value;
                    console.log("New config location set to: ", Bahmni.Common.Constants.baseUrl);
                } else {
                    console.log("No config location specified, using default bahmni config location", Bahmni.Common.Constants.baseUrl);
                }
                defer.resolve();
            });
            return defer.promise;
        };


        return {
            isRunningOnOpenMRS: isRunningOnOpenMRS,
            overrideConfigUrlForOpenMRS: overrideConfigUrlForOpenMRS
        };
    }]);
