(function () {

    angular.module('MachineLearning').service('StringTransformService', [

        'CursorClass',
        'SeededRandom',

        function (CursorClass, SeededRandom) {

            /*============ SERVICE DECLARATION ============*/

            var StringTransformService = {};


            /*============ PRIVATE METHODS AND VARIABLES ============*/

            var STRING_LENGTH = 10;

            var getRandomString = function (stringLength) {

                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

                SeededRandom.reset();

                for( var i=0; i < stringLength; i++) {
                    text += possible.charAt(Math.floor(SeededRandom.random() * possible.length));
                }

                return text;
            };

            var transformString = function (stringValue, transforms) {

                var cursor = new CursorClass(stringValue);

                var foundError = false;

                _.each(transforms, function (transform) {
                    cursor.first();

                    transform.error = false;

                    try {
                        eval(transform.script);
                    } catch (e) {
                        transform.error = e.toString();
                        foundError = true;
                    }
                });

                if (!foundError) {
                    return cursor.getText();
                } else {
                    return 'ERROR';
                }
            };


            /*============ SERVICE DEFINITION ============*/

            StringTransformService.generateStringTransformPairs = function (transforms, count) {

                var transformPairs = [];

                for (var i=0; i < count; i++) {

                    var beforeString = getRandomString(STRING_LENGTH);

                    transformPairs.push({
                        before: beforeString,
                        after: transformString(beforeString, transforms)
                    });
                }

                return transformPairs;
            };

            /*============ LISTENERS ============*/

            /*============ SERVICE PASSBACK ============*/

            return StringTransformService;
        }
    ]);

})();

