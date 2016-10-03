(function () {

    angular.module('MachineLearning').directive('mlMain', function () {

        return {

            restrict: 'E',

            scope: {},

            controller: [

                '$scope',
                '$element',

                function ($scope, $element) {

                    /*============ MODEL ============*/

                    /*============ MODEL DEPENDENT METHODS ============*/

                    /*============ BEHAVIOR ============*/

                    /*============ LISTENERS ============*/

                    /*============ INITIALIZATION ============*/
                }
            ],

            template: [

                '<h1>Loading</h1>'

            ].join('')
        };
    });

})();