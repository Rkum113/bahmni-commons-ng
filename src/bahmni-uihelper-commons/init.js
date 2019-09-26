angular
    .module('bahmni.common.uiHelper', ['ngClipboard'])
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put('ui-helper-error', require("./error.html"));
        $templateCache.put('ui-helper-header', require("./header.html"));
        $templateCache.put('ui-helper-messages', require("./messages.html"));
        $templateCache.put('ui-helper-save-confirmation', require("./views/saveConfirmation.html"));
        $templateCache.put('ui-helper-confirm-box', require("./views/confirmBox.html"));
    }]);

require("./printer");
require("./spinner");
require("./directives");

require("./services/backlinkService");
require("./services/confirmBoxService");
require("./services/contextChangeHandler");
require("./services/messagingService");
require("./services/stateChangeSpinner");

require("./filters/dateFilters");
require("./filters/formatDecimalValues");
require("./filters/reverse");
require("./filters/thumbnail");

require("./directives/backLinks");
require("./directives/bahmniAutocomplete");

require("./controllers/messageController");