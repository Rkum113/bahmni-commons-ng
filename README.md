# bahmni-commons-ng
This repository contains extracted common angular modules form [openmrs-module-bahmniapps](https://github.com/Bahmni/openmrs-module-bahmniapps).

### Setup 
```
git clone git@github.com:Bahmni/bahmni-commons-ng.git
cd bahmni-commons-ng
npm install
npm run bundle
```
Above steps will generate a dist folder with a output js file for each module.


### Project Structure
Below is the structure of project:
<pre>
|--src
    |-- module-1
        |-- init.js
        |-- views
        |-- directives
        |-- filters
        |-- components
        |-- services
    |-- module-2
        |-- init.js
        ....
    |.......	
    |-- module-n
        |-- init.js
        ....
|--test
    |-- module-1
    |-- module-2
    |.......	
    |-- module-n
|-- dist
|-- lib
|-- package.json
|-- webpack.config.json
|-- karma.config.js
</pre>
* All modules are present in `src` folder in the root of the project.
* By convention, every module should have an `init.js` file. This would be mentioned in the `entry` for the `webpack.config.js`.
* The key for the `entry` will be used to generate the bundled file.  
* The generated bundles will not have any dependencies included. These dependencies needs to be provided when using the bundles. 

### Running tests
* The unit are run using [Karma](https://karma-runner.github.io/latest/index.html).
* TO run the tests run:
    ```
    npm run test
    ```  

### Expose templates from a module
Right now there are two ways the templates are exposed from module.
* We can expose the template as part of a directive. E.g. `bahmni-patient-commons/directives/patientSummary.js` defines a directive `patientSummary` which exposes `patientSummary.html` template.
* The templates can be provided in the `$templateCache`. The applications using the bundles should look for these templates from `$templateCache` using the `key`. The `key` used to put the template must be documented. E.g. `ui-helper/init.js` exposes common templates which are used across components.

### Template Cache exposed by modules
| Module | Key in TemplateCache | Template Path |
| ------ | :-------------------:| ------------ |
| ui-helper | ui-helper-error | src/bahmni-uihelper-commons/error.html |
| ui-helper | ui-helper-header | src/bahmni-uihelper-commons/header.html |
| ui-helper | ui-helper-messages | src/bahmni-uihelper-commons/messages.html |
| ui-helper | ui-helper-save-confirmation | src/bahmni-uihelper-commons/views/saveConfirmation.html |
  
#### Test framework setup
The test are being run against the generated bundles. Since these bundles need all the dependencies to be present and loaded before the bundle, the dependencies are included in `files` section of `karma-config` in `karma.config.js`.

* Every folder with pattern `test/bahmni-<modulename>-commons` contains tests for their source folders.
* The `test/lib` folder will contain any custom library required by bundles. As of now, It contains a manually edited version jquery.cookie@1.4.1. The line 12 is changed to `define(['jquery/jquery'], factory);` instead of `define(['jquery'], factory);` because jquery `1.x` is not fully compatible with webpack.
 [Reference link](https://github.com/facebook/create-react-app/issues/679#issuecomment-247928334)
* The `test/support` folder will contain helper files for tests.
* The `init-constants.js` file contains specific constants needed by the bundles like `openmrs-base-url`.

#### Troubleshooting
* While importing a new module, if we face a problem of `[$injector:unpr] Unknown provider:` followed by something like `eProvider <- e`, most likely the cause is not using inline array annotation for dependency injection. See `Inline Array Annotation and Implicit Annotation` sections of https://docs.angularjs.org/guide/di.
  When we use the implicit DI, the variables gets minified while bundling and angular cannot inject these new minified variables. To fix this problem change the affected controller/service/filter/etc to use  inline array annotation of DI. 

  E.g:
  Below code will fail, when using as `webpack production` bundle
  ```
      controller: function ($scope, backlinkService) {
      }
  ```
  Above can be written as      
  ```
        controller: ['$scope', 'backlinkService', function ($scope, backlinkService) {
        }
    ```