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

                    $scope.mode = 'main';

                    $scope.currentScheme = false;


                    /*============ MODEL DEPENDENT METHODS ============*/

                    /*============ BEHAVIOR ============*/

                    /*============ LISTENERS ============*/

                    $scope.$on('ml-schemes.editScheme', function (e, scheme) {
                        $scope.currentScheme = scheme;
                        $scope.mode = 'edit';
                    });

                    $scope.$on('ml-schemes.deleteScheme', function (e, scheme) {
                        console.log("delete");
                    });

                    $scope.$on('ml-edit-scheme.done', function () {
                        $scope.mode = 'main';
                        $scope.currentScheme = false;
                    });


                    /*============ INITIALIZATION ============*/
                }
            ],

            template: [

                '<div class="container">',
                    '<div class="row">',
                        '<div class="col-xs-12">',

                            '<h1>Machine Learning Demo</h1>',

                            '<ml-schemes class="anim-fade-in" ng-if="mode === \'main\'"></ml-schemes>',
                            '<ml-edit-scheme class="anim-fade-in" scheme="currentScheme" ng-if="mode === \'edit\'"></ml-schemes>',

                        '</div>',
                    '</div>',
                '</div>'

            ].join('')
        };
    });

})();