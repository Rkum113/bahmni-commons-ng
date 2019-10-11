'use strict';
window.Bahmni = window.Bahmni || {};
Bahmni.Common = Bahmni.Common || {};
Bahmni.Common.I18n = Bahmni.Common.I18n || {};

angular.module('bahmni.common.i18n', ['bahmni.common.appFramework', 'bahmni.common.util']);

require("./bahmni-translate");
require("./services/mergeLocaleFilesService");