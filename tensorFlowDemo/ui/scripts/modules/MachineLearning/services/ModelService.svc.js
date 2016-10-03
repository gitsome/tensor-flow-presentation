(function () {

    angular.module('MachineLearning').service('ModelService', [

        '$rootScope',

        function ($rootScope) {

            /*============ SERVICE DECLARATION ============*/

            var ModelService = {};


            /*============ PRIVATE METHODS AND VARIABLES ============*/

            var data = false;


            /*============ SERVICE DEFINITION ============*/

            ModelService.initialize = function (data_in) {
                data = data_in;
            };


            /*============ LISTENERS ============*/

            /*============ SERVICE PASSBACK ============*/

            return ModelService;

        }
    ]);

})();