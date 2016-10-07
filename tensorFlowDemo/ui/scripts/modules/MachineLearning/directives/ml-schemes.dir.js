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
                'ML_VIEW_MODE',

                function ($scope, $element, $timeout, Moment, SchemeService, ML_VIEW_MODE) {

                    /*============ MODEL ============*/

                    $scope.schemesMode = 'view';

                    $scope.schemes = SchemeService.get();

                    $scope.loading = false;

                    $scope.allowEdit = ML_VIEW_MODE === 'edit';
                    $scope.allowTest = ML_VIEW_MODE === 'view';


                    /*============ MODEL DEPENDENT METHODS ============*/

                    var deleteScheme = function (schemeToDelete) {
                        $scope.loading = true;

                        SchemeService.deleteScheme(schemeToDelete).finally(function () {
                            $scope.loading = false;
                            $scope.schemes = SchemeService.get();
                        });
                    };


                    /*============ BEHAVIOR ============*/

                    $scope.create = function () {

                        $scope.loading = true;

                        SchemeService.updateOrCreateScheme({
                            name: new Moment().format('MMMM Do YYYY, h:mm:ss a'),
                            transforms: []
                        }).then(function (newScheme) {

                            $scope.schemes = SchemeService.get();
                            $timeout(function () {
                                $scope.$emit('ml-schemes.editScheme', newScheme);
                            }, 1000);

                        }, function () {
                            $scope.loading = false;
                        });
                    };

                    $scope.takeTest = function () {
                        $scope.schemesMode = 'test';
                    };


                    /*============ LISTENERS ============*/

                    $scope.$on('ml-scheme-item.delete', function (e, scheme) {
                        deleteScheme(scheme);
                    });

                    $scope.$on('ml-scheme-item.edit', function (e, scheme) {
                        $scope.$emit('ml-schemes.editScheme', scheme);
                    });

                    $scope.$on('ml-schemes-test.complete', function () {
                        $scope.schemesMode = 'view';
                    });



                    /*============ INITIALIZATION ============*/

                }
            ],

            template: [

                '<div class="row anim-fade-in" ng-if="schemesMode === \'view\'">',
                    '<div class="col-xs-12">',

                        '<div class="row view-title">',

                            '<div class="col-xs-7">',
                                '<h2>All Schemes</h2>',
                            '</div>',

                            '<div class="col-xs-5 text-right">',
                                '<button class="btn btn-primary" ng-if="allowEdit" ng-click="create()" ng-disabled="loading">',
                                    '<i class="fa fa-magic noanim" ng-if="!loading"></i>',
                                    '<i class="fa fa-spin fa-spinner noanim" ng-if="loading"></i>',
                                    ' Create New Scheme',
                                '</button>',
                            '</div>',

                        '</div>',

                        '<div class="alert alert-info" ng-if="!schemes || !schemes.length"><i class="fa fa-info-circle"></i> <strong>No Schemes Yet!</strong> Try refreshing or create a new scheme.</div>',

                        '<ml-scheme-item class="anim-el-slide-right" ng-repeat="scheme in schemes track by scheme.name" scheme="scheme" is-disabled="loading"></ml-scheme-item>',

                        '<div class="ml-schemes-test-container" ng-if="allowTest">',
                            '<button class="btn btn-primary btn-lg btn-full-width" ng-click="takeTest()"><i class="fa fa-check-circle"></i> Take the Test!</button>',
                        '</div>',

                    '</div>',
                '</div>',

                '<ml-schemes-test class="anim-fade-in" ng-if="schemesMode === \'test\'"></ml-schemes-test>'

            ].join('')
        };
    });

})();