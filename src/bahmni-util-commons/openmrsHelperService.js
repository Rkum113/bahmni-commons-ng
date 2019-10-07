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
                    }
                    else{
                        defer.reject(err.message);
                    }
                };
                let onData = (response) => {
                    if (response.data && response.data.value){
                        let value = response.data.value.trim();
                        defer.resolve(value.toLowerCase() === "true")
                    }else{
                        defer.resolve(false);
                    }
                };
                runningOnOpenMRSPromise.then(onData, onError);
                return defer.promise;
            };

            return {
                isRunningOnOpenMRS: isRunningOnOpenMRS
            };
        }]);
