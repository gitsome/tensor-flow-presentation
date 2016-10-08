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

            var deleteScheme = function (schemeToDelete) {
                var deferred = $q.defer();

                $timeout(function () {

                    var foundIndex = -1;

                    _.each(schemes, function (scheme, i) {
                        if (scheme.name === schemeToDelete.name) {
                            foundIndex = i;
                        }
                    });

                    if (foundIndex !== -1) {
                        schemes.splice(foundIndex, 1);
                    }
                    deferred.resolve();

                }, Math.round(Math.random()*400));

                return deferred.promise;
            };

            var saveData = function () {
                var deferred = $q.defer();

                $timeout(function () {
                    deferred.resolve();
                }, 1000);

                return deferred.promise;
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
                return deleteScheme(scheme);
            };

            SchemeService.saveData = function (data) {
                return saveData(data);
            };


            /*============ LISTENERS ============*/

            /*============ SERVICE PASSBACK ============*/

            return SchemeService;

        }
    ]);

})();