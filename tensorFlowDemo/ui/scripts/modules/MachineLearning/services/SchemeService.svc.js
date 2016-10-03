(function () {

    angular.module('MachineLearning').service('SchemeService', [

        '$rootScope',
        '$q',
        '$timeout',

        function ($rootScope, $q, $timeout) {

            /*============ SERVICE DECLARATION ============*/

            var SchemeService = {};


            /*============ PRIVATE METHODS AND VARIABLES ============*/

            var schemes = [];

            var updateOrCreateScheme = function (scheme) {
                var deferred = $q.defer();

                $timeout(function () {

                    schemes.push(scheme);
                    deferred.resolve(scheme);

                }, Math.round(Math.random()*400));

                return deferred.promise;
            };

            var deleteScheme = function () {

            };


            /*============ SERVICE DEFINITION ============*/

            SchemeService.initialize = function (schemes_in) {
                schemes = schemes_in;
            };

            SchemeService.get = function () {
                return schemes;
            };

            SchemeService.updateOrCreateScheme = function (scheme) {
                return updateOrCreateScheme(scheme);
            };

            SchemeService.deleteScheme = function (scheme) {
                deleteScheme(scheme);
            };


            /*============ LISTENERS ============*/

            /*============ SERVICE PASSBACK ============*/

            return SchemeService;

        }
    ]);

})();