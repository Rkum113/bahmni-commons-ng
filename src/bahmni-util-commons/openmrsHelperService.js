'use strict';

angular.module('bahmni.common.util')
    .service('openMRSHelperService', ['$http', '$q', function ($http, $q) {
        let isRunningOnOpenMRS = function () {
            let defer = $q.defer();
            let systemSettingUrl = Bahmni.Common.Constants.openMRSSystemSettingUrl;
            let params = '?q=bahmni.appointments.runningOnOpenmrs&v=custom:(property,value)';
            let runningOnOpenMRSPromise = $http.get(systemSettingUrl + params);
            runningOnOpenMRSPromise.then((response) => {
                let results = response.data.results;
                if (results && results.length > 0) {
                    let property = results[0];
                    if (property.value) {
                        let value = property.value.trim();
                        defer.resolve(value.toLowerCase() === "true")
                    } else {
                        defer.resolve(false);
                    }
                } else {
                    defer.resolve(false);
                }
            });
            return defer.promise;
        };


        return {
            isRunningOnOpenMRS: isRunningOnOpenMRS
        };
    }]);
