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
#### Test framework setup
The test are being run against the generated bundles. Since these bundles need all the dependencies to be present and loaded before the bundle, the dependencies are included in `files` section of `karma-config` in `karma.config.js`.

* Every folder with pattern `test/bahmni-<modulename>-commons` contains tests for their source folders.
* The `test/lib` folder will contain any custom library required by bundles. As of now, It contains a manually edited version jquery.cookie@1.4.1. The line 12 is changed to `define(['jquery/jquery'], factory);` instead of `define(['jquery'], factory);` because jquery `1.x` is not fully compatible with webpack.
 [Reference link](https://github.com/facebook/create-react-app/issues/679#issuecomment-247928334)
* The `test/support` folder will contain helper files for tests.
* The `init-constants.js` file contains specific constants needed by the bundles like `openmrs-base-url`.   