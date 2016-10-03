(function () {

    angular.module('MachineLearning').directive('mlSchemeTransform', function () {

        return {

            restrict: 'E',

            scope: {
                transform: '='
            },

            controller: [

                '$scope',
                '$element',

                function ($scope, $element) {

                    /*============ MODEL ============*/


                    /*============ MODEL DEPENDENT METHODS ============*/

                    var notifyChange = function () {
                        $scope.$emit('ml-scheme-transform.scriptChanged', $scope.transform);
                    };

                    var debounced_notifyChange = _.debounce(function () {
                        notifyChange();
                        $scope.$apply();
                    }, 100);



                    /*============ BEHAVIOR ============*/

                    $scope.edit = function () {
                        $scope.$emit('ml-scheme-item.edit', $scope.scheme);
                    };

                    $scope.delete = function () {
                        $scope.$emit('ml-scheme-item.delete', $scope.scheme);
                    };


                    /*============ LISTENERS ============*/

                    $scope.$watch('transform.script', debounce_notifyChange);


                    /*============ INITIALIZATION ============*/

                }
            ],

            template: [

                '<div class="container-fluid">',

                    '<div class="row">',
                        '<div class="col-md-10">',
                            '<textarea ng-model="scheme.script" rows="5"></textarea>',
                        '</div>',
                        '<div class="col-md-2 text-right ml-scheme-item-controls">',
                            '<button class="btn btn-default btn-full-width" ng-click="delete()"><i class="fa fa-times-circle"></i></button>',
                        '</div>',
                    '</div>',

                '</div>'

            ].join('')
        };
    });

})();