(function () {

    angular.module('MachineLearning').directive('mlSchemes', function () {

        return {

            restrict: 'E',

            scope: {
                scheme: '='
            },

            controller: [

                '$scope',
                '$element',
                '$timeout',
                'Moment',
                'SchemeService',

                function ($scope, $element, $timeout, Moment, SchemeService) {

                    /*============ MODEL ============*/

                    $scope.schemes = SchemeService.get();

                    $scope.creating = false;


                    /*============ MODEL DEPENDENT METHODS ============*/


                    /*============ BEHAVIOR ============*/

                    $scope.create = function () {

                        $scope.creating = true;

                        SchemeService.updateOrCreateScheme({
                            name: new Moment().format('MMMM Do YYYY, h:mm:ss a'),
                            transforms: []
                        }).then(function (newScheme) {

                            $scope.schemes = SchemeService.get();
                            $timeout(function () {
                                $scope.$emit('ml-schemes.editScheme', newScheme);
                            }, 1000);

                        }, function () {
                            $scope.creating = false;
                        });
                    };


                    /*============ LISTENERS ============*/

                    $scope.$on('ml-scheme-item.delete', function (e, scheme) {
                        $scope.$emit('ml-schemes.deleteScheme', scheme);
                    });

                    $scope.$on('ml-scheme-item.edit', function (e, scheme) {
                        $scope.$emit('ml-schemes.editScheme', scheme);
                    });


                    /*============ INITIALIZATION ============*/

                }
            ],

            template: [

                '<div class="row">',
                    '<div class="col-xs-12">',

                        '<div class="row view-title">',

                            '<div class="col-xs-7">',
                                '<h2>All Schemes</h2>',
                            '</div>',

                            '<div class="col-xs-5 text-right">',
                                '<button class="btn btn-primary" ng-click="create()" ng-disabled="creating">',
                                    '<i class="fa fa-magic noanim" ng-if="!creating"></i>',
                                    '<i class="fa fa-spin fa-spinner noanim" ng-if="creating"></i>',
                                    ' Create New Scheme',
                                '</button>',
                            '</div>',

                        '</div>',

                        '<div class="alert alert-info" ng-if="!schemes || !schemes.length"><i class="fa fa-info-circle"></i><strong>No Schemes Yet!</strong> Try refreshing or create a new scheme.</div>',

                        '<ml-scheme-item class="anim-el-slide-right" ng-repeat="scheme in schemes" ng-if="schemes && schemes.length" scheme="scheme" is-disabled="creating"></ml-scheme-item>',

                    '</div>',
                '</div>'

            ].join('')
        };
    });

})();