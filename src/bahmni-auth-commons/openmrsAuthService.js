'use strict';

angular.module('authentication')
    .service('openMRSAuthService', ['$rootScope', '$q', 'sessionService', '$bahmniCookieStore',
        function ($rootScope, $q, sessionService, $bahmniCookieStore) {
            return {
                populateLoginDetails: function () {
                    var usernamePromise = sessionService.get('?v=custom:(uuid,username)')
                        .then(function (response) {
                            if (response.data.authenticated) {
                                var username = response.data.user.username;
                                var cookieOptions = {path: '/', expires: 7};
                                $bahmniCookieStore.put(Bahmni.Common.Constants.currentUser, username, cookieOptions);
                            } else {
                                $rootScope.$broadcast('event:auth-loginRequired');
                            }
                        });

                    var loginLocationPromise = sessionService.fetchLoginLocation()
                        .then(function (response) {
                            if (response.data.authenticated && response.data.sessionLocation) {
                                var location = response.data.sessionLocation;
                                var locationCookie = {name: location.display, uuid: location.uuid};
                                $bahmniCookieStore.put(Bahmni.Common.Constants.locationCookieName, locationCookie, {
                                    path: '/',
                                    expires: 7
                                });
                            } else {
                                $rootScope.$broadcast('event:auth-loginRequired');
                            }
                        });
                    return $q.all([usernamePromise, loginLocationPromise]);
                }
            }
        }]);
