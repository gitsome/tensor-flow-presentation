(function () {

    angular.module('MachineLearning').directive('mlEditScheme', function () {

        return {

            restrict: 'E',

            scope: {
                scheme: '='
            },

            controller: [

                '$scope',
                '$element',

                function ($scope, $element) {

                    /*============ MODEL ============*/

                    $scope.transformedExamples = [];


                    /*============ MODEL DEPENDENT METHODS ============*/

                    var debounced_updateTransformedExamples = _.debounce(function () {
                        updateTransformedExamples();
                        $scope.$apply();
                    }, 100);


                    /*============ BEHAVIOR ============*/

                    $scope.done = function () {
                        $scope.$emit('ml-edit-scheme.done');
                    };

                    $scope.addTransform = function () {

                        $scope.scheme.transforms.push({
                            id: Math.round(Math.random()*99999999999),
                            script: ''
                        });
                    };


                    /*============ LISTENERS ============*/

                    $scope.$on('ml-scheme-transform.scriptChanged', debounced_updateTransformedExamples);




                    /*============ INITIALIZATION ============*/
                }
            ],

            template: [

                '<div class="row">',
                    '<div class="col-xs-12">',

                        '<div class="row view-title">',

                            '<div class="col-xs-9">',
                                '<h2>Editing Scheme "<span class="emphasize">{{scheme.name}}</span>"</h2>',
                            '</div>',

                            '<div class="col-xs-3 text-right">',
                                '<button class="btn btn-primary" ng-click="done()"><i class="fa fa-check"></i> Done</button>',
                            '</div>',

                        '</div>',

                        '<div class="row">',

                            '<div class="col-xs-8">',

                                '<ng-form name="schemeForm">',

                                    '<div class="form-section">',
                                        '<label for="scheme-name">Scheme Name</label>',
                                        '<input id="scheme-name" class="form-control" type="text" ng-model="scheme.name"/>',
                                    '</div>',

                                    '<div class="form-section">',
                                        '<div class="row">',

                                            '<div class="col-xs-12">',
                                                '<label for="scheme-transforms">Scheme Transforms</label>',
                                            '</div>',

                                        '</div>',

                                        '<div class="row">',
                                            '<div class="col-xs-12">',

                                                '<div class="empty-stuff" ng-if="!scheme.transforms.length">',
                                                    'No transforms have been added yet...',
                                                '</div>',

                                                '<div>',
                                                    '<ml-scheme-transform class="anim-el-slide-left" ng-repeat="transform in scheme.transforms track by transform.id" transform="transformObj"></ml-scheme-transform>',
                                                '</div>',

                                                '<div class="text-right control-box">',

                                                    '<button class="btn btn-primary" ng-click="addTransform()" ng-disabled="creating">',
                                                        '<i class="fa fa-plus"></i>',
                                                        ' Add A Transform',
                                                    '</button>',

                                                '</div>',

                                            '</div>',
                                        '</div>',

                                    '</div>',

                                    '<div class="form-section">',
                                        '<div class="row">',

                                            '<div class="col-xs-12">',
                                                '<label for="scheme-transforms">Scheme Transform Examples (use cursor object)</label>',
                                            '</div>',

                                        '</div>',

                                        '<div class="row">',
                                            '<div class="col-xs-12">',

                                                '<pre>cursor.value(); // get the value at the current position</pre>',
                                                '<pre>cursor.value("B"); // set the value at the current position</pre>',

                                                '<pre>cursor.next(); // move the cursor forward</pre>',
                                                '<pre>cursor.back(); // move the cursor back</pre>',
                                                '<pre>cursor.first(); // move the cursor to the beginning</pre>',
                                                '<pre>cursor.last(); // move the cursor to the end</pre>',
                                                '<pre>cursor.moveTo(); // move cursor to a particular index</pre>',

                                                '<pre>cursor.find("A", function (cursor, i) {}); // find instances of an individual character</pre>',
                                                '<pre>cursor.vowels(function (cursor, i) {}); // find all vowels</pre>',
                                                '<pre>cursor.cons(function (cursor, i) {}); // find all consonants</pre>',

                                            '</div>',
                                        '</div>',

                                    '</div>',


                                '</ng-form>',

                            '</div>',

                            '<div class="col-xs-4">',

                                '<div class="form-section">',

                                    '<label for="scheme-transforms">Example Transformations</label>',

                                    '<div class="well">',

                                        '<div class="row">',

                                            '<div class="col-xs-12 text-center">',

                                                '<div class="example-string"><span class="example-string-before">PQLDUHTNG</span> <i class="fa fa-arrow-right"></i> <span class="example-string-after">PQLDUHTNG</span></div>',
                                                '<div class="example-string"><span class="example-string-before">PQLDUHTNG</span> <i class="fa fa-arrow-right"></i> <span class="example-string-after">PQLDUHTNG</span></div>',
                                                '<div class="example-string"><span class="example-string-before">PQLDUHTNG</span> <i class="fa fa-arrow-right"></i> <span class="example-string-after">PQLDUHTNG</span></div>',
                                                '<div class="example-string"><span class="example-string-before">PQLDUHTNG</span> <i class="fa fa-arrow-right"></i> <span class="example-string-after">PQLDUHTNG</span></div>',
                                                '<div class="example-string"><span class="example-string-before">PQLDUHTNG</span> <i class="fa fa-arrow-right"></i> <span class="example-string-after">PQLDUHTNG</span></div>',
                                                '<div class="example-string"><span class="example-string-before">PQLDUHTNG</span> <i class="fa fa-arrow-right"></i> <span class="example-string-after">PQLDUHTNG</span></div>',
                                                '<div class="example-string"><span class="example-string-before">PQLDUHTNG</span> <i class="fa fa-arrow-right"></i> <span class="example-string-after">PQLDUHTNG</span></div>',
                                                '<div class="example-string"><span class="example-string-before">PQLDUHTNG</span> <i class="fa fa-arrow-right"></i> <span class="example-string-after">PQLDUHTNG</span></div>',

                                            '</div>',

                                        '</div>',

                                    '</div>',
                                '</div>',

                            '</div>',
                        '</div>',

                    '</div>',
                '</div>'

            ].join('')
        };
    });

})();