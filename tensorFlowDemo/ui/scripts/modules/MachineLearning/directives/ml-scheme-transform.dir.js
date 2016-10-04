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
                    }, 800);



                    /*============ BEHAVIOR ============*/

                    $scope.edit = function () {
                        $scope.$emit('ml-scheme-transform.edit', $scope.transform);
                    };

                    $scope.delete = function () {
                        $scope.$emit('ml-scheme-transform.delete', $scope.transform);
                    };


                    /*============ LISTENERS ============*/

                    $scope.$watch('transform.script', debounced_notifyChange);


                    /*============ INITIALIZATION ============*/

                    new Behave({
                        textarea: $element.find('textarea')[0],
                        replaceTab: true
                    });
                }
            ],

            template: [

                '<div class="container-fluid">',

                    '<div class="row">',
                        '<div class="col-md-10">',
                            '<textarea ng-model="transform.script" rows="7"></textarea>',
                        '</div>',
                        '<div class="col-md-2 text-right ml-scheme-item-controls">',
                            '<button class="btn btn-default btn-full-width" ng-click="delete()"><i class="fa fa-times-circle"></i></button>',
                        '</div>',

                    '</div>',

                    '<div class="row">',
                        '<div class="col-xs-12">',
                            '<div class="ml-scheme-transform-error" ng-if="transform.error"><i class="fa fa-exclamation-triangle"></i> {{transform.error}}</div>',
                        '</div>',
                    '</div>',

                '</div>'

            ].join('')
        };
    });

})();