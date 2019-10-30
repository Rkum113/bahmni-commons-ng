angular.module('bahmni.common.appFramework', ['authentication']);

window.Bahmni = window.Bahmni || {};
Bahmni.Common = Bahmni.Common || {};
Bahmni.Common.AppFramework = Bahmni.Common.AppFramework || {};

require("./services/appService")
require("./services/mergeService")
require("./directives/appExtensionList")
require("./models/appDescriptor")
require("./services/loadConfigService")