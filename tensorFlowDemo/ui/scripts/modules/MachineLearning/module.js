
var sessionConfigs = sessionConfigs || {};

(function(){

    /*========== ENTRY POINT ON DOCUMENT READY FROM THE MAIN TEMPLATE ============*/

    angular.module('MachineLearning', [
        'ngResource', 'ngCookies', 'ngSanitize', 'ngAnimate',   // angular modules
        'ui.router'                                             // angular-ui modules
    ]);


    /*======================== LOAD VALUES/CONSTANTS ========================*/




    /*======================== LOAD CONFIGURATIONS ========================*/

    // ANIMATION CONFIGS
    angular.module('MachineLearning').config(function($provide, $animateProvider){

        // do not animate classes which match this pattern
        // so if you don't want animations... include noanim in the classname
        $animateProvider.classNameFilter(/^((?!noanim).)*$/i);
    });

    // INITIALIZE DATA FROM SERVER
    angular.module('MachineLearning').config(function($locationProvider, $stateProvider, $urlRouterProvider){

        $locationProvider.html5Mode(true);

        // if there are no url matches, then just go home
        $urlRouterProvider.otherwise("/");
    });


    /*======================== INITIALIZATION ========================*/

    // initialize the data
    angular.module('MachineLearning').run(function(SchemeService) {
        SchemeService.initialize(sessionConfigs.schemes);
    });

})();
